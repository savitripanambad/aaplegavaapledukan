import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  User,
  Lock,
  Phone,
  Mail,
  MapPin,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Copy,
  Check,
  ArrowRight,
  CreditCard,
  Clock,
  Gift,
  Award,
  BadgePercent,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Agent, District } from '../types';
import {
  ADMIN_NAME_MR,
  ADMIN_UPI_ID,
  AGENCY_NAME_MR,
  AGENT_REGISTRATION_FEE,
  AGENT_REFERRAL_REWARD,
  AGENT_BONUS_AMOUNT,
  AGENT_BONUS_REFERRAL_THRESHOLD,
  generateAgentReferralCode,
  getUpiPaymentUrl
} from '../utils/helpers';
import { QRCodeDisplay } from './QRCodeDisplay';

interface AgentAuthModalProps {
  onClose: () => void;
  onAgentLoginSuccess: (agent: Agent) => void;
  allAgents: Agent[];
  districts: District[];
  isMarathi: boolean;
}

export const AgentAuthModal: React.FC<AgentAuthModalProps> = ({
  onClose,
  onAgentLoginSuccess,
  allAgents,
  districts,
  isMarathi,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'loginForm' | 'registerForm' | 'upiPayment'>('loginForm');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [agentName, setAgentName] = useState('');
  const [agentMobile, setAgentMobile] = useState('');
  const [agentWhatsapp, setAgentWhatsapp] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [agentUpiId, setAgentUpiId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Mobile OTP Verification State
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Location state
  const validDistricts = districts.filter((d) => d.id !== 'all');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(validDistricts[0]?.id || 'pune');
  const activeDistrict = districts.find((d) => d.id === selectedDistrictId) || validDistricts[0] || districts[0];
  const [selectedTalukaId, setSelectedTalukaId] = useState<string>(activeDistrict.talukas?.[0]?.id || '');
  const activeTaluka = activeDistrict.talukas?.find((t) => t.id === selectedTalukaId) || activeDistrict.talukas?.[0];
  const [villageOrCity, setVillageOrCity] = useState('');
  const [customVillage, setCustomVillage] = useState('');

  // Referral code generated
  const [agentRefCode, setAgentRefCode] = useState(() =>
    generateAgentReferralCode(activeDistrict?.nameEn?.slice(0, 3) || 'MH')
  );

  // Payment state
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedAdminUpi, setCopiedAdminUpi] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Handle District Change
  const handleDistrictChange = (distId: string) => {
    setSelectedDistrictId(distId);
    const newDist = districts.find((d) => d.id === distId);
    if (newDist && newDist.talukas && newDist.talukas.length > 0) {
      setSelectedTalukaId(newDist.talukas[0].id);
      setVillageOrCity(newDist.talukas[0].villages?.[0] || '');
      setAgentRefCode(generateAgentReferralCode(newDist.nameEn?.slice(0, 3) || 'MH'));
    }
  };

  // OTP generator
  const handleSendOtp = () => {
    setErrorMsg('');
    const cleanMobile = agentMobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMsg(isMarathi ? 'कृपया वैध १० अंकी मोबाईल नंबर टाका' : 'Please enter valid 10-digit mobile number');
      return;
    }

    setIsSendingOtp(true);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setTimeout(() => {
      setGeneratedOtp(otp);
      setIsSendingOtp(false);
      setSuccessMsg(isMarathi ? `आपला ४ अंकी पडताळणी ओटीपी कोड: ${otp}` : `Your OTP code: ${otp}`);
    }, 400);
  };

  const handleVerifyOtp = () => {
    setErrorMsg('');
    if (!enteredOtp || enteredOtp.trim() !== generatedOtp) {
      setErrorMsg(isMarathi ? 'चुकीचा ओटीपी टाकला आहे! कृपया पुन्हा तपासा.' : 'Invalid OTP code! Please check.');
      return;
    }

    setIsMobileVerified(true);
    setSuccessMsg(isMarathi ? '✓ मोबाईल नंबरची पडताळणी यशस्वी झाली!' : '✓ Mobile number verified successfully!');
  };

  // 1. Agent Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const input = loginIdentifier.trim();
    if (!input || !loginPassword.trim()) {
      setErrorMsg(isMarathi ? 'कृपया युजरनेम/मोबाईल आणि पासवर्ड टाका' : 'Please enter Mobile/Code and Password');
      return;
    }

    const cleanPhone = input.replace(/\D/g, '');
    const lowerInput = input.toLowerCase();

    const found = allAgents.find((a) => {
      const matchPhone = cleanPhone.length >= 10 && a.mobile.replace(/\D/g, '') === cleanPhone;
      const matchCode = a.referralCode && a.referralCode.toLowerCase() === lowerInput;
      const matchEmail = a.email && a.email.toLowerCase() === lowerInput;
      return matchPhone || matchCode || matchEmail;
    });

    if (!found) {
      setErrorMsg(
        isMarathi
          ? 'या माहितीनुसार कोणताही नोंदणीकृत एजंट सापडला नाही. कृपया अचूक माहिती भरा किंवा नवीन एजंट नोंदणी करा.'
          : 'No agent found with this mobile or referral code. Please check or register as a new agent.'
      );
      return;
    }

    if (found.password && found.password !== loginPassword.trim()) {
      setErrorMsg(isMarathi ? 'चुकीचा पासवर्ड टाकला आहे! कृपया पुन्हा प्रयत्न करा.' : 'Incorrect password! Please try again.');
      return;
    }

    confetti({ particleCount: 60, spread: 70 });
    onAgentLoginSuccess(found);
  };

  // 2. Go to Payment
  const handleGoToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!agentName.trim() || !agentUpiId.trim()) {
      setErrorMsg(isMarathi ? 'कृपया नाव आणि UPI आयडी प्रविष्ट करा' : 'Please enter your name and UPI ID');
      return;
    }

    const cleanMobile = agentMobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMsg(isMarathi ? 'कृपया वैध १० अंकी मोबाईल नंबर टाका' : 'Please enter valid 10-digit mobile number');
      return;
    }

    if (!isMobileVerified) {
      setErrorMsg(isMarathi ? 'कृपया पुढे जाण्यापूर्वी मोबाईल नंबरची OTP द्वारे पडताळणी करा.' : 'Please verify mobile number with OTP first.');
      return;
    }

    if (!regPassword.trim() || regPassword.length < 4) {
      setErrorMsg(isMarathi ? 'कृपया किमान ४ अक्षरी सुरक्षित पासवर्ड तयार करा' : 'Please create a password of at least 4 characters');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg(isMarathi ? 'पासवर्ड आणि कन्फर्म पासवर्ड जुळत नाहीत' : 'Passwords do not match');
      return;
    }

    if (!acceptedTerms) {
      setErrorMsg(
        isMarathi
          ? 'कृपया सावित्री मल्टीसर्विसेसचे नियम व अटी (नोंदणी फी ₹५१ नॉन-रिफंडेबल) मान्य करा'
          : 'Please accept Terms & Conditions before proceeding'
      );
      return;
    }

    setStep('upiPayment');
  };

  // 3. Complete Agent Registration
  const handleCompleteRegistration = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' });

    const finalVillage = villageOrCity === 'other' ? (customVillage.trim() || 'महाराष्ट्र गाव') : villageOrCity;

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: agentName.trim(),
      mobile: agentMobile.replace(/\D/g, ''),
      email: agentEmail.trim() || undefined,
      password: regPassword,
      district: activeDistrict.nameMr,
      taluka: activeTaluka?.nameMr || undefined,
      villageOrCity: finalVillage || activeDistrict.nameMr,
      upiId: agentUpiId.trim(),
      referralCode: agentRefCode,
      joinedDate: todayStr,
      isPaid: true,
      approvalStatus: 'approved',
      totalReferrals: 0,
      totalEarnings: 0,
      claimedAmount: 0,
      paymentDetails: {
        amount: AGENT_REGISTRATION_FEE,
        date: todayStr,
        time: timeStr,
        upiId: ADMIN_UPI_ID,
        utrNumber: utrNumber.trim() || `AGT-UPI-${Date.now().toString().slice(-6)}`,
        status: 'completed',
      },
      claimRequests: [],
      referredShops: [],
    };

    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    onAgentLoginSuccess(newAgent);
  };

  const handleCopyAdminUpi = () => {
    navigator.clipboard.writeText(ADMIN_UPI_ID);
    setCopiedAdminUpi(true);
    setTimeout(() => setCopiedAdminUpi(false), 2000);
  };

  const upiPaymentUri = getUpiPaymentUrl(AGENT_REGISTRATION_FEE, 'Agent Registration Fee - Aapla Gavatil Dukan');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-['Noto_Sans_Devanagari',sans-serif]">
      <div className="bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-rose-700 text-white p-4 sm:p-5 relative shadow-md shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <BadgePercent className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                  कमाई संधी
                </span>
                <span className="text-xs text-purple-200">गावातील अधिकृत प्रतिनिधी</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black">
                {authMode === 'login' ? (isMarathi ? 'एजंट / प्रतिनिधी लॉगिन' : 'Agent Login') : (isMarathi ? 'नवीन एजंट नोंदणी (₹५१)' : 'New Agent Registration (₹51)')}
              </h2>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-white/20">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setStep('loginForm');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
                authMode === 'login' && step === 'loginForm'
                  ? 'bg-white text-indigo-950 shadow-md scale-102'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isMarathi ? '🔑 एजंट लॉगिन' : '🔑 Agent Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setStep('registerForm');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer ${
                authMode === 'register' || step === 'registerForm' || step === 'upiPayment'
                  ? 'bg-white text-indigo-950 shadow-md scale-102'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isMarathi ? '✨ नवीन एजंट नोंदणी (₹५१)' : '✨ Register as Agent (₹51)'}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-shake flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: Agent Login */}
          {authMode === 'login' && step === 'loginForm' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mx-auto mb-1">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {isMarathi ? 'अधिकृत एजंट डॅशबोर्ड लॉगिन' : 'Authorized Agent Login'}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {isMarathi
                    ? 'आपला नोंदणीकृत मोबाईल नंबर किंवा रेफरल कोड (उदा. AGT-PUN-XXXX) व पासवर्ड टाका'
                    : 'Enter your Mobile Number or Referral Code & Password'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'मोबाईल नंबर / एजंट रेफरल कोड *' : 'Mobile Number / Referral Code *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={isMarathi ? 'उदा. 98XXXXXXXX किंवा AGT-PUN-8491' : 'e.g. 98XXXXXXXX or AGT-PUN-8491'}
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/40 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'लॉगिन पासवर्ड *' : 'Login Password *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/40 text-slate-900 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{isMarathi ? 'एजंट पोर्टलमध्ये लॉगिन करा' : 'Login to Agent Portal'}</span>
              </button>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <span className="text-xs text-slate-600">
                  {isMarathi ? 'अद्याप एजंट नोंदणी केली नाही का?' : "Not registered as an agent yet?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setStep('registerForm');
                    setErrorMsg('');
                  }}
                  className="block mx-auto text-xs font-black text-indigo-600 hover:text-indigo-700 cursor-pointer"
                >
                  {isMarathi ? '→ एजंट बना व दर दुकानावर ₹३ + ₹१०० बोनस कमवा (फक्त ₹५१)' : '→ Join as Agent (₹51)'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Agent Registration Form */}
          {authMode === 'register' && step === 'registerForm' && (
            <form onSubmit={handleGoToPayment} className="space-y-4">
              {/* Agent Benefits Banner */}
              <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl border border-amber-300/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-black text-xs">
                  <Gift className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{isMarathi ? 'एजंट कमिशन व कमाईची रचना (Earning Rules):' : 'Agent Referral Plan:'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
                    <span className="font-bold text-slate-900 block">💰 थेट रेफरल कमाई:</span>
                    <span className="text-emerald-700 font-extrabold">₹{AGENT_REFERRAL_REWARD} प्रति यशस्वी दुकान</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-amber-200/60">
                    <span className="font-bold text-slate-900 block">🏆 विशेष ५० बोनस:</span>
                    <span className="text-indigo-700 font-extrabold">+₹{AGENT_BONUS_AMOUNT} दर ५० दुकानांनंतर</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-600">
                  {isMarathi
                    ? 'गावातील दुकानदारांना ॲपमध्ये जोडा आणि थेट आपल्या UPI वर विनाअडथळा पैसे काढा.'
                    : 'Add village shopkeepers and withdraw earned amount directly to your UPI.'}
                </p>
              </div>

              {/* Auto Generated Agent Referral Code Display */}
              <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">
                    {isMarathi ? 'आपला नियुक्त एजंट रेफरल कोड:' : 'Your Agent Referral Code:'}
                  </span>
                  <span className="text-sm font-black font-mono text-indigo-950">
                    {agentRefCode}
                  </span>
                </div>
                <span className="text-xs bg-purple-200/70 text-purple-900 font-bold px-2 py-1 rounded-md">
                  अद्वितीय (Unique)
                </span>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isMarathi ? 'आपले पूर्ण नाव *' : 'Your Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder={isMarathi ? 'उदा. राहुल रमेश शिंदे' : 'e.g. Rahul Shinde'}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isMarathi ? 'कमाई जमा करण्यासाठी UPI ID *' : 'UPI ID for Payouts *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={agentUpiId}
                    onChange={(e) => setAgentUpiId(e.target.value)}
                    placeholder="98XXXXXXXX@ybl / @paytm"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono text-slate-900"
                  />
                </div>
              </div>

              {/* Mobile Number & OTP Verification */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-indigo-600" />
                    <span>{isMarathi ? 'मोबाईल नंबर व OTP पडताळणी *' : 'Mobile & OTP Verification *'}</span>
                  </label>
                  {isMobileVerified ? (
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-md border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {isMarathi ? 'पडताळणी पूर्ण (Verified)' : 'Verified'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-md">
                      पडताळणी आवश्यक
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    disabled={isMobileVerified}
                    value={agentMobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setAgentMobile(val);
                      if (!agentWhatsapp) setAgentWhatsapp(val);
                      setIsMobileVerified(false);
                      setGeneratedOtp(null);
                    }}
                    placeholder="98XXXXXXXX"
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 text-slate-900 font-semibold bg-white"
                  />

                  {!isMobileVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp || agentMobile.replace(/\D/g, '').length < 10}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{generatedOtp ? (isMarathi ? 'पुन्हा पाठवा' : 'Resend') : (isMarathi ? 'OTP मिळवा' : 'Send OTP')}</span>
                    </button>
                  )}
                </div>

                {/* OTP Input Box if OTP is generated and not yet verified */}
                {generatedOtp && !isMobileVerified && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-amber-950">
                        {isMarathi ? '४-अंकी पडताळणी कोड:' : '4-Digit OTP Code:'}
                      </span>
                      <span className="font-mono font-black text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-md">
                        {generatedOtp}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        placeholder="1234"
                        className="w-28 text-center text-sm font-black font-mono py-1.5 rounded-xl border border-amber-300 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isMarathi ? 'ओटीपी तपासा (Verify)' : 'Verify OTP'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Password Setup */}
              <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 space-y-2">
                <div className="font-bold text-xs text-purple-950 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <span>{isMarathi ? 'एजंट लॉगिन पासवर्ड तयार करा *' : 'Create Agent Login Password *'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isMarathi ? 'पासवर्ड (किमान ४ अक्षरे) *' : 'Password *'}
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-3 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono bg-white text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 p-0.5"
                      >
                        {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isMarathi ? 'पासवर्डची पुष्टी करा *' : 'Confirm Password *'}
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 font-mono bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Location Mapping */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>{isMarathi ? 'कार्यक्षेत्र (जिल्हा, तालुका व मुख्य गाव):' : 'Location (District, Taluka & Village):'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {isMarathi ? 'जिल्हा निवडा *' : 'Select District *'}
                    </label>
                    <select
                      value={selectedDistrictId}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-bold"
                    >
                      {validDistricts.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                          {dist.nameMr} ({dist.nameEn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {isMarathi ? 'तालुका निवडा *' : 'Select Taluka *'}
                    </label>
                    <select
                      value={selectedTalukaId}
                      onChange={(e) => {
                        setSelectedTalukaId(e.target.value);
                        const t = activeDistrict.talukas?.find((item) => item.id === e.target.value);
                        if (t && t.villages && t.villages.length > 0) {
                          setVillageOrCity(t.villages[0]);
                        }
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-bold"
                    >
                      {activeDistrict.talukas && activeDistrict.talukas.length > 0 ? (
                        activeDistrict.talukas.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nameMr} ({t.nameEn})
                          </option>
                        ))
                      ) : (
                        <option value="">सर्व तालुके</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {isMarathi ? 'गाव / शहराचे नाव *' : 'Village / City Name *'}
                  </label>
                  <select
                    value={villageOrCity}
                    onChange={(e) => setVillageOrCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-bold"
                  >
                    {activeTaluka?.villages?.map((v, i) => (
                      <option key={i} value={v}>
                        {v}
                      </option>
                    ))}
                    <option value="other">{isMarathi ? 'इतर गाव (Other Village)' : 'Other Village'}</option>
                  </select>

                  {villageOrCity === 'other' && (
                    <input
                      type="text"
                      required
                      value={customVillage}
                      onChange={(e) => setCustomVillage(e.target.value)}
                      placeholder={isMarathi ? 'आपल्या गावाचे नाव टाईप करा' : 'Type your village name'}
                      className="mt-2 w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                  )}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="p-3 bg-slate-50 rounded-2xl border-2 border-indigo-200 space-y-1.5">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="agentTermsCheckbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="agentTermsCheckbox" className="text-xs text-slate-800 leading-snug cursor-pointer">
                    <span className="font-bold text-slate-900">
                      {isMarathi
                        ? `मी सावित्री मल्टीसर्विसेसचे अधिकृत एजंट नियम व अटी (नोंदणी फी ₹${AGENT_REGISTRATION_FEE} नॉन-रिफंडेबल) मान्य करतो.`
                        : `I accept the Agent terms & conditions (₹${AGENT_REGISTRATION_FEE} non-refundable).`}
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isMarathi ? `पुढील पायरी: ₹${AGENT_REGISTRATION_FEE} पेमेंट करा` : `Next: Pay ₹${AGENT_REGISTRATION_FEE} via UPI`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: Agent Fee Payment (₹51) */}
          {step === 'upiPayment' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center py-1">
                <div className="inline-flex p-3 rounded-2xl bg-purple-100 text-purple-700 mb-2 shadow-2xs">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {isMarathi ? `अधिकृत एजंट नोंदणी शुल्क (₹${AGENT_REGISTRATION_FEE} UPI पेमेंट)` : `Pay ₹${AGENT_REGISTRATION_FEE} Agent Registration Fee`}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {isMarathi ? 'स्कॅन करून थेट ₹५१ पेमेंट करा आणि त्वरित एजंट आयडी मिळवा.' : 'Scan QR code and complete ₹51 payment'}
                </p>
              </div>

              {/* QR Box */}
              <div className="p-5 bg-slate-950 text-white rounded-3xl text-center space-y-4 shadow-xl border border-slate-800">
                <div className="flex justify-center">
                  <QRCodeDisplay
                    value={upiPaymentUri}
                    size={175}
                    showDownload={true}
                    downloadFileName="agent-registration-qr.png"
                    label={isMarathi ? 'GPay / PhonePe / Paytm ने स्कॅन करा' : 'Scan via UPI'}
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="text-xs text-amber-300 font-bold">
                    {ADMIN_NAME_MR} ({AGENCY_NAME_MR})
                  </div>
                  <div className="font-mono text-sm font-black text-amber-300 bg-white/10 py-1.5 px-3.5 rounded-xl inline-flex items-center gap-2 border border-white/20">
                    <span>{ADMIN_UPI_ID}</span>
                    <button
                      type="button"
                      onClick={handleCopyAdminUpi}
                      className="p-1 text-amber-300 hover:text-white cursor-pointer bg-white/10 rounded-md"
                    >
                      {copiedAdminUpi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-base font-black text-white">
                    रक्कम: <span className="text-amber-400">₹{AGENT_REGISTRATION_FEE}.००</span> (नॉन-रिफंडेबल)
                  </div>
                </div>

                <a
                  href={upiPaymentUri}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs sm:text-sm shadow-lg transition-all w-full active:scale-98"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isMarathi ? `थेट UPI ॲप उघडा (Pay ₹${AGENT_REGISTRATION_FEE})` : `Open UPI App to Pay ₹${AGENT_REGISTRATION_FEE}`}</span>
                </a>
              </div>

              {/* UTR Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {isMarathi ? 'पेमेंट Transaction UTR / संदर्भ नंबर (ऐच्छिक):' : 'Transaction UTR / Ref No (Optional):'}
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="उदा. 4235XXXXXXXX किंवा UPI संदर्भ नंबर"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-mono text-slate-900"
                />
              </div>

              <button
                type="button"
                onClick={handleCompleteRegistration}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isMarathi ? 'पेमेंट पूर्ण झाले, एजंट डॅशबोर्ड सुरू करा!' : 'Payment Done, Open Agent Dashboard!'}</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('registerForm')}
                className="w-full text-xs text-slate-500 hover:text-slate-800 text-center font-bold cursor-pointer py-1"
              >
                {isMarathi ? '← फॉर्ममध्ये बदल करा' : '← Edit Form Details'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
