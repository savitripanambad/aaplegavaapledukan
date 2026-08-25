import React from 'react';
import { MessageCircle, Phone, MapPin, Star, Sparkles, CheckCircle, Clock, Heart, ArrowRight } from 'lucide-react';
import { Shop } from '../types';
import { openWhatsAppEnquiry, openPhoneCall } from '../utils/helpers';

interface ShopCardProps {
  shop: Shop;
  onSelectShop: (shop: Shop) => void;
  isSaved: boolean;
  onToggleSave: (shopId: string) => void;
  isMarathi: boolean;
}

export const ShopCard: React.FC<ShopCardProps> = ({
  shop,
  onSelectShop,
  isSaved,
  onToggleSave,
  isMarathi,
}) => {
  const topOffer = shop.offers && shop.offers.length > 0 ? shop.offers[0] : null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-orange-400/80 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* Top Banner Image with Badges */}
      <div>
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelectShop(shop)}>
          <img
            src={shop.bannerUrl || (shop.photoUrls && shop.photoUrls[0]) || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80'}
            alt={shop.marathiName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />

          {/* Gradient Overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent pointer-events-none" />

          {/* Top Left: Category & Verified */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 z-10">
            <span className="bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg shadow-sm">
              {isMarathi ? shop.categoryLabelMr : shop.categoryLabelEn}
            </span>
            {shop.isVerified && (
              <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                <CheckCircle className="w-3 h-3" />
                {isMarathi ? 'व्हेरिफाईड' : 'Verified'}
              </span>
            )}
          </div>

          {/* Top Right: Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(shop.id);
            }}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer z-10 ${
              isSaved
                ? 'bg-rose-500 text-white shadow-md scale-105'
                : 'bg-black/40 text-white hover:bg-white hover:text-rose-600 shadow-sm'
            }`}
            title="जतन करा"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>

          {/* Bottom on Image: Village / District & Rating */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs z-10">
            <div className="flex items-center gap-1 font-bold drop-shadow-sm truncate">
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="truncate">
                {shop.villageOrCity}, {isMarathi ? shop.district : shop.district}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-lg text-[11px] shrink-0 shadow-sm">
              <Star className="w-3 h-3 fill-slate-950" />
              <span>{shop.rating.toFixed(1)}</span>
              <span className="text-[10px] opacity-80 font-normal">({shop.totalReviews})</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 cursor-pointer" onClick={() => onSelectShop(shop)}>
          {/* Shop Marathi & English Names */}
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight group-hover:text-orange-600 transition-colors font-['Noto_Sans_Devanagari',sans-serif]">
            {isMarathi ? shop.marathiName : shop.name}
          </h3>

          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {isMarathi ? `संचालक: ${shop.ownerName}` : `Prop: ${shop.ownerName}`}
          </p>

          {/* Address & Landmark */}
          <p className="text-xs text-slate-600 mt-2 line-clamp-1 flex items-center gap-1">
            <span className="font-bold text-slate-700">{isMarathi ? 'पत्ता:' : 'Addr:'}</span>
            <span className="truncate">{shop.landmark ? `${shop.landmark}, ` : ''}{shop.fullAddress}</span>
          </p>

          {/* Timings */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{shop.openingHours}</span>
          </div>

          {/* Active Discount Offer Highlight if present */}
          {topOffer && (
            <div className="mt-3 p-2.5 bg-gradient-to-r from-rose-50 to-orange-50/80 rounded-xl border border-rose-200 flex items-start gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-rose-900 truncate">
                    {topOffer.title}
                  </span>
                  <span className="text-[10px] bg-rose-600 text-white font-black px-1.5 py-0.2 rounded shrink-0">
                    {topOffer.discountValue}
                  </span>
                </div>
                <p className="text-[11px] text-rose-700/90 line-clamp-1 mt-0.5">
                  {topOffer.description}
                </p>
              </div>
            </div>
          )}

          {/* Popular items tags */}
          {shop.productsServices && shop.productsServices.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {shop.productsServices.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md"
                >
                  {item}
                </span>
              ))}
              {shop.productsServices.length > 3 && (
                <span className="text-[10px] bg-orange-50 text-orange-800 font-bold px-1.5 py-0.5 rounded-md border border-orange-100">
                  +{shop.productsServices.length - 3} आणखी
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Footer: 1-Click WhatsApp & Call */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100 grid grid-cols-2 gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openWhatsAppEnquiry(shop, topOffer || undefined);
          }}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold shadow-xs hover:shadow-md hover:shadow-emerald-600/20 transition-all cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>{isMarathi ? 'व्हॉट्सॲप' : 'WhatsApp'}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            openPhoneCall(shop.mobile);
          }}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 active:scale-98 text-slate-800 border border-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <Phone className="w-3.5 h-3.5 text-slate-700" />
          <span>{isMarathi ? 'कॉल करा' : 'Call Shop'}</span>
        </button>
      </div>
    </div>
  );
};
