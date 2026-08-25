import React from 'react';
import { X, Heart, Trash2, ArrowRight, MessageCircle } from 'lucide-react';
import { Shop } from '../types';
import { openWhatsAppEnquiry } from '../utils/helpers';

interface SavedShopsModalProps {
  savedShops: Shop[];
  onClose: () => void;
  onSelectShop: (shop: Shop) => void;
  onRemoveSaved: (shopId: string) => void;
  isMarathi: boolean;
}

export const SavedShopsModal: React.FC<SavedShopsModalProps> = ({
  savedShops,
  onClose,
  onSelectShop,
  onRemoveSaved,
  isMarathi,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200">
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-white text-white" />
            <h3 className="text-base font-extrabold font-['Noto_Sans_Devanagari',sans-serif]">
              {isMarathi ? 'जतन केलेली दुकाने (Saved Shops)' : 'My Saved Shops'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3">
          {savedShops.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {isMarathi
                ? 'कोणतेही दुकान सेव्ह केलेले नाही. दुकानाच्या कार्डवरील ❤️ आयकॉनवर क्लिक करून जतन करा.'
                : 'No saved shops. Click the heart icon on any shop card to bookmark it.'}
            </div>
          ) : (
            savedShops.map((shop) => (
              <div
                key={shop.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 hover:bg-orange-50/40 hover:border-orange-200 transition-all"
              >
                <div
                  onClick={() => {
                    onSelectShop(shop);
                    onClose();
                  }}
                  className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                >
                  <img
                    src={shop.bannerUrl || (shop.photoUrls && shop.photoUrls[0]) || ''}
                    alt={shop.marathiName}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {isMarathi ? shop.marathiName : shop.name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {shop.villageOrCity}, {shop.district}
                    </p>
                    <span className="text-[10px] text-orange-600 font-bold bg-orange-100/70 px-1.5 py-0.5 rounded">
                      {isMarathi ? shop.categoryLabelMr : shop.categoryLabelEn}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => openWhatsAppEnquiry(shop)}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs transition-colors"
                    title="व्हॉट्सॲप"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                  </button>

                  <button
                    onClick={() => onRemoveSaved(shop.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                    title="काढून टाका"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
