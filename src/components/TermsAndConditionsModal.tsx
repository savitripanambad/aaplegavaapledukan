import React from 'react';
import { ShieldCheck, X, AlertTriangle, RefreshCw, CheckCircle2, Lock, Phone, Mail, MapPin } from 'lucide-react';
import { APP_TERMS_AND_CONDITIONS, APP_OWNER_INFO } from '../utils/helpers';

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMarathi: boolean;
}

export const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  isOpen,
  onClose,
  isMarathi,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 relative shadow-md shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="bg-orange-500/30 text-orange-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-orange-400/30">
                कायदेशीर व सुरक्षा नियमावली
              </span>
              <h3 className="text-lg sm:text-xl font-black mt-1 font-['Noto_Sans_Devanagari',sans-serif]">
                {isMarathi ? 'नियम, अटी व सुरक्षितता धोरण' : 'Terms, Conditions & Safety Policy'}
              </h3>
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 font-['Noto_Sans_Devanagari',sans-serif]">
          {/* Important Highlight Box: No Refunds & Cyber Policy */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-black text-sm text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{isMarathi ? 'महत्त्वाची पूर्वसूचना व सूचना' : 'Important Notice'}</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-amber-900 font-medium">
              {isMarathi
                ? 'दुकानदार नोंदणी शुल्क (₹११) भरल्यानंतर ते कोणत्याही कारणास्तव परत (Non-Refundable) केले जाणार नाही. तसेच ॲपवर सायबर हल्ला किंवा सर्व्हर बिघाड झाल्यास ॲप बंद होऊन पर्यायी सुरक्षित अ‍ॅप तात्काळ देण्यात येईल.'
                : 'Registration fee (₹11) is strictly non-refundable under all circumstances. In case of cyber threats or server outage, services will be securely restored with an updated app.'}
            </p>
          </div>

          {/* Detailed Terms List */}
          <div className="space-y-3">
            {APP_TERMS_AND_CONDITIONS.map((term, index) => (
              <div key={index} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {isMarathi ? term.titleMr : term.titleEn}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {isMarathi ? term.descMr : term.descEn}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Owner & Admin Info */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2 text-indigo-950">
            <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              {isMarathi ? 'अधिकृत संचालक व सपोर्ट पत्ता' : 'Authorized Administrator'}
            </h4>
            <div className="text-xs text-indigo-900 space-y-1">
              <p className="font-bold">{APP_OWNER_INFO.agencyNameMr} ({APP_OWNER_INFO.ownerNameMr})</p>
              <div className="flex items-center gap-2 text-indigo-800 text-[11px]">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{APP_OWNER_INFO.addressMr}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-indigo-800 text-[11px] pt-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{APP_OWNER_INFO.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>{APP_OWNER_INFO.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            {isMarathi ? 'मला मान्य आहे / बंद करा' : 'I Understand & Accept'}
          </button>
        </div>
      </div>
    </div>
  );
};
