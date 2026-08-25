import React, { useState } from 'react';
import {
  Users,
  Search,
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Star,
  Clock,
  Wrench,
  Sparkles,
  PlusCircle,
  CheckCircle,
  Filter
} from 'lucide-react';
import { District, Worker } from '../types';
import { WORKER_PROFESSIONS } from '../data/initialData';
import { openWorkerWhatsAppEnquiry } from '../utils/helpers';

interface WorkersViewProps {
  workers: Worker[];
  districts: District[];
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
  onOpenWorkerRegistration: () => void;
  isMarathi: boolean;
}

export const WorkersView: React.FC<WorkersViewProps> = ({
  workers,
  districts,
  selectedDistrict,
  onSelectDistrict,
  onOpenWorkerRegistration,
  isMarathi,
}) => {
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWorkers = workers.filter((worker) => {
    // Only show approved and not disabled
    if (worker.approvalStatus === 'pending' || worker.isDisabled) return false;

    // Filter by district
    if (selectedDistrict !== 'all' && worker.district !== selectedDistrict) {
      return false;
    }

    // Filter by profession
    if (selectedProfession !== 'all' && worker.profession !== selectedProfession) {
      return false;
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchName = worker.name.toLowerCase().includes(term);
      const matchVillage = worker.villageOrCity.toLowerCase().includes(term);
      const matchProf = worker.professionLabelMr.toLowerCase().includes(term) || worker.professionLabelEn.toLowerCase().includes(term);
      const matchSkills = worker.skills.some((s) => s.toLowerCase().includes(term));
      if (!matchName && !matchVillage && !matchProf && !matchSkills) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Top Hero / Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 rounded-3xl p-5 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-indigo-500/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shrink-0 shadow-inner">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[10px] sm:text-xs font-black px-3 py-0.5 rounded-full backdrop-blur-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isMarathi ? 'गावातील कुशल कामगार व कारागीर' : 'Village Skilled Workers'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-['Noto_Sans_Devanagari',sans-serif]">
              {isMarathi ? 'वायरमन, लोहार, सुतार, प्लंबर - एका क्लिकवर शोधा' : 'Find Local Artisans & Technicians'}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 mt-0.5">
              {isMarathi
                ? 'ज्यांचे स्वतःचे दुकान नाही, अशा गावातील कुशल कारागिरांशी थेट व्हॉट्सॲप व कॉलद्वारे संपर्क साधा'
                : 'Directly connect with skilled local service providers for household & farm work'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenWorkerRegistration}
          className="self-start md:self-center px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-98 transition-all cursor-pointer flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isMarathi ? 'कामगार म्हणून नाव नोंदवा (मोफत)' : 'Register as Worker'}</span>
        </button>
      </div>

      {/* Search & District Selector */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isMarathi ? 'कामगार नाव, गाव, काम (उदा. वायरमन, सुतार, प्लंबर) शोधा...' : 'Search by name, village, skill...'}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
          <select
            value={selectedDistrict}
            onChange={(e) => onSelectDistrict(e.target.value)}
            className="px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {isMarathi ? d.nameMr : d.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Profession Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {WORKER_PROFESSIONS.map((prof) => {
          const isSelected = selectedProfession === prof.id;
          return (
            <button
              key={prof.id}
              onClick={() => setSelectedProfession(prof.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <span>{isMarathi ? prof.nameMr : prof.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Workers Grid */}
      {filteredWorkers.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-900">
            {isMarathi ? 'या भागात सध्या कोणताही कामगार उपलब्ध नाही' : 'No workers found'}
          </h3>
          <p className="text-xs text-slate-500">
            {isMarathi
              ? 'आपण गावातील पहिले कारागीर म्हणून नोंदणी करू शकता किंवा वेगळा जिल्हा/व्यवसाय निवडा.'
              : 'Try clearing filters or register as the first artisan in your area.'}
          </p>
          <button
            onClick={onOpenWorkerRegistration}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isMarathi ? 'कामगार नोंदणी करा' : 'Register as Worker'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header with Photo & Profession */}
                <div className="flex items-start gap-3.5">
                  <div className="relative">
                    <img
                      src={worker.photoUrl}
                      alt={worker.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-xs group-hover:scale-102 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    {worker.isVerified && (
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs" title="पडताळणी पूर्ण">
                        <CheckCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="bg-indigo-100 text-indigo-900 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                        {worker.professionLabelMr}
                      </span>
                      <span className="text-[11px] font-black text-amber-950 flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {worker.rating}
                      </span>
                    </div>

                    <h3 className="font-black text-base text-slate-900 mt-1 font-['Noto_Sans_Devanagari',sans-serif] truncate">
                      {worker.name}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{worker.villageOrCity}</span>
                    </div>
                  </div>
                </div>

                {/* Details & Experience */}
                <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">अनुभव:</span>
                    <span className="font-black text-slate-900">{worker.experienceYears} वर्षे अनुभव</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">अपेक्षित दर:</span>
                    <span className="font-black text-emerald-700">{worker.dailyRate}</span>
                  </div>
                  {worker.landmark && (
                    <div className="text-[11px] text-slate-500 truncate">
                      खूण: {worker.landmark}
                    </div>
                  )}
                </div>

                {/* Skills tags */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    {isMarathi ? 'प्रमुख कौशल्ये / कामे:' : 'Skills:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {worker.skills.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="bg-indigo-50 text-indigo-900 border border-indigo-200/60 text-[10px] font-bold px-2 py-0.5 rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {worker.bio && (
                  <p className="text-xs text-slate-600 line-clamp-2 italic">
                    "{worker.bio}"
                  </p>
                )}
              </div>

              {/* Action Buttons: WhatsApp & Call */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => openWorkerWhatsAppEnquiry(worker)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <a
                  href={`tel:${worker.mobile}`}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-black text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-300" />
                  <span>{isMarathi ? 'कॉल करा' : 'Call'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
