import React, { useState } from 'react';
import {
  Store,
  TrendingUp,
  Eye,
  MessageCircle,
  Phone,
  Sparkles,
  Plus,
  Trash2,
  Share2,
  QrCode,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  Printer,
  Download,
  LogOut,
  Edit,
  Save,
  Tag,
  Gift,
  AlertCircle,
  Copy,
  Check,
  FileCheck,
  Coins,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Shop, Offer, SalesRecord, ClaimRequest } from '../types';
import { formatCurrencyINR, getMarathiDateString, REFERRAL_REWARD_PER_SHOP, REFERRAL_CLAIM_THRESHOLD, getUpiPaymentUrl } from '../utils/helpers';
import { downloadMarathiShopCertificate } from '../utils/pdfExport';
import { QRCodeDisplay } from './QRCodeDisplay';
import confetti from 'canvas-confetti';

interface ShopkeeperDashboardProps {
  shop: Shop;
  onUpdateShop: (updatedShop: Shop) => void;
  onLogout: () => void;
  isMarathi: boolean;
  onClaimReferral?: (shopId: string, amount: number, upiId: string) => void;
}

export const ShopkeeperDashboard: React.FC<ShopkeeperDashboardProps> = ({
  shop,
  onUpdateShop,
  onLogout,
  isMarathi,
  onClaimReferral,
}) => {
  const [activeTab, setActiveTab] = useState<'salesReport' | 'offers' | 'referral' | 'qrCard' | 'profile'>('salesReport');

  // New Sale Entry State
  const [saleAmount, setSaleAmount] = useState('');
  const [saleCustomerName, setSaleCustomerName] = useState('');
  const [saleCustomerPhone, setSaleCustomerPhone] = useState('');
  const [salePaymentMode, setSalePaymentMode] = useState<'cash' | 'upi' | 'credit'>('upi');
  const [saleNotes, setSaleNotes] = useState('');
  const [saleSuccessMsg, setSaleSuccessMsg] = useState(false);

  // New Offer State
  const [offerTitle, setOfferTitle] = useState('');
  const [offerValue, setOfferValue] = useState('');
  const [offerDesc, setOfferDesc] = useState('');
  const [offerValidTill, setOfferValidTill] = useState('३१ डिसेंबर २०२६');
  const [offerBadge, setOfferBadge] = useState('खास ऑफर');

  // Profile Edit State
  const [editOwner, setEditOwner] = useState(shop.ownerName);
  const [editMarathiName, setEditMarathiName] = useState(shop.marathiName);
  const [editUsername, setEditUsername] = useState(shop.username || '');
  const [editMobile, setEditMobile] = useState(shop.mobile);
  const [editEmail, setEditEmail] = useState(shop.email || '');
  const [editPassword, setEditPassword] = useState(shop.password || '');
  const [editAddress, setEditAddress] = useState(shop.fullAddress);
  const [editHours, setEditHours] = useState(shop.openingHours);
  const [editUpi, setEditUpi] = useState(shop.upiId || '');
  const [editGst, setEditGst] = useState(shop.gstNumber || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Referral Claim State
  const [claimUpi, setClaimUpi] = useState(shop.upiId || '');
  const [claimSentMsg, setClaimSentMsg] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Sales calculations
  const totalSalesAmount = (shop.salesHistory || []).reduce((acc, curr) => acc + curr.amount, 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySalesList = (shop.salesHistory || []).filter((s) => s.date === todayStr);
  const todaySalesAmount = todaySalesList.reduce((acc, curr) => acc + curr.amount, 0);
  const upiSalesTotal = (shop.salesHistory || []).filter((s) => s.paymentMode === 'upi').reduce((acc, curr) => acc + curr.amount, 0);
  const cashSalesTotal = (shop.salesHistory || []).filter((s) => s.paymentMode === 'cash').reduce((acc, curr) => acc + curr.amount, 0);
  const creditSalesTotal = (shop.salesHistory || []).filter((s) => s.paymentMode === 'credit').reduce((acc, curr) => acc + curr.amount, 0);

  // Referral Calculations
  const referralEarnings = shop.referralEarnings || 0;
  const referralCount = shop.referralCount || 0;
  const canClaim = referralEarnings >= REFERRAL_CLAIM_THRESHOLD;
  const referralCode = shop.referralCode || `REF-${shop.marathiName.slice(0, 4)}-${shop.mobile.slice(-4)}`;

  const handleAddSale = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(saleAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newRecord: SalesRecord = {
      id: `sale-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      amount: parsedAmount,
      customerName: saleCustomerName || (isMarathi ? 'थेट ग्राहक' : 'Walk-in Customer'),
      customerPhone: saleCustomerPhone,
      paymentMode: salePaymentMode,
      itemsNotes: saleNotes || (isMarathi ? 'दुकान विक्री' : 'Store sale'),
    };

    const updatedShop: Shop = {
      ...shop,
      salesHistory: [newRecord, ...(shop.salesHistory || [])],
    };

    onUpdateShop(updatedShop);
    setSaleAmount('');
    setSaleCustomerName('');
    setSaleCustomerPhone('');
    setSaleNotes('');
    setSaleSuccessMsg(true);
    confetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setSaleSuccessMsg(false), 2500);
  };

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitle.trim() || !offerValue.trim()) return;

    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      title: offerTitle,
      discountValue: offerValue,
      description: offerDesc,
      discountType: 'percentage',
      validTill: offerValidTill,
      badge: offerBadge,
    };

    const updatedShop: Shop = {
      ...shop,
      offers: [newOffer, ...(shop.offers || [])],
    };

    onUpdateShop(updatedShop);
    setOfferTitle('');
    setOfferValue('');
    setOfferDesc('');
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleDeleteOffer = (offerId: string) => {
    const updatedShop: Shop = {
      ...shop,
      offers: (shop.offers || []).filter((o) => o.id !== offerId),
    };
    onUpdateShop(updatedShop);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedShop: Shop = {
      ...shop,
      ownerName: editOwner,
      marathiName: editMarathiName,
      username: editUsername.trim().toLowerCase() || undefined,
      mobile: editMobile.trim(),
      email: editEmail.trim() || undefined,
      password: editPassword.trim() || shop.password,
      fullAddress: editAddress,
      openingHours: editHours,
      upiId: editUpi || undefined,
      gstNumber: editGst.trim() ? editGst.trim().toUpperCase() : undefined,
    };
    onUpdateShop(updatedShop);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleShareReferralOnWhatsApp = () => {
    const msg = `🚩 *आपलं गावातील दुकान ॲपवर आपले दुकान मोफत जोडा!*\n\nनोंदणी करताना माझा रेफरल कोड वापरा: *${referralCode}*\n\nआपल्या गावातील ग्राहकांपर्यंत पोहोचा व व्यवसाय वाढवा!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleClaimRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimUpi.trim()) return;

    if (onClaimReferral) {
      onClaimReferral(shop.id, referralEarnings, claimUpi);
    }

    const updatedShop: Shop = {
      ...shop,
      referralEarnings: 0,
    };
    onUpdateShop(updatedShop);
    setClaimSentMsg(true);
    confetti({ particleCount: 60, spread: 70 });
    setTimeout(() => setClaimSentMsg(false), 4000);
  };

  const handlePrintQR = () => {
    window.print();
  };

  const handleShareQR = () => {
    const text = `🚩 *${shop.marathiName}* (${shop.villageOrCity})\n\nआमच्या दुकानातील वस्तू, ऑफर्स व संपर्क 'आपलं गावातील दुकान' ॲपवर उपलब्ध आहे!\nसंचालक: ${shop.ownerName}\nमोबाईल: ${shop.mobile}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Approval Status Banner (If Pending) */}
      {shop.approvalStatus === 'pending' && (
        <div className="p-4 bg-amber-500/10 border-2 border-amber-500 rounded-2xl flex items-start sm:items-center justify-between gap-3 text-amber-950 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-black text-sm">
                {isMarathi ? '⏳ आपले दुकान अ‍ॅडमिन मंजुरीसाठी (Pending Approval) पाठवले आहे' : 'Shop Under Review'}
              </h4>
              <p className="text-xs text-amber-900 mt-0.5">
                {isMarathi
                  ? 'अ‍ॅडमिनने तपासणी करून मंजुरी दिल्यानंतर हे दुकान मुख्य पेजवर सर्वांना दिसेल. तोपर्यंत आपण रोजवही व ऑफर्स सेट करू शकता.'
                  : 'Your shop will be visible on the home page once verified by the platform admin.'}
              </p>
            </div>
          </div>
          <span className="shrink-0 bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
            अंडर-रिव्ह्यू
          </span>
        </div>
      )}

      {/* Dashboard Top Header Bar */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-indigo-600 rounded-3xl p-5 sm:p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-orange-400/30">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shrink-0 shadow-inner">
            <Store className="w-9 h-9" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white/25 text-white text-xs font-black px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                {isMarathi ? shop.categoryLabelMr : shop.categoryLabelEn}
              </span>

              {shop.approvalStatus === 'approved' ? (
                <span className="bg-emerald-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <CheckCircle className="w-3 h-3" />
                  {isMarathi ? 'सक्रिय दुकान (मंजूर)' : 'Approved Shop'}
                </span>
              ) : (
                <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {isMarathi ? 'पडताळणी चालू' : 'In Review'}
                </span>
              )}

              {shop.gstNumber && (
                <span className="bg-indigo-900/60 text-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-300/40 flex items-center gap-1">
                  <FileCheck className="w-3 h-3 text-indigo-300" />
                  GST: {shop.gstNumber}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1 font-['Noto_Sans_Devanagari',sans-serif]">
              {shop.marathiName}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 font-medium">
              {isMarathi ? `संचालक: ${shop.ownerName}` : `Proprietor: ${shop.ownerName}`} • {shop.villageOrCity}, {shop.district}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <button
            onClick={() => downloadMarathiShopCertificate(shop)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-orange-50 text-xs font-black transition-all cursor-pointer shadow-md"
            title="दुकान अधिकृत नोंदणी प्रमाणपत्र (PDF डाउनलोड)"
          >
            <Printer className="w-4 h-4 text-orange-600" />
            <span>{isMarathi ? 'प्रमाणपत्र PDF' : 'Certificate PDF'}</span>
          </button>
          <button
            onClick={handleShareQR}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>{isMarathi ? 'WhatsApp शेअर' : 'Share Shop'}</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/30 hover:bg-black/50 text-white text-xs font-bold transition-colors cursor-pointer backdrop-blur-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>{isMarathi ? 'लॉगआउट' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isMarathi ? 'दुकानाचे व्ह्यूज' : 'Profile Views'}</span>
            <Eye className="w-4.5 h-4.5 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {shop.stats.views.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">↑ ग्राहक पाहत आहेत</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isMarathi ? 'व्हॉट्सॲप विचारणा' : 'WhatsApp Leads'}</span>
            <MessageCircle className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700">
            {shop.stats.whatsappInquiries.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">थेट ऑर्डर विचारणा</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isMarathi ? 'आजची एकूण विक्री' : "Today's Sales"}</span>
            <DollarSign className="w-4.5 h-4.5 text-orange-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-orange-600">
            {formatCurrencyINR(todaySalesAmount)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {todaySalesList.length} {isMarathi ? 'नोंदी' : 'entries'}
          </span>
        </div>

        {/* Referral Wallet Counter */}
        <div
          onClick={() => setActiveTab('referral')}
          className="bg-gradient-to-br from-amber-50 to-orange-50 p-4.5 rounded-2xl border border-amber-300 shadow-xs hover:border-orange-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-900 mb-2">
            <span className="text-xs font-bold">{isMarathi ? 'रेफरल कमाई (Wallet)' : 'Referral Earnings'}</span>
            <Gift className="w-4.5 h-4.5 text-orange-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-orange-600">
            ₹{referralEarnings}
          </div>
          <span className="text-[11px] text-orange-950 font-bold flex items-center gap-1">
            <span>{referralCount} दुकानदारांना जोडले</span>
            <ArrowUpRight className="w-3 h-3 text-orange-600" />
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('salesReport')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'salesReport'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{isMarathi ? 'विक्री अहवाल व रोजवही (Sales Report)' : 'Daily Sales Book'}</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'offers'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isMarathi ? 'सवलती व ऑफर्स व्यवस्थापन' : 'Manage Offers'}</span>
        </button>

        <button
          onClick={() => setActiveTab('referral')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'referral'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>{isMarathi ? 'रेफर करा व कमवा (₹१/रेफरल)' : 'Refer & Earn'}</span>
          {referralEarnings > 0 && (
            <span className="bg-orange-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
              ₹{referralEarnings}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('qrCard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'qrCard'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{isMarathi ? 'दुकान QR कोड व व्हिजिटिंग कार्ड' : 'Shop QR & Card'}</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Edit className="w-4 h-4" />
          <span>{isMarathi ? 'माहिती व पत्ता बदला' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* TAB 1: Sales Report & Daily Khata Book */}
      {activeTab === 'salesReport' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Sale Form */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-500" />
                <span>{isMarathi ? 'नवीन विक्री नोंदवा (Daily Sale)' : 'Log New Sale'}</span>
              </h3>
            </div>

            {saleSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{isMarathi ? 'विक्री यशस्वीपणे नोंदवली गेली!' : 'Sale logged successfully!'}</span>
              </div>
            )}

            <form onSubmit={handleAddSale} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'विक्री रक्कम (₹) *' : 'Sale Amount (₹) *'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-black text-slate-500">₹</span>
                  <input
                    type="number"
                    step="any"
                    required
                    value={saleAmount}
                    onChange={(e) => setSaleAmount(e.target.value)}
                    placeholder="500"
                    className="w-full pl-8 pr-3 py-2 text-base font-black rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'पेमेंट प्रकार *' : 'Payment Mode *'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSalePaymentMode('upi')}
                    className={`py-2 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                      salePaymentMode === 'upi'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    UPI / Online
                  </button>

                  <button
                    type="button"
                    onClick={() => setSalePaymentMode('cash')}
                    className={`py-2 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                      salePaymentMode === 'cash'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isMarathi ? 'रोख (Cash)' : 'Cash'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSalePaymentMode('credit')}
                    className={`py-2 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                      salePaymentMode === 'credit'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isMarathi ? 'उधार (Credit)' : 'Credit'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'ग्राहकाचे नाव (ऐच्छिक)' : 'Customer Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={saleCustomerName}
                  onChange={(e) => setSaleCustomerName(e.target.value)}
                  placeholder={isMarathi ? 'उदा. सचिन पाटील' : 'Customer Name'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'वस्तू / तपशील' : 'Items / Notes'}
                </label>
                <input
                  type="text"
                  value={saleNotes}
                  onChange={(e) => setSaleNotes(e.target.value)}
                  placeholder={isMarathi ? 'उदा. किराणा पॅकेट, २ नग कपडे' : 'Notes'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-orange-500/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isMarathi ? 'विक्री खात्यात जोडा' : 'Add to Khata'}</span>
              </button>
            </form>

            {/* Payment split summary */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-slate-600 block">
                {isMarathi ? 'पेमेंट विभागणी (Breakdown):' : 'Payment Breakdown:'}
              </span>
              <div className="flex justify-between items-center bg-indigo-50 p-2.5 rounded-xl text-indigo-950 font-bold border border-indigo-100">
                <span>UPI / Online:</span>
                <span>{formatCurrencyINR(upiSalesTotal)}</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-50 p-2.5 rounded-xl text-emerald-950 font-bold border border-emerald-100">
                <span>{isMarathi ? 'रोख (Cash):' : 'Cash:'}</span>
                <span>{formatCurrencyINR(cashSalesTotal)}</span>
              </div>
              <div className="flex justify-between items-center bg-rose-50 p-2.5 rounded-xl text-rose-950 font-bold border border-rose-100">
                <span>{isMarathi ? 'उधार (Credit):' : 'Credit:'}</span>
                <span>{formatCurrencyINR(creditSalesTotal)}</span>
              </div>
            </div>
          </div>

          {/* Sales History Table / Report */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900">
                  {isMarathi ? 'दैनंदिन विक्री रोजवही अहवाल' : 'Daily Sales Book & Reports'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {isMarathi ? 'आपल्या दुकानाची सर्व व्यवहारांची नोंद' : 'Recent sales transaction logs'}
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isMarathi ? 'रिपोर्ट प्रिंट करा' : 'Print Report'}</span>
              </button>
            </div>

            {(!shop.salesHistory || shop.salesHistory.length === 0) ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                {isMarathi ? 'अद्याप कोणतीही विक्री नोंदवलेली नाही. डावीकडून नवीन विक्री जोडा.' : 'No sales records yet. Log your first sale.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="py-2.5 px-3">{isMarathi ? 'तारीख व वेळ' : 'Date/Time'}</th>
                      <th className="py-2.5 px-3">{isMarathi ? 'ग्राहक / तपशील' : 'Customer'}</th>
                      <th className="py-2.5 px-3">{isMarathi ? 'प्रकार' : 'Mode'}</th>
                      <th className="py-2.5 px-3 text-right">{isMarathi ? 'रक्कम' : 'Amount'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {shop.salesHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 text-slate-600 font-medium">
                          <div>{item.date}</div>
                          <div className="text-[10px] text-slate-400">{item.time}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{item.customerName}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{item.itemsNotes}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              item.paymentMode === 'upi'
                                ? 'bg-indigo-100 text-indigo-800'
                                : item.paymentMode === 'cash'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.paymentMode}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900 text-sm">
                          {formatCurrencyINR(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Manage Offers & Discounts */}
      {activeTab === 'offers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Offer Form */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <span>{isMarathi ? 'नवीन सवलत / ऑफर जोडा' : 'Add New Offer'}</span>
            </h3>

            <form onSubmit={handleAddOffer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'ऑफरचे शीर्षक *' : 'Offer Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  placeholder={isMarathi ? 'उदा. दिवाळी स्पेशल १०% सूट!' : 'Festival 10% Off'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'सवलत रक्कम / प्रमाण *' : 'Discount Value *'}
                </label>
                <input
                  type="text"
                  required
                  value={offerValue}
                  onChange={(e) => setOfferValue(e.target.value)}
                  placeholder={isMarathi ? 'उदा. १०% सूट / ₹५० कॅशबॅक / १ वर १ मोफत' : '15% Off'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'ऑफर तपशील / अटी' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={offerDesc}
                  onChange={(e) => setOfferDesc(e.target.value)}
                  placeholder={isMarathi ? 'उदा. ₹१००० वरील खरेदीवर लागू...' : 'Details'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isMarathi ? 'वैधता तारीख' : 'Valid Till'}
                  </label>
                  <input
                    type="text"
                    value={offerValidTill}
                    onChange={(e) => setOfferValidTill(e.target.value)}
                    placeholder="३१ डिसेंबर २०२६"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isMarathi ? 'बॅज नाव' : 'Badge'}
                  </label>
                  <input
                    type="text"
                    value={offerBadge}
                    onChange={(e) => setOfferBadge(e.target.value)}
                    placeholder="धमाका ऑफर"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-md shadow-rose-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isMarathi ? 'ऑफर लाईव्ह करा' : 'Publish Offer'}</span>
              </button>
            </form>
          </div>

          {/* Active Offers List */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3">
              {isMarathi ? 'आपल्या सक्रिय ऑफर्स' : 'Your Live Offers'}
            </h3>

            {(!shop.offers || shop.offers.length === 0) ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                {isMarathi ? 'अद्याप कोणतीही ऑफर तयार केलेली नाही. ग्राहकांना आकर्षित करण्यासाठी ऑफर जोडा!' : 'No active offers. Create one!'}
              </div>
            ) : (
              <div className="space-y-3">
                {shop.offers.map((off) => (
                  <div
                    key={off.id}
                    className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-rose-500 text-white text-xs font-black px-2 py-0.5 rounded shadow-2xs">
                          {off.discountValue}
                        </span>
                        {off.badge && (
                          <span className="bg-amber-100 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded border border-amber-300">
                            {off.badge}
                          </span>
                        )}
                        <h4 className="font-bold text-sm text-slate-900">{off.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{off.description}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        {isMarathi ? `वैधता: ${off.validTill}` : `Valid till: ${off.validTill}`}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteOffer(off.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-colors cursor-pointer"
                      title="हटवा"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Referral & Earnings (₹1 per referral, claim at ₹50) */}
      {activeTab === 'referral' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Referral Card & Code */}
          <div className="lg:col-span-1 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-6 rounded-3xl text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {isMarathi ? 'रेफरल योजना' : 'Referral Program'}
              </span>
              <Coins className="w-7 h-7 text-amber-200" />
            </div>

            <div>
              <span className="text-xs text-amber-100 font-bold block">{isMarathi ? 'आपली जमा झालेली कमाई' : 'Total Referral Balance'}</span>
              <div className="text-3xl sm:text-4xl font-black mt-1">₹{referralEarnings}</div>
              <span className="text-xs text-amber-100 mt-1 block">
                {referralCount} {isMarathi ? 'दुकानदार आपल्या रेफरलने जोडले' : 'shops joined'} (प्रत्येकी ₹{REFERRAL_REWARD_PER_SHOP})
              </span>
            </div>

            {/* Referral Code Box */}
            <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-white/20 space-y-2">
              <span className="text-[11px] text-amber-200 font-bold block">
                {isMarathi ? 'आपला युनिक रेफरल कोड:' : 'Your Unique Referral Code:'}
              </span>
              <div className="flex items-center justify-between bg-white text-slate-950 px-3 py-2 rounded-xl font-mono text-sm font-black">
                <span>{referralCode}</span>
                <button
                  type="button"
                  onClick={handleCopyReferralCode}
                  className="text-orange-600 hover:text-orange-800 p-1 cursor-pointer"
                >
                  {copiedReferral ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copiedReferral && (
                <span className="text-[10px] text-emerald-300 font-bold block">कोड कॉपी झाला!</span>
              )}
            </div>

            <button
              onClick={handleShareReferralOnWhatsApp}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>{isMarathi ? 'मित्रांना WhatsApp वर पाठवा' : 'Share on WhatsApp'}</span>
            </button>
          </div>

          {/* Claim Withdrawal Details */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-orange-600" />
                <span>{isMarathi ? 'कमाई क्लेम करा (Payout Withdrawal)' : 'Claim Referral Earnings'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isMarathi
                  ? `प्रत्येक यशस्वी दुकानदार जोडल्यास ₹${REFERRAL_REWARD_PER_SHOP} मिळतात. खात्यात ₹${REFERRAL_CLAIM_THRESHOLD} जमा झाल्यावर थेट UPI द्वारे पैसे खात्यात क्लेम करता येतात.`
                  : `Earn ₹${REFERRAL_REWARD_PER_SHOP} per shop referral. Claim via UPI once you reach ₹${REFERRAL_CLAIM_THRESHOLD}.`}
              </p>
            </div>

            {/* Progress Bar towards ₹50 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>{isMarathi ? 'क्लेम पात्रता प्रगती:' : 'Claim Progress:'}</span>
                <span className="text-orange-600 font-black">₹{referralEarnings} / ₹{REFERRAL_CLAIM_THRESHOLD}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (referralEarnings / REFERRAL_CLAIM_THRESHOLD) * 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex justify-between items-center">
                <span>₹०</span>
                {canClaim ? (
                  <span className="text-emerald-600 font-bold">✓ आपण आता ₹{referralEarnings} क्लेम करू शकता!</span>
                ) : (
                  <span>क्लेमसाठी आणखी ₹{REFERRAL_CLAIM_THRESHOLD - referralEarnings} बाकी</span>
                )}
                <span>₹{REFERRAL_CLAIM_THRESHOLD} (किमान मर्यादा)</span>
              </div>
            </div>

            {claimSentMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  {isMarathi
                    ? '🎉 क्लेम विनंती यशस्वीपणे अ‍ॅडमिनकडे पाठवली गेली आहे! लवकरच आपल्या UPI ID वर पैसे पाठवले जातील.'
                    : 'Claim request submitted! Amount will be transferred to your UPI ID.'}
                </span>
              </div>
            )}

            {/* Claim Form */}
            <form onSubmit={handleClaimRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'पैसे स्वीकारण्यासाठी आपला UPI ID *' : 'Your UPI ID for Withdrawal *'}
                </label>
                <input
                  type="text"
                  required
                  value={claimUpi}
                  onChange={(e) => setClaimUpi(e.target.value)}
                  placeholder="उदा. mobile@okaxis / 98XXXXXXXX@ybl"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={!canClaim}
                className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  canClaim
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white cursor-pointer active:scale-98 shadow-emerald-500/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>
                  {canClaim
                    ? (isMarathi ? `₹${referralEarnings} खात्यात क्लेम करा (Withdraw ₹${referralEarnings})` : `Withdraw ₹${referralEarnings}`)
                    : (isMarathi ? `₹५० पूर्ण झाल्यावर क्लेम करता येईल (बाकी ₹${REFERRAL_CLAIM_THRESHOLD - referralEarnings})` : 'Reach ₹50 to Claim')}
                </span>
              </button>
            </form>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 font-medium">
              💡 <strong>टीप:</strong> गावातील इतर किराणा, कापड, हॉटेल, गॅरेज किंवा इतर दुकानदारांना ॲप शेअर करा आणि आपला रेफरल कोड वापरण्यास सांगा.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Digital QR Card & Printable Poster */}
      {activeTab === 'qrCard' && (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 text-center">
          <div className="border-4 border-orange-500 rounded-3xl p-6 bg-gradient-to-b from-orange-50/40 via-amber-50/30 to-white relative">
            <div className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider mb-3 shadow-xs">
              {isMarathi ? '🚩 आपलं गावातील दुकान' : 'Aapla Gavatil Dukan'}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 font-['Noto_Sans_Devanagari',sans-serif]">
              {shop.marathiName}
            </h2>
            <p className="text-sm font-bold text-slate-600 mt-1">
              {shop.villageOrCity}, {shop.district} • {shop.categoryLabelMr}
            </p>

            {/* Genuine Scannable QR Codes: WhatsApp and UPI */}
            <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* WhatsApp QR */}
              <div className="p-4 bg-white rounded-2xl shadow-md border-2 border-emerald-600">
                <QRCodeDisplay
                  value={`https://wa.me/91${shop.whatsapp || shop.mobile}?text=${encodeURIComponent(`नमस्कार ${shop.marathiName}, मला आपल्या दुकानाबद्दल माहिती हवी आहे.`)}`}
                  size={160}
                  showDownload={true}
                  downloadFileName={`${shop.marathiName.replace(/\s+/g, '_')}_WhatsApp_QR.png`}
                  label={isMarathi ? 'व्हॉट्सॲप मेसेजसाठी स्कॅन करा' : 'Scan for WhatsApp'}
                />
              </div>

              {/* UPI Payment QR */}
              {shop.upiId && (
                <div className="p-4 bg-white rounded-2xl shadow-md border-2 border-orange-500">
                  <QRCodeDisplay
                    value={`upi://pay?pa=${shop.upiId}&pn=${encodeURIComponent(shop.marathiName)}&cu=INR`}
                    size={160}
                    showDownload={true}
                    downloadFileName={`${shop.marathiName.replace(/\s+/g, '_')}_UPI_Payment_QR.png`}
                    label={isMarathi ? 'UPI पेमेंटसाठी स्कॅन करा' : 'Scan for UPI Payment'}
                  />
                </div>
              )}
            </div>

            <div className="text-xs text-slate-800 space-y-1 font-semibold">
              <p>📞 {isMarathi ? 'मोबाईल' : 'Phone'}: +91 {shop.mobile}</p>
              <p>📍 {shop.fullAddress}</p>
              {shop.upiId && <p>💳 UPI: {shop.upiId}</p>}
              {shop.gstNumber && <p>📜 GSTIN: {shop.gstNumber}</p>}
            </div>

            <p className="text-[11px] text-orange-700 font-black mt-4 pt-3 border-t border-amber-200">
              {isMarathi ? 'आमच्या दुकानाला भेट दिल्याबद्दल धन्यवाद! 🙏' : 'Thank you for visiting our shop! 🙏'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handlePrintQR}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isMarathi ? 'पोस्टर प्रिंट करा (Print Poster)' : 'Print QR Poster'}</span>
            </button>

            <button
              onClick={handleShareQR}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{isMarathi ? 'WhatsApp स्टेटसवर शेअर करा' : 'Share QR Card'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Edit Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3">
            {isMarathi ? 'दुकानाची माहिती अपडेट करा' : 'Edit Shop Profile'}
          </h3>

          {profileSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{isMarathi ? 'माहिती यशस्वीपणे जतन केली!' : 'Profile updated successfully!'}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Login Credentials Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800 border-b border-slate-200 pb-2">
                <Lock className="w-4 h-4 text-orange-600" />
                <span>{isMarathi ? 'दुकानदार लॉगिन तपशील (Credentials)' : 'Shop Login Credentials'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isMarathi ? 'युजरनेम (Username)' : 'Username'}
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    placeholder="savitri_kirana"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isMarathi ? 'मोबाईल नंबर' : 'Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isMarathi ? 'ईमेल आयडी (Email ID)' : 'Email ID'}
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="shop@gmail.com"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {isMarathi ? 'लॉगिन पासवर्ड (Password)' : 'Login Password'}
                  </label>
                  <input
                    type="text"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'दुकानाचे नाव' : 'Shop Name'}
              </label>
              <input
                type="text"
                value={editMarathiName}
                onChange={(e) => setEditMarathiName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'संचालकाचे नाव' : 'Owner Name'}
              </label>
              <input
                type="text"
                value={editOwner}
                onChange={(e) => setEditOwner(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'संपूर्ण पत्ता' : 'Full Address'}
              </label>
              <input
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'कामाची वेळ' : 'Opening Hours'}
                </label>
                <input
                  type="text"
                  value={editHours}
                  onChange={(e) => setEditHours(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'UPI आयडी' : 'UPI ID'}
                </label>
                <input
                  type="text"
                  value={editUpi}
                  onChange={(e) => setEditUpi(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 font-mono text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'GST नंबर (ऐच्छिक)' : 'GSTIN (Optional)'}
              </label>
              <input
                type="text"
                value={editGst}
                onChange={(e) => setEditGst(e.target.value)}
                placeholder="27AAAAA0000A1Z5"
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono uppercase rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isMarathi ? 'बदल जतन करा' : 'Save Changes'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
