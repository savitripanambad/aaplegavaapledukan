import React, { useState } from 'react';
import { Store, MapPin, Sparkles, Heart, PlusCircle, UserCheck, ShieldCheck, Users, ShieldAlert, Volume2, VolumeX } from 'lucide-react';
import { District, Shop } from '../types';
import { playMarathiVoiceGreeting } from '../utils/audioGreeting';

interface HeaderProps {
  currentDistrict: District;
  currentVillage: string;
  onOpenLocationModal: () => void;
  onOpenAuthModal: () => void;
  onOpenSavedModal: () => void;
  savedShopsCount: number;
  loggedInShop: Shop | null;
  isAdminLoggedIn: boolean;
  onOpenDashboard: () => void;
  onOpenAdminLoginModal: () => void;
  onOpenAdminDashboard: () => void;
  activeTab: 'home' | 'offers' | 'workers' | 'dashboard' | 'admin';
  setActiveTab: (tab: 'home' | 'offers' | 'workers' | 'dashboard' | 'admin') => void;
  isMarathi: boolean;
  setIsMarathi: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDistrict,
  currentVillage,
  onOpenLocationModal,
  onOpenAuthModal,
  onOpenSavedModal,
  savedShopsCount,
  loggedInShop,
  isAdminLoggedIn,
  onOpenDashboard,
  onOpenAdminLoginModal,
  onOpenAdminDashboard,
  activeTab,
  setActiveTab,
  isMarathi,
  setIsMarathi,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-indigo-600 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="bg-white/25 text-white px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
              {isMarathi ? 'महाराष्ट्र' : 'Maharashtra'}
            </span>
            <span className="truncate text-[11px] sm:text-xs">
              {isMarathi
                ? '🚩 महाराष्ट्रातील प्रत्येक गावातील सर्व दुकाने व कारागीर एकाच ॲपमध्ये! दुकानदार व कामगार नोंदणी सुरू'
                : '🚩 Discover all local village & city shops & artisans in Maharashtra!'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => playMarathiVoiceGreeting('आपलं गाव, आपलं दुकान! आपल्या गावातील सर्व दुकाने आणि सेवा आता एकाच ठिकाणी.')}
              className="text-[11px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded flex items-center gap-1 font-bold cursor-pointer transition-transform active:scale-95"
              title="मराठी आवाज ऐका (Audio Greeting)"
            >
              <Volume2 className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span className="hidden xs:inline">आवाज (Audio)</span>
            </button>
            <button
              onClick={() => setIsMarathi(!isMarathi)}
              className="text-xs bg-black/25 hover:bg-black/40 text-white px-2.5 py-0.5 rounded-md border border-white/25 transition-colors font-semibold cursor-pointer shadow-2xs"
            >
              {isMarathi ? 'English' : 'मराठी'}
            </button>
            <button
              onClick={isAdminLoggedIn ? onOpenAdminDashboard : onOpenAdminLoginModal}
              className="text-[11px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded flex items-center gap-1 font-bold cursor-pointer"
            >
              <ShieldAlert className="w-3 h-3 text-amber-300" />
              <span>{isAdminLoggedIn ? 'अ‍ॅडमिन पॅनेल' : 'अ‍ॅडमिन लॉगिन'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 group-hover:shadow-orange-500/40 transition-all">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-lg sm:text-xl text-slate-900 tracking-tight leading-none font-['Noto_Sans_Devanagari',sans-serif] group-hover:text-orange-600 transition-colors">
                {isMarathi ? 'आपलं गावातील दुकान' : 'Aapla Gavatil Dukan'}
              </h1>
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {isMarathi ? 'डिजिटल गाव बाजार, दुकाने व कारागीर' : 'Village Shops & Artisans Hub'}
            </p>
          </div>
        </div>

        {/* Location selector chip */}
        <button
          onClick={onOpenLocationModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-orange-50/80 border border-slate-200 hover:border-orange-300 text-slate-800 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs hover:shadow-xs shrink-0"
        >
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600 shrink-0" />
          <span className="truncate max-w-[130px] sm:max-w-[180px]">
            {currentDistrict.id === 'all'
              ? isMarathi ? 'महाराष्ट्र (सर्व)' : 'All Maharashtra'
              : `${currentVillage !== 'सर्व' ? currentVillage + ', ' : ''}${isMarathi ? currentDistrict.nameMr : currentDistrict.nameEn}`}
          </span>
          <span className="text-[10px] text-orange-600 bg-white px-2 py-0.5 rounded-full font-bold shadow-2xs border border-orange-100">
            {isMarathi ? 'बदला' : 'Change'}
          </span>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Offers Quick Tab */}
          <button
            onClick={() => setActiveTab('offers')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'offers'
                ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>{isMarathi ? 'सवलती व ऑफर्स' : 'Discounts'}</span>
          </button>

          {/* Skilled Workers / Karagir Tab */}
          <button
            onClick={() => setActiveTab('workers')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'workers'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-600" />
            <span>{isMarathi ? 'कारागीर / कामगार' : 'Artisans'}</span>
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenSavedModal}
            className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-rose-600 transition-colors cursor-pointer"
            title="जतन केलेली दुकाने"
          >
            <Heart className="w-5 h-5 text-slate-600 hover:text-rose-600" />
            {savedShopsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-scaleIn shadow-2xs">
                {savedShopsCount}
              </span>
            )}
          </button>

          {/* Shopkeeper Dashboard or Register Button */}
          {loggedInShop ? (
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-bold shadow-sm shadow-emerald-600/20 transition-all cursor-pointer hover:shadow"
            >
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isMarathi ? 'माझे दुकान डॅशबोर्ड' : 'Shop Dashboard'}
              </span>
              <span className="sm:hidden">{isMarathi ? 'डॅशबोर्ड' : 'Dashboard'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all cursor-pointer hover:shadow-lg hover:shadow-orange-500/30"
            >
              <PlusCircle className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span className="hidden sm:inline">
                {isMarathi ? 'दुकानदार नोंदणी / लॉगिन' : 'Shopkeeper Register'}
              </span>
              <span className="sm:hidden">
                {isMarathi ? 'नोंदणी' : 'Register'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
