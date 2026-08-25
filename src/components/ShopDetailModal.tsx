import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Phone,
  MapPin,
  Star,
  Sparkles,
  Clock,
  CheckCircle,
  Share2,
  QrCode,
  Heart,
  Send,
  User,
  ShoppingBag,
  ExternalLink,
  Copy,
  Check,
  Newspaper,
  Tv,
  Radio,
  Award
} from 'lucide-react';
import { Shop, Review, Offer } from '../types';
import { openWhatsAppEnquiry, openPhoneCall } from '../utils/helpers';
import { QRCodeDisplay } from './QRCodeDisplay';
import confetti from 'canvas-confetti';

interface ShopDetailModalProps {
  shop: Shop;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (shopId: string) => void;
  onAddReview: (shopId: string, review: Omit<Review, 'id' | 'shopId'>) => void;
  isMarathi: boolean;
}

export const ShopDetailModal: React.FC<ShopDetailModalProps> = ({
  shop,
  onClose,
  isSaved,
  onToggleSave,
  onAddReview,
  isMarathi,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    shop.bannerUrl || (shop.photoUrls && shop.photoUrls[0]) || ''
  );
  const [customInquiryText, setCustomInquiryText] = useState('');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Review Form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerVillage, setReviewerVillage] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const quickMessages = isMarathi
    ? [
        'होम डिलिव्हरी उपलब्ध आहे का?',
        'दुकान आज किती वाजेपर्यंत उघडे आहे?',
        'नवीन मालाची व्हॉट्सॲप लिस्ट पाठवा.',
        'या वस्तूचा दर काय आहे?',
      ]
    : [
        'Is home delivery available?',
        'Until what time is the shop open today?',
        'Please send the rate list on WhatsApp.',
        'What is the price of this item?',
      ];

  const handleSendCustomWhatsApp = (offer?: Offer) => {
    openWhatsAppEnquiry(shop, offer, customInquiryText || undefined);
  };

  const handleShareShop = () => {
    const text = `🚩 *${shop.marathiName || shop.name}* (${shop.villageOrCity || ''})\n👤 संचालक: ${shop.ownerName}\n⭐ ग्राहक रेटिंग: *${shop.rating.toFixed(1)} / ५.०* (${shop.totalReviews || 1} ग्राहकांचा विश्वास)\n📱 संपर्क: ${shop.mobile}\n📍 पत्ता: ${shop.fullAddress}\n\n🛒 'आपलं गावातील दुकान' ॲपवर या दुकानाचे फोटो, ऑफर्स व माहिती पहा!\n👉 लिंक: ${window.location.origin}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    onAddReview(shop.id, {
      userName: reviewerName,
      userPhone: '',
      village: reviewerVillage || shop.villageOrCity,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0],
    });

    setReviewSuccess(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => {
      setReviewerName('');
      setReviewerVillage('');
      setReviewComment('');
      setReviewSuccess(false);
    }, 2500);
  };

  const handleCopyUpi = () => {
    if (shop.upiId) {
      navigator.clipboard.writeText(shop.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white z-20 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-lg shadow-2xs">
              {isMarathi ? shop.categoryLabelMr : shop.categoryLabelEn}
            </span>
            {shop.isVerified && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 border border-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                {isMarathi ? 'व्हेरिफाईड दुकान' : 'Verified'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(shop.id)}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isSaved ? 'text-rose-600 bg-rose-50' : 'text-slate-500 hover:bg-slate-100'
              }`}
              title="जतन करा"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-600' : ''}`} />
            </button>
            <button
              onClick={handleShareShop}
              className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="व्हॉट्सॲपवर शेअर करा"
            >
              <Share2 className="w-5 h-5 text-emerald-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Photo Gallery */}
          <div>
            <div className="relative h-56 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
              <img
                src={selectedPhoto || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80'}
                alt={shop.marathiName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h2 className="text-xl sm:text-2xl font-black font-['Noto_Sans_Devanagari',sans-serif] drop-shadow-md">
                  {isMarathi ? shop.marathiName : shop.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 font-medium drop-shadow-xs">
                  {isMarathi ? `संचालक: ${shop.ownerName}` : `Owner: ${shop.ownerName}`} • {shop.villageOrCity}, {shop.district}
                </p>
              </div>
            </div>

            {/* Thumbnail selection if multiple photos */}
            {shop.photoUrls && shop.photoUrls.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {shop.photoUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhoto(url)}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      selectedPhoto === url ? 'border-orange-500 scale-105 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary Quick Action Call/WhatsApp Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => handleSendCustomWhatsApp()}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black shadow-md shadow-emerald-600/20 transition-all cursor-pointer text-sm"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>{isMarathi ? 'व्हॉट्सॲपवर माहिती विचारा' : 'WhatsApp Enquiry'}</span>
            </button>

            <button
              onClick={() => openPhoneCall(shop.mobile)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-black active:scale-98 text-white font-bold shadow-md transition-all cursor-pointer text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>{isMarathi ? `कॉल करा (${shop.mobile})` : `Call (${shop.mobile})`}</span>
            </button>

            {shop.upiId && (
              <button
                onClick={() => setShowUpiModal(!showUpiModal)}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 active:scale-98 text-slate-950 font-black shadow-sm transition-all cursor-pointer text-sm"
              >
                <QrCode className="w-4 h-4 text-slate-950" />
                <span>{isMarathi ? 'UPI पेमेंट QR कोड' : 'UPI Payment QR'}</span>
              </button>
            )}
          </div>

          {/* UPI Modal / Box toggle */}
          {showUpiModal && shop.upiId && (
            <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-300 animate-fadeIn space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-amber-700" />
                  {isMarathi ? 'दुकानावर ऑनलाईन पेमेंट QR कोड (GPay / PhonePe / Paytm / BHIM)' : 'Direct UPI Payment QR & ID'}
                </span>
                <button
                  onClick={() => setShowUpiModal(false)}
                  className="text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer"
                >
                  {isMarathi ? 'बंद करा ✕' : 'Close ✕'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-white p-4 rounded-xl border border-amber-300 shadow-xs">
                <QRCodeDisplay
                  value={`upi://pay?pa=${shop.upiId}&pn=${encodeURIComponent(shop.marathiName || shop.name)}&cu=INR`}
                  size={150}
                  showDownload={true}
                  downloadFileName={`${(shop.marathiName || shop.name).replace(/\s+/g, '_')}_UPI_QR.png`}
                  label={isMarathi ? 'स्कॅन करून थेट दुकानदाराला पैसे पाठवा' : 'Scan to Pay via UPI'}
                />

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    {isMarathi ? 'दुकानदाराचा UPI आयडी:' : 'Shopkeeper UPI ID:'}
                  </span>
                  <div className="font-mono text-sm font-black text-slate-900 bg-slate-100 p-2.5 rounded-lg border border-slate-200 break-all">
                    {shop.upiId}
                  </div>
                  <button
                    onClick={handleCopyUpi}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 active:scale-98 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'UPI ID कॉपी झाला!' : 'UPI ID कॉपी करा'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Shop Information Grid */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="font-bold text-slate-500 block mb-1">
                {isMarathi ? '📍 दुकानाचा संपूर्ण पत्ता:' : '📍 Full Address:'}
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">
                {shop.landmark && <span className="font-bold text-orange-700">{shop.landmark}, </span>}
                {shop.fullAddress}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-500 block mb-1">
                {isMarathi ? '🕒 कामाची वेळ:' : '🕒 Opening Hours:'}
              </span>
              <p className="text-slate-800 font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-600 shrink-0" />
                <span>{shop.openingHours}</span>
              </p>
              {shop.alternatePhone && (
                <p className="text-slate-600 font-medium mt-2">
                  <span className="font-bold">{isMarathi ? 'पर्यायी फोन:' : 'Alt Phone:'}</span> {shop.alternatePhone}
                </p>
              )}
            </div>
          </div>

          {/* JOURNALIST / MEDIA SPECIAL SECTION */}
          {(shop.category === 'patrakar' || shop.newspaperName || shop.newsChannelName || shop.pressCardNo) && (
            <div className="p-4 sm:p-5 bg-gradient-to-br from-rose-50 via-white to-pink-50 rounded-2xl border-2 border-rose-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-rose-950">
                      {isMarathi ? 'वृत्तपत्र व मीडिया प्रतिनिधी माहिती (Press & Media)' : 'Press & Media Details'}
                    </h3>
                    <p className="text-[11px] text-rose-700">
                      {isMarathi ? 'गावातील बातम्या, सत्कार, कार्यक्रम व समस्यांच्या प्रसिद्धीसाठी संपर्क' : 'Contact for local news coverage & notices'}
                    </p>
                  </div>
                </div>

                <span className="bg-rose-100 text-rose-900 border border-rose-300 font-black text-[10px] px-2.5 py-1 rounded-full">
                  {isMarathi ? '🎙️ अधिकृत पत्रकार' : 'Official Press'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                {shop.newspaperName && (
                  <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-bold block mb-0.5">
                      {isMarathi ? '📰 दैनिक / वृत्तपत्र:' : '📰 Newspaper:'}
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">{shop.newspaperName}</span>
                  </div>
                )}

                {shop.newsChannelName && (
                  <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-bold block mb-0.5">
                      {isMarathi ? '📺 न्यूज चॅनेल / डिजिटल:' : '📺 News Channel:'}
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">{shop.newsChannelName}</span>
                  </div>
                )}

                {shop.pressCardNo && (
                  <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-bold block mb-0.5">
                      {isMarathi ? '🪪 प्रेस कार्ड / RNI क्र:' : '🪪 Press Card No:'}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{shop.pressCardNo}</span>
                  </div>
                )}
              </div>

              {shop.newsWhatsappGroupUrl && (
                <div className="pt-2">
                  <a
                    href={shop.newsWhatsappGroupUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs font-black shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isMarathi ? 'स्थानिक बातम्यांच्या WhatsApp ग्रुपमध्ये सामील व्हा →' : 'Join WhatsApp News Group →'}</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* SPECIALIZED SERVICES HIGHLIGHT */}
          {shop.serviceSpecialization && (
            <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-200 flex items-start gap-2.5">
              <Award className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-black text-indigo-950 block">
                  {isMarathi ? '✨ विशेष सुविधा व सेवा (Specialization):' : '✨ Specialization & Services:'}
                </span>
                <p className="text-xs text-indigo-900 font-semibold mt-0.5 leading-relaxed">
                  {shop.serviceSpecialization}
                </p>
              </div>
            </div>
          )}

          {/* Active Offers & Discounts Section */}
          {shop.offers && shop.offers.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-600" />
                <span>{isMarathi ? 'सध्याच्या चालू सवलती व ऑफर्स' : 'Active Offers & Discounts'}</span>
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {shop.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="p-4 bg-gradient-to-r from-rose-50/80 via-pink-50/50 to-orange-50/80 rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-black px-2 py-0.5 rounded-lg shadow-2xs">
                          {offer.discountValue}
                        </span>
                        {offer.badge && (
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-300">
                            {offer.badge}
                          </span>
                        )}
                        <h4 className="font-bold text-sm text-slate-900">{offer.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">{offer.description}</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {isMarathi ? `वैधता: ${offer.validTill}` : `Valid till: ${offer.validTill}`}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSendCustomWhatsApp(offer)}
                      className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-98 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>{isMarathi ? 'ऑफर मिळवा (WhatsApp)' : 'Claim Offer'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products & Services List */}
          {shop.productsServices && shop.productsServices.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
                <span>{isMarathi ? 'दुकानातील प्रमुख वस्तू व सेवा' : 'Products & Services Available'}</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {shop.productsServices.map((product, idx) => (
                  <span
                    key={idx}
                    onClick={() => {
                      setCustomInquiryText(product);
                    }}
                    className="bg-slate-100 hover:bg-orange-100 hover:text-orange-950 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                    title="याबद्दल विचारण्यासाठी क्लिक करा"
                  >
                    <span>{product}</span>
                    <span className="text-[10px] text-slate-400 font-normal">→ विचारणा</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Instant Custom WhatsApp message composer */}
          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-3">
            <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>{isMarathi ? 'थेट व्हॉट्सॲपवर हवा तो प्रश्न विचारा' : 'Direct Custom WhatsApp Message'}</span>
            </h3>

            {/* Quick message chips */}
            <div className="flex flex-wrap gap-1.5">
              {quickMessages.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => setCustomInquiryText(msg)}
                  className="text-[11px] bg-white hover:bg-emerald-100 text-emerald-900 font-medium px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer text-left shadow-2xs"
                >
                  {msg}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customInquiryText}
                onChange={(e) => setCustomInquiryText(e.target.value)}
                placeholder={isMarathi ? 'उदा. मला २ किलो साखर व तेल हवे आहे...' : 'Type message or item inquiry...'}
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-900"
              />
              <button
                onClick={() => handleSendCustomWhatsApp()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>{isMarathi ? 'पाठवा' : 'Send'}</span>
              </button>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>
                  {isMarathi ? `ग्राहकांचे अभिप्राय (${shop.rating.toFixed(1)} / ५)` : `Customer Reviews (${shop.rating.toFixed(1)} / 5)`}
                </span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {shop.totalReviews} {isMarathi ? 'ग्राहकांनी रेट केले' : 'ratings'}
              </span>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="font-bold text-xs text-slate-700">
                {isMarathi ? 'आपला अनुभव व अभिप्राय नोंदवा:' : 'Write a Review for this Shop:'}
              </div>

              {reviewSuccess ? (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>{isMarathi ? 'आपला अभिप्राय यशस्वीरीत्या नोंदवला गेला!' : 'Review submitted successfully!'}</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder={isMarathi ? 'आपले नाव *' : 'Your Name *'}
                      className="px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-slate-900"
                    />
                    <input
                      type="text"
                      value={reviewerVillage}
                      onChange={(e) => setReviewerVillage(e.target.value)}
                      placeholder={isMarathi ? 'आपले गाव / शहर' : 'Your Village / City'}
                      className="px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-slate-900"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600">{isMarathi ? 'रेटिंग:' : 'Rating:'}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    required
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={isMarathi ? 'दुकानातील सेवा, मालाचा दर्जा किंवा अनुभव लिहा...' : 'Write your feedback on quality, price, or service...'}
                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/30 text-slate-900"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    {isMarathi ? 'अभिप्राय सबमिट करा' : 'Submit Review'}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
