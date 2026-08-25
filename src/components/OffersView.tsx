import React from 'react';
import { Sparkles, MessageCircle, MapPin, Tag, Store, Clock, ArrowRight } from 'lucide-react';
import { Shop, Offer } from '../types';
import { openWhatsAppEnquiry } from '../utils/helpers';

interface OffersViewProps {
  shops: Shop[];
  onSelectShop: (shop: Shop) => void;
  isMarathi: boolean;
}

export const OffersView: React.FC<OffersViewProps> = ({
  shops,
  onSelectShop,
  isMarathi,
}) => {
  // Collect all active offers paired with their respective shop
  const allOffersWithShop = shops.flatMap((shop) =>
    (shop.offers || []).map((offer) => ({
      offer,
      shop,
    }))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Title */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black w-fit mb-3 border border-white/30 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>{isMarathi ? 'महाराष्ट्रातील सर्व दुकानांच्या खास सवलती' : 'Maharashtra Local Shop Deals'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Noto_Sans_Devanagari',sans-serif] tracking-tight">
            {isMarathi ? 'ग्राहकांसाठी धमाकेदार सवलती व ऑफर्स' : 'Exclusive Village & City Discounts'}
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 mt-2 max-w-2xl font-medium leading-relaxed">
            {isMarathi
              ? 'आपल्या गावातील किराणा, कपडे, इलेक्ट्रॉनिक्स, कृषी केंद्र व इतर सर्व दुकानांमधील चालू ऑफर्स पहा आणि थेट व्हॉट्सॲपवर मिळवा.'
              : 'Browse real-time festival offers, discounts, and free gifts from local verified store owners.'}
          </p>
        </div>
      </div>

      {/* Offers Grid */}
      {allOffersWithShop.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 text-sm font-semibold">
            {isMarathi ? 'सध्या कोणतीही ऑफर उपलब्ध नाही.' : 'No active offers at the moment.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {allOffersWithShop.map(({ offer, shop }) => (
            <div
              key={`${shop.id}-${offer.id}`}
              className="bg-white rounded-3xl border border-slate-200 hover:border-pink-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5">
                {/* Shop Mini Row */}
                <div
                  onClick={() => onSelectShop(shop)}
                  className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 cursor-pointer"
                >
                  <div className="min-w-0">
                    <span className="text-[11px] font-black text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-lg">
                      {isMarathi ? shop.categoryLabelMr : shop.categoryLabelEn}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 truncate mt-1.5 group-hover:text-orange-600 transition-colors">
                      {isMarathi ? shop.marathiName : shop.name}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-bold shrink-0 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    {shop.villageOrCity}
                  </span>
                </div>

                {/* Offer Details */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-black px-2.5 py-0.5 rounded-lg shadow-2xs">
                      {offer.discountValue}
                    </span>
                    {offer.badge && (
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-300">
                        {offer.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-base text-slate-900 mt-1">
                    {offer.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-medium mt-1.5 line-clamp-2 leading-relaxed">
                    {offer.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-3 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isMarathi ? `वैधता: ${offer.validTill}` : `Valid till: ${offer.validTill}`}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => openWhatsAppEnquiry(shop, offer)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-98 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-rose-500/20"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{isMarathi ? 'ऑफर मिळवा' : 'Claim Offer'}</span>
                </button>

                <button
                  onClick={() => onSelectShop(shop)}
                  className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <span>{isMarathi ? 'दुकान पहा' : 'View Shop'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
