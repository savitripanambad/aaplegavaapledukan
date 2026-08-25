import React from 'react';
import { Search, MapPin, Sparkles, Filter, X, CheckCircle2, ChevronRight } from 'lucide-react';
import { Category, District } from '../types';

interface HeroSearchBannerProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: Category[];
  currentDistrict: District;
  currentVillage: string;
  onOpenLocationModal: () => void;
  onlyOffers: boolean;
  setOnlyOffers: (val: boolean) => void;
  onlyOpenNow: boolean;
  setOnlyOpenNow: (val: boolean) => void;
  totalShopsCount: number;
  isMarathi: boolean;
}

export const HeroSearchBanner: React.FC<HeroSearchBannerProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  currentDistrict,
  currentVillage,
  onOpenLocationModal,
  onlyOffers,
  setOnlyOffers,
  onlyOpenNow,
  setOnlyOpenNow,
  totalShopsCount,
  isMarathi,
}) => {
  return (
    <div className="relative bg-gradient-to-b from-orange-100/50 via-indigo-50/30 to-transparent pt-7 pb-5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Pitch Title */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-indigo-500/10 border border-orange-200/80 text-orange-700 px-4 py-1 rounded-full text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-spin" />
            <span>
              {isMarathi
                ? 'एका क्लिकवर शोधा आपल्या परिसरातील सर्व दुकाने'
                : '1-Click Local Shop Search & Direct WhatsApp Order'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug font-['Noto_Sans_Devanagari',sans-serif]">
            {isMarathi ? (
              <>
                आपल्या <span className="bg-gradient-to-r from-orange-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent underline decoration-orange-400 decoration-wavy underline-offset-4">गावातील व शहरातील</span> हवी ती दुकाने शोधा!
              </>
            ) : (
              <>
                Find every shop in your <span className="bg-gradient-to-r from-orange-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent">Village & City</span>
              </>
            )}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
            {isMarathi
              ? 'दुकानांचे पत्ते, मोबाईल नंबर, फोटो, सवलती व ऑफर्स थेट पहा आणि व्हॉट्सॲपवर संपर्क करा.'
              : 'Browse verified local shops, phone numbers, WhatsApp links, banners and daily deals across Maharashtra.'}
          </p>
        </div>

        {/* Big Search Bar with District Chip */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl shadow-slate-200/70 border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Location button inside search bar */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center justify-between sm:justify-start gap-2 px-3.5 py-2.5 rounded-xl bg-orange-50/80 hover:bg-orange-100/80 text-slate-800 text-xs sm:text-sm font-bold border border-orange-200 transition-colors shrink-0 cursor-pointer text-left shadow-2xs"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="truncate max-w-[140px] font-bold text-slate-900">
                {currentDistrict.id === 'all'
                  ? isMarathi ? 'सर्व महाराष्ट्र' : 'All Maharashtra'
                  : currentVillage !== 'सर्व' ? `${currentVillage}` : currentDistrict.nameMr}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Search Input */}
          <div className="flex-1 relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isMarathi
                  ? 'दुकानाचे नाव, वस्तू, औषधे, कपडे, किराणा किंवा गाव शोधा...'
                  : 'Search by shop name, item, grocery, clothes, village...'
              }
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-slate-50/70 hover:bg-slate-50 focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/40 border border-slate-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category horizontal scroll/chips */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-orange-600" />
              {isMarathi ? 'कॅटेगरी निवडा:' : 'Browse by Category:'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {totalShopsCount} {isMarathi ? 'दुकाने उपलब्ध' : 'shops found'}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white border-transparent shadow-md shadow-orange-500/25 scale-102 font-extrabold'
                      : 'bg-white hover:bg-orange-50/60 text-slate-700 border-slate-200 hover:border-orange-200 shadow-2xs'
                  }`}
                >
                  <span>{isMarathi ? cat.nameMr : cat.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Filter toggles */}
        <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/80">
          <button
            onClick={() => setOnlyOffers(!onlyOffers)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              onlyOffers
                ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                : 'bg-white hover:bg-rose-50/70 text-slate-700 border-slate-200'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${onlyOffers ? 'text-white' : 'text-rose-500'}`} />
            <span>{isMarathi ? '🎁 खास सवलती / ऑफर्स असलेली दुकाने' : 'Discount Offers Only'}</span>
          </button>

          <button
            onClick={() => setOnlyOpenNow(!onlyOpenNow)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              onlyOpenNow
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white hover:bg-emerald-50/70 text-slate-700 border-slate-200'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${onlyOpenNow ? 'text-white' : 'text-emerald-500'}`} />
            <span>{isMarathi ? '🟢 सध्या उघडी असलेली' : 'Open Now'}</span>
          </button>

          {(selectedCategory !== 'all' || searchQuery || onlyOffers || onlyOpenNow) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyOffers(false);
                setOnlyOpenNow(false);
              }}
              className="text-xs text-orange-600 hover:text-orange-800 underline font-semibold ml-auto cursor-pointer"
            >
              {isMarathi ? 'सर्व फिल्टर्स काढा' : 'Reset filters'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
