import React, { useState } from 'react';
import { Smartphone, Download, CheckCircle, Star, X, Shield, Sparkles } from 'lucide-react';

interface PlayStoreBannerProps {
  isMarathi: boolean;
}

export const PlayStoreBanner: React.FC<PlayStoreBannerProps> = ({ isMarathi }) => {
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  if (dismissed) return null;

  const handleInstallClick = () => {
    setInstalled(true);
    setTimeout(() => {
      alert(
        isMarathi
          ? '📱 "आपलं गावातील दुकान" हे ॲप आपल्या मोबाईलच्या होमस्क्रीनवर यशस्वीरीत्या जोडले गेले आहे!'
          : '📱 "Aapla Gavatil Dukan" App installed to your mobile home screen!'
      );
    }, 400);
  };

  return (
    <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white py-2.5 px-4 shadow-md relative border-b border-indigo-500/20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center text-white shrink-0 shadow-sm shadow-orange-500/20">
            <Smartphone className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">
                {isMarathi ? 'आपलं गावातील दुकान' : 'Aapla Gavatil Dukan'}
              </span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                {isMarathi ? 'Play Store App' : 'Mobile App'}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-emerald-400/30">
                {isMarathi ? 'मोफत डाऊनलोड' : 'Free Download'}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] mt-0.5">
              {isMarathi
                ? '⭐ ४.९ रेटिंग • १००% मोबाईल फ्रेंडली • एका क्लिकवर सर्व दुकाने शोधा'
                : '⭐ 4.9 Rating • 100% Mobile Friendly • 1-Click Village Shop Finder'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:scale-102"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {installed
                ? isMarathi ? 'ॲप इन्स्टॉल केले ✓' : 'Installed ✓'
                : isMarathi ? 'प्ले स्टोअर / ॲप इन्स्टॉल करा' : 'Install Mobile App'}
            </span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="बंद करा"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
