import React, { useState } from 'react';
import {
  X,
  Users,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  Upload,
  Zap,
  Hammer,
  Flame,
  Droplet,
  Palette,
  Building,
  Wrench,
  Tractor
} from 'lucide-react';
import { District, Worker, WorkerProfession, Taluka } from '../types';
import { WORKER_PROFESSIONS } from '../data/initialData';
import { compressImageFile } from '../utils/helpers';
import confetti from 'canvas-confetti';

interface WorkerRegistrationModalProps {
  onClose: () => void;
  onRegisterSuccess: (worker: Worker) => void;
  districts: District[];
  isMarathi: boolean;
}

export const WorkerRegistrationModal: React.FC<WorkerRegistrationModalProps> = ({
  onClose,
  onRegisterSuccess,
  districts,
  isMarathi,
}) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'form'>('phone');
  const [phone, setPhone] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('1234');
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('wireman');
  
  const validDistricts = districts.filter((d) => d.id !== 'all');
  const [selectedDistrictId, setSelectedDistrictId] = useState(validDistricts[0]?.id || 'satara');
  const activeDistrict = validDistricts.find((d) => d.id === selectedDistrictId) || validDistricts[0];
  const [selectedTalukaId, setSelectedTalukaId] = useState(activeDistrict?.talukas?.[0]?.id || '');
  const activeTaluka = activeDistrict?.talukas?.find((t) => t.id === selectedTalukaId) || activeDistrict?.talukas?.[0];

  const [villageOrCity, setVillageOrCity] = useState('');
  const [landmark, setLandmark] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [dailyRate, setDailyRate] = useState('₹६०० - ₹८०० / दिवस');
  const [skillsText, setSkillsText] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=600&q=80'
  );
  const [photoSizeKb, setPhotoSizeKb] = useState<number | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleDistrictChange = (distId: string) => {
    setSelectedDistrictId(distId);
    const targetDist = validDistricts.find((d) => d.id === distId);
    if (targetDist?.talukas && targetDist.talukas.length > 0) {
      setSelectedTalukaId(targetDist.talukas[0].id);
    } else {
      setSelectedTalukaId('');
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setErrorMsg(isMarathi ? 'कृपया १० अंकी मोबाईल नंबर टाका' : 'Please enter valid 10-digit number');
      return;
    }
    setErrorMsg('');
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
      setErrorMsg(isMarathi ? 'चुकीचा OTP टाकला आहे' : 'Incorrect OTP');
      return;
    }
    setErrorMsg('');
    setStep('form');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setErrorMsg('');
    try {
      const { dataUrl, sizeKb } = await compressImageFile(file, 500);
      setPhotoUrl(dataUrl);
      setPhotoSizeKb(sizeKb);
    } catch (err: any) {
      setErrorMsg(err?.message || 'फोटो अपलोड करताना त्रुटी आली.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleCompleteWorkerRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !villageOrCity.trim()) {
      setErrorMsg(isMarathi ? 'कृपया नाव व गाव भरा' : 'Please fill name and village');
      return;
    }

    const profObj = WORKER_PROFESSIONS.find((p) => p.id === profession) || WORKER_PROFESSIONS[1];
    const distObj = validDistricts.find((d) => d.id === selectedDistrictId) || validDistricts[0];

    const newWorker: Worker = {
      id: `worker-${Date.now()}`,
      name: name.trim(),
      profession: profession,
      professionLabelMr: profObj.nameMr,
      professionLabelEn: profObj.nameEn,
      mobile: phone,
      whatsapp: phone,
      district: distObj.id,
      villageOrCity: villageOrCity.trim(),
      landmark: landmark.trim() || undefined,
      experienceYears: Number(experienceYears) || 1,
      dailyRate: dailyRate.trim() || 'कामावर आधारित',
      skills: skillsText.trim()
        ? skillsText.split(',').map((s) => s.trim()).filter(Boolean)
        : profObj.popularWork,
      photoUrl: photoUrl,
      isAvailable: true,
      rating: 5.0,
      totalReviews: 1,
      bio: bio.trim() || `${profObj.nameMr} ची तत्पर सेवा. संपर्कासाठी कॉल किंवा व्हॉट्सॲप करा.`,
      joinedDate: new Date().toISOString().split('T')[0],
      isVerified: true,
      approvalStatus: 'approved',
      stats: {
        views: 1,
        calls: 0,
        whatsappInquiries: 0,
      },
    };

    confetti({ particleCount: 80, spread: 70 });
    onRegisterSuccess(newWorker);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-slate-950 p-4 sm:p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black font-['Noto_Sans_Devanagari',sans-serif]">
                {isMarathi ? 'कारागीर / कामगार मोफत नोंदणी' : 'Worker / Artisan Registration'}
              </h3>
              <p className="text-xs font-semibold text-slate-900/80">
                {isMarathi ? 'वायरमन, लोहार, सुतार, प्लंबर, ड्रायव्हर इ. साठी थेट काम मिळवा' : 'Get direct customer jobs without shop'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-slate-950 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-shake">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Phone */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center py-2">
                <div className="inline-flex p-3 rounded-2xl bg-amber-100 text-amber-700 mb-2">
                  <Phone className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-slate-900">
                  {isMarathi ? 'आपला मोबाईल नंबर टाका' : 'Enter Mobile Number'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {isMarathi
                    ? 'गावातील नागरिक थेट याच नंबरवर कॉल व व्हॉट्सॲप करतील'
                    : 'Villagers will contact you on this phone number'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isMarathi ? 'मोबाईल नंबर' : 'Mobile Number'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98XXXXXXXX"
                    className="w-full pl-12 pr-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isMarathi ? 'OTP पाठवा व नोंदणी करा' : 'Send OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs text-emerald-900 font-bold block">
                  {isMarathi ? '✓ कारागीर व कामगारांसाठी १००% मोफत नोंदणी!' : '✓ 100% Free Registration for Workers!'}
                </span>
              </div>
            </form>
          )}

          {/* STEP 2: OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center py-2">
                <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-700 mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-slate-900">
                  {isMarathi ? 'OTP पडताळणी' : 'OTP Verification'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {isMarathi ? `+91 ${phone} वर पाठवलेला OTP टाका` : `Enter OTP sent to +91 ${phone}`}
                </p>
                <div className="mt-2 inline-block bg-amber-100/90 text-slate-950 px-3 py-1 rounded-full text-xs font-black border border-amber-300">
                  {isMarathi ? `चाचणी OTP: ${generatedOtp} (किंवा 1234)` : `Test OTP: ${generatedOtp}`}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="1234"
                  className="w-full text-center tracking-[1em] text-2xl font-black py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500/40 font-mono text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isMarathi ? 'सत्यापित करा' : 'Verify & Continue'}</span>
              </button>
            </form>
          )}

          {/* STEP 3: Worker Profile Form */}
          {step === 'form' && (
            <form onSubmit={handleCompleteWorkerRegistration} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'आपले पूर्ण नाव *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isMarathi ? 'उदा. तानाजी मारुती माने' : 'e.g. Tanaji Mane'}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500/40 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'कामाचा प्रकार / व्यवसाय निवडा *' : 'Select Profession / Skill *'}
                </label>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-amber-500/40 text-slate-900 font-bold"
                >
                  {WORKER_PROFESSIONS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameMr} ({p.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* District, Taluka & Village */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isMarathi ? 'कामाचे ठिकाण (जिल्हा व तालुका):' : 'Work Area:'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      {isMarathi ? 'जिल्हा' : 'District'}
                    </label>
                    <select
                      value={selectedDistrictId}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-bold text-slate-900"
                    >
                      {validDistricts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nameMr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      {isMarathi ? 'तालुका' : 'Taluka'}
                    </label>
                    <select
                      value={selectedTalukaId}
                      onChange={(e) => setSelectedTalukaId(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white font-bold text-slate-900"
                    >
                      {activeDistrict.talukas && activeDistrict.talukas.length > 0 ? (
                        activeDistrict.talukas.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nameMr}
                          </option>
                        ))
                      ) : (
                        <option value="">सर्व तालुके</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    {isMarathi ? 'गाव / राहण्याचे ठिकाण *' : 'Village / Location *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={villageOrCity}
                    onChange={(e) => setVillageOrCity(e.target.value)}
                    placeholder={isMarathi ? 'उदा. फलटण, औंध, शेंद्रे' : 'Village name'}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500/40 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isMarathi ? 'कामाचा अनुभव (वर्षे)' : 'Experience (Years)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isMarathi ? 'अंदाजे दर / मजुरी' : 'Estimated Rate'}
                  </label>
                  <input
                    type="text"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(e.target.value)}
                    placeholder="उदा. ₹५००/दिवस किंवा कामावर"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'कोणती कामे करू शकता? (कॉमा देऊन लिहा)' : 'Special Skills'}
                </label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder={isMarathi ? 'उदा. वायरिंग, मोटर रिपेअर, इन्व्हर्टर फिटिंग' : 'House wiring, motor fitting'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              {/* Photo Upload with max 500 KB limit */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isMarathi ? 'आपला फोटो अपलोड करा (कमाल ५०० KB)' : 'Upload Photo (Max 500 KB)'}</span>
                  </label>
                  {photoSizeKb !== null && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                      {photoSizeKb} KB ✓
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg border border-dashed border-amber-400 text-xs font-bold text-amber-800">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isCompressing ? 'कंप्रेस होत आहे...' : (isMarathi ? 'फोटो निवडा' : 'Choose Photo')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isCompressing}
                      className="hidden"
                    />
                  </label>
                  {photoUrl && (
                    <img src={photoUrl} alt="Worker" className="w-12 h-12 rounded-xl object-cover border border-slate-300" referrerPolicy="no-referrer" />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isMarathi ? 'माझी प्रोफाइल मोफत जोडा' : 'Submit & Join for Free'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
