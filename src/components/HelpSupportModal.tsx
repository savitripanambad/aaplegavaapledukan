import React from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  HelpCircle,
  ShieldCheck,
  Store,
  Sparkles,
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import {
  ADMIN_NAME,
  ADMIN_NAME_MR,
  ADMIN_PHONE,
  ADMIN_EMAIL,
  AGENCY_NAME,
  AGENCY_NAME_MR,
  AGENCY_ADDRESS_MR,
  ADMIN_UPI_ID,
  REGISTRATION_ORIGINAL_PRICE,
  REGISTRATION_DISCOUNTED_PRICE
} from '../utils/helpers';

interface HelpSupportModalProps {
  onClose: () => void;
  isMarathi: boolean;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({ onClose, isMarathi }) => {
  const handleCall = () => {
    window.location.href = `tel:${ADMIN_PHONE}`;
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `नमस्कार अविनाश सर 🙏\nमी "आपलं गावातील दुकान" ॲपवरून मदतीसाठी / चौकशीसाठी संपर्क करत आहे.\nसावित्री मल्टीसर्विसेस, अंबड.`
    );
    window.open(`https://wa.me/91${ADMIN_PHONE}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shrink-0 shadow-lg">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-amber-400/30 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-amber-100">
                <Sparkles className="w-3 h-3 text-amber-300" />
                {isMarathi ? 'मदत व ग्राहक कक्ष' : 'Help & Support Center'}
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1 font-['Noto_Sans_Devanagari',sans-serif]">
                {isMarathi ? 'सावित्री मल्टीसर्विसेस मदत केंद्र' : 'Savitri Multiservices Helpdesk'}
              </h2>
              <p className="text-xs text-orange-100 font-medium">
                {isMarathi
                  ? 'अविनाश बनसोडे यांच्या वतीने थेट सहाय्य व मदत'
                  : 'Official Support by Avinash Bansode'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Owner & Firm Official Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-5 rounded-2xl border-2 border-amber-300/80 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md">
                  {isMarathi ? 'ॲप संस्थापक व संचालक' : 'App Founder & Operator'}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {ADMIN_NAME_MR} ({ADMIN_NAME})
                </h3>
                <p className="text-xs font-bold text-orange-800">
                  {AGENCY_NAME_MR} ({AGENCY_NAME})
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-600/30">
                <Store className="w-5 h-5" />
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-2.5 text-xs text-slate-800 bg-white/80 p-3 rounded-xl border border-amber-200">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">
                  {isMarathi ? 'अधिकृत कार्यालय पत्ता:' : 'Official Office Address:'}
                </p>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {AGENCY_ADDRESS_MR}
                </p>
              </div>
            </div>

            {/* Contact Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleCall}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{isMarathi ? `कॉल करा: ${ADMIN_PHONE}` : `Call: ${ADMIN_PHONE}`}</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isMarathi ? 'व्हॉट्सॲपवर बोला' : 'Chat on WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* Pricing & Offer Clarification */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="text-xs font-black text-slate-900 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              {isMarathi ? 'दुकानदार नोंदणी शुल्क नियम व सवलत' : 'Shopkeeper Registration Fee & Offer'}
            </h4>
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <div>
                <p className="text-slate-500 font-medium line-through">
                  मूळ वार्षिक शुल्क: ₹{REGISTRATION_ORIGINAL_PRICE}
                </p>
                <p className="text-slate-900 font-extrabold text-sm text-emerald-700">
                  सध्या मर्यादित काळासाठी ९०% सवलत: फक्त ₹{REGISTRATION_DISCOUNTED_PRICE}
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-black text-[11px] px-2.5 py-1 rounded-lg">
                ९०% OFF
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              {isMarathi
                ? 'कोणतीही छुपी फी नाही. ₹११ पेमेंट करून अ‍ॅडमिन मंजुरीनंतर आपले दुकान महाराष्ट्रातील हजारो ग्राहकांपर्यंत थेट पोहोचते.'
                : 'No hidden charges. Flat ₹11 registration fee to get your business listed online.'}
            </p>
          </div>

          {/* Frequently Asked Help Points */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black text-slate-900 uppercase">
              {isMarathi ? 'वारंवार विचारले जाणारे प्रश्न (FAQ)' : 'Frequently Asked Questions'}
            </h4>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                {isMarathi ? 'दुकान नोंदणी केल्यानंतर किती वेळात लाईव्ह होते?' : 'How long does shop approval take?'}
              </p>
              <p className="text-slate-600 pl-5">
                {isMarathi
                  ? 'आपण फॉर्म भरून ₹११ चे पेमेंट पूर्ण केल्यावर अ‍ॅडमिन अविनाश बनसोडे (सावित्री मल्टीसर्विसेस) यांच्याकडून काही वेळातच मंजुरी दिली जाते व दुकान लगेच होमपेजवर सर्वात वर दिसते.'
                  : 'Your shop is approved promptly by Admin Avinash Bansode once ₹11 fee is verified.'}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                {isMarathi ? 'दुकान तात्पुरते बंद किंवा सक्रिय कसे करावे?' : 'How to enable/disable shop?'}
              </p>
              <p className="text-slate-600 pl-5">
                {isMarathi
                  ? 'दुकानदार स्वतःच्या डॅशबोर्डमधून किंवा अ‍ॅडमिन पॅनेलमधून एका क्लिकवर दुकान "सक्रिय / निष्क्रिय" (Enable/Disable) करू शकतात किंवा कायमचे हटवू शकतात.'
                  : 'You can disable, enable, or delete your shop from your dashboard or via admin.'}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                {isMarathi ? 'रेफरल कोडचे पैसे कसे मिळतील?' : 'How to get referral rewards?'}
              </p>
              <p className="text-slate-600 pl-5">
                {isMarathi
                  ? 'आपल्या रेफरल कोडवरून जोडल्या गेलेल्या प्रत्येक दुकानामागे ₹१ जमा होतो. ₹५० जमा झाल्यावर आपण थेट UPI द्वारे पैसे खात्यात क्लेम करू शकता.'
                  : 'Earn ₹1 per referred shop. Payout is processed directly to your UPI ID once ₹50 is reached.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-600 font-medium">
            UPI: <span className="font-mono font-bold text-slate-900">{ADMIN_UPI_ID}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            {isMarathi ? 'बंद करा' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );

  function handlePhoneCall() {
    window.location.href = `tel:${ADMIN_PHONE}`;
  }
};
