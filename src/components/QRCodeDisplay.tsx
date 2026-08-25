import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Check } from 'lucide-react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
  showDownload?: boolean;
  downloadFileName?: string;
  centerText?: string;
  darkColor?: string;
  lightColor?: string;
  label?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 200,
  className = '',
  showDownload = false,
  downloadFileName = 'qr-code.png',
  centerText,
  darkColor = '#0f172a',
  lightColor = '#ffffff',
  label,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    if (!value) return;

    QRCode.toDataURL(
      value,
      {
        width: size * 2, // 2x for retina crispness
        margin: 1.5,
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel: 'H',
      },
      (err, url) => {
        if (!err && url) {
          setDataUrl(url);
        } else if (err) {
          console.error('QR code generation error:', err);
        }
      }
    );
  }, [value, size, darkColor, lightColor]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2000);
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="p-2 bg-white rounded-2xl shadow-sm border border-slate-200 inline-block overflow-hidden relative">
        {dataUrl ? (
          <img
            src={dataUrl}
            alt="QR Code"
            style={{ width: `${size}px`, height: `${size}px` }}
            className="rounded-xl block object-contain"
          />
        ) : (
          <div
            style={{ width: `${size}px`, height: `${size}px` }}
            className="flex items-center justify-center bg-slate-100 rounded-xl text-xs text-slate-400 animate-pulse"
          >
            QR जनरेट होत आहे...
          </div>
        )}
      </div>

      {label && <p className="text-[11px] font-bold text-slate-700 mt-2 text-center">{label}</p>}

      {showDownload && dataUrl && (
        <button
          type="button"
          onClick={handleDownload}
          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
        >
          {isDownloaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
          <span>{isDownloaded ? 'डाऊनलोड झाले!' : 'QR डाऊनलोड करा'}</span>
        </button>
      )}
    </div>
  );
};
