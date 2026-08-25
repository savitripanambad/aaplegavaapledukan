import React, { useState } from 'react';
import { X, MapPin, Check, Search, ChevronRight } from 'lucide-react';
import { District, Taluka } from '../types';

interface VillageSelectorModalProps {
  districts: District[];
  currentDistrict: District;
  currentVillage: string;
  onSelectLocation: (district: District, village: string) => void;
  onClose: () => void;
  isMarathi: boolean;
}

export const VillageSelectorModal: React.FC<VillageSelectorModalProps> = ({
  districts,
  currentDistrict,
  currentVillage,
  onSelectLocation,
  onClose,
  isMarathi,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<District>(currentDistrict);
  const [selectedTaluka, setSelectedTaluka] = useState<Taluka | null>(
    currentDistrict.talukas && currentDistrict.talukas.length > 0 ? currentDistrict.talukas[0] : null
  );
  const [customVillageInput, setCustomVillageInput] = useState('');
  const [searchDistrictQuery, setSearchDistrictQuery] = useState('');

  const filteredDistricts = districts.filter(
    (d) =>
      d.nameMr.toLowerCase().includes(searchDistrictQuery.toLowerCase()) ||
      d.nameEn.toLowerCase().includes(searchDistrictQuery.toLowerCase())
  );

  const handleDistrictChange = (dist: District) => {
    setSelectedDistrict(dist);
    if (dist.talukas && dist.talukas.length > 0) {
      setSelectedTaluka(dist.talukas[0]);
    } else {
      setSelectedTaluka(null);
    }
  };

  const handleApplyCustomVillage = (e: React.FormEvent) => {
    e.preventDefault();
    if (customVillageInput.trim()) {
      onSelectLocation(selectedDistrict, customVillageInput.trim());
      onClose();
    }
  };

  const handleSelectVillage = (villageName: string) => {
    onSelectLocation(selectedDistrict, villageName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-950 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-black font-['Noto_Sans_Devanagari',sans-serif]">
                {isMarathi ? 'आपला जिल्हा, तालुका व गाव निवडा' : 'Select District, Taluka & Village'}
              </h3>
              <p className="text-[11px] font-semibold text-slate-900/80">
                {isMarathi ? 'महाराष्ट्रातील सर्व ३६ जिल्हे व तालुके' : 'All 36 Districts & Talukas in Maharashtra'}
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

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* 1. DISTRICT SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center">१</span>
                <span>{isMarathi ? 'जिल्हा निवडा (District):' : 'Select District:'}</span>
              </label>
              <div className="relative w-44">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchDistrictQuery}
                  onChange={(e) => setSearchDistrictQuery(e.target.value)}
                  placeholder={isMarathi ? 'जिल्हा शोधा...' : 'Search district...'}
                  className="w-full pl-7 pr-2.5 py-1 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-slate-50 rounded-2xl border border-slate-200">
              {filteredDistricts.map((dist) => {
                const isSelected = selectedDistrict.id === dist.id;
                return (
                  <button
                    key={dist.id}
                    onClick={() => handleDistrictChange(dist)}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer truncate flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-xs font-black'
                        : 'bg-white hover:bg-orange-50/70 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span className="truncate">{isMarathi ? dist.nameMr : dist.nameEn}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-slate-950" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. TALUKA SELECTOR (If district has talukas) */}
          {selectedDistrict.talukas && selectedDistrict.talukas.length > 0 && selectedDistrict.id !== 'all' && (
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center">२</span>
                <span>
                  {isMarathi
                    ? `${selectedDistrict.nameMr} मधील तालुका निवडा (Taluka):`
                    : `Select Taluka in ${selectedDistrict.nameEn}:`}
                </span>
              </label>

              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-amber-50/50 rounded-2xl border border-amber-200/80">
                {selectedDistrict.talukas.map((taluka) => {
                  const isSelected = selectedTaluka?.id === taluka.id;
                  return (
                    <button
                      key={taluka.id}
                      onClick={() => setSelectedTaluka(taluka)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                          : 'bg-white hover:bg-amber-100/70 text-slate-800 border border-amber-200'
                      }`}
                    >
                      <span>{isMarathi ? taluka.nameMr : taluka.nameEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. VILLAGE / CITY SELECTION */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">३</span>
              <span>
                {isMarathi
                  ? selectedTaluka
                    ? `${selectedTaluka.nameMr} (तालुका) मधील गाव / शहर निवडा:`
                    : `${selectedDistrict.nameMr} मधील गाव / शहर निवडा:`
                  : `Select Village/City:`}
              </span>
            </label>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
              <button
                onClick={() => handleSelectVillage('सर्व')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentDistrict.id === selectedDistrict.id && currentVillage === 'सर्व'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold'
                }`}
              >
                {isMarathi
                  ? selectedTaluka
                    ? `सर्व ${selectedTaluka.nameMr} तालुका`
                    : `सर्व ${selectedDistrict.nameMr}`
                  : 'All Locations'}
              </button>

              {/* Villages from selected taluka or district */}
              {(selectedTaluka ? selectedTaluka.villages : selectedDistrict.popularVillages).map((villageName, idx) => {
                const isSelected = currentDistrict.id === selectedDistrict.id && currentVillage === villageName;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectVillage(villageName)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-xs'
                        : 'bg-white hover:bg-orange-50 text-slate-800 border border-slate-200'
                    }`}
                  >
                    {villageName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Custom Village Name Search / Input */}
          <form onSubmit={handleApplyCustomVillage} className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isMarathi ? 'किंवा इतर कोणत्याही गावाचे / वाडीचे नाव थेट लिहा:' : 'Or type your custom village name:'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customVillageInput}
                onChange={(e) => setCustomVillageInput(e.target.value)}
                placeholder={isMarathi ? 'उदा. फलटण, कासेगाव, शेंद्रे, ओतूर...' : 'Type village name...'}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs shrink-0"
              >
                {isMarathi ? 'लागू करा' : 'Apply'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
