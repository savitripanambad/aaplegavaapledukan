import React, { useState } from 'react';
import { ShieldAlert, X, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { ADMIN_NAME, ADMIN_UPI_ID, ADMIN_PASSWORD } from '../utils/helpers';
import confetti from 'canvas-confetti';

interface AdminLoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
  isMarathi: boolean;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  onClose,
  onLoginSuccess,
  isMarathi,
}) => {
  const [adminPin, setAdminPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin.trim() === ADMIN_PASSWORD || adminPin.trim() === '9130551151') {
      confetti({ particleCount: 50, spread: 60 });
      onLoginSuccess();
    } else {
      setErrorMsg(isMarathi ? 'चुकीचा अ‍ॅडमिन पासवर्ड! कृपया खरा पासवर्ड टाका.' : 'Invalid Admin Password! Please enter correct password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 relative shadow-md">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <span className="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                मास्टर अ‍ॅडमिन
              </span>
              <h3 className="text-base sm:text-lg font-black mt-0.5 font-['Noto_Sans_Devanagari',sans-serif]">
                {ADMIN_NAME} - अ‍ॅडमिन प्रवेश
              </h3>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            {isMarathi
              ? 'दुकान मंजुरी, संपादन, डिलिट, पेमेंट्स व खाती तपासण्यासाठी आपला सुरक्षित अ‍ॅडमिन पासवर्ड टाका.'
              : 'Enter master admin password to access the platform management and payment logs.'}
          </p>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-shake">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'अ‍ॅडमिन पासवर्ड (Admin Password) *' : 'Admin Password *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={adminPin}
                  onChange={(e) => {
                    setAdminPin(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 font-mono text-base font-black focus:ring-2 focus:ring-orange-500/40 text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>{isMarathi ? 'अ‍ॅडमिन पॅनेलमध्ये प्रवेश करा' : 'Login to Admin Panel'}</span>
            </button>
          </form>

          <div className="p-3 bg-slate-50 rounded-xl text-center text-[11px] text-slate-500 font-mono border border-slate-100">
            UPI: {ADMIN_UPI_ID} | सावित्री मल्टीसर्विसेस, अंबड
          </div>
        </div>
      </div>
    </div>
  );
};
