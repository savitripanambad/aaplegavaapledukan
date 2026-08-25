import React from 'react';
import { Home, Sparkles, UserCheck, PlusCircle, Users, ShieldAlert, BadgePercent } from 'lucide-react';
import { Shop, Agent } from '../types';

interface MobileBottomNavProps {
  activeTab: 'home' | 'offers' | 'workers' | 'dashboard' | 'agent' | 'admin';
  setActiveTab: (tab: 'home' | 'offers' | 'workers' | 'dashboard' | 'agent' | 'admin') => void;
  loggedInShop: Shop | null;
  loggedInAgent?: Agent | null;
  isAdminLoggedIn: boolean;
  onOpenAuthModal: () => void;
  onOpenAgentAuthModal?: () => void;
  onOpenAdminLoginModal: () => void;
  isMarathi: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  loggedInShop,
  loggedInAgent,
  isAdminLoggedIn,
  onOpenAuthModal,
  onOpenAgentAuthModal,
  onOpenAdminLoginModal,
  isMarathi,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 z-40 py-1.5 px-2 shadow-xl">
      <div className="grid grid-cols-5 gap-1 text-center">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home' ? 'text-orange-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] sm:text-[10px] leading-none font-bold">{isMarathi ? 'मुख्य' : 'Home'}</span>
        </button>

        {/* Offers */}
        <button
          onClick={() => setActiveTab('offers')}
          className={`flex flex-col items-center gap-0.5 py-1 rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'offers' ? 'text-rose-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-5 h-5 text-rose-500" />
          <span className="text-[9px] sm:text-[10px] leading-none font-bold">{isMarathi ? 'ऑफर्स' : 'Deals'}</span>
        </button>

        {/* Skilled Workers / Karagir */}
        <button
          onClick={() => setActiveTab('workers')}
          className={`flex flex-col items-center gap-0.5 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'workers' ? 'text-indigo-600 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-5 h-5 text-indigo-600" />
          <span className="text-[9px] sm:text-[10px] leading-none font-bold">{isMarathi ? 'कारागीर' : 'Workers'}</span>
        </button>

        {/* Agent or Register / Shopkeeper Dashboard */}
        {loggedInAgent ? (
          <button
            onClick={() => setActiveTab('agent')}
            className={`flex flex-col items-center gap-0.5 py-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'agent' ? 'text-purple-600 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BadgePercent className="w-5 h-5 text-purple-600" />
            <span className="text-[9px] sm:text-[10px] leading-none font-bold">{isMarathi ? 'एजंट' : 'Agent'}</span>
          </button>
        ) : loggedInShop ? (
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-0.5 py-1 rounded-xl transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'text-orange-600 font-black' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-5 h-5 text-orange-600" />
            <span className="text-[9px] sm:text-[10px] leading-none font-bold">{isMarathi ? 'दुकानदार' : 'Shop'}</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex flex-col items-center gap-0.5 py-1 rounded-xl text-orange-600 font-black cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 flex items-center justify-center -mt-1 shadow-md shadow-orange-500/20">
              <PlusCircle className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="text-[9px] sm:text-[10px] leading-none font-bold">{isMarathi ? 'नोंदणी' : 'Register'}</span>
          </button>
        )}

        {/* Admin Tab */}
        <button
          onClick={() => {
            if (isAdminLoggedIn) {
              setActiveTab('admin');
            } else {
              onOpenAdminLoginModal();
            }
          }}
          className={`flex flex-col items-center gap-0.5 py-1 rounded-xl transition-all cursor-pointer ${
            activeTab === 'admin' ? 'text-slate-950 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-5 h-5 text-slate-700" />
          <span className="text-[9px] sm:text-[10px] leading-none font-bold">{isMarathi ? 'अ‍ॅडमिन' : 'Admin'}</span>
        </button>
      </div>
    </div>
  );
};
