import React, { useState } from 'react';
import {
  Store,
  Save,
  CheckCircle,
  Lock,
  Phone,
  Mail,
  MapPin,
  Clock,
  QrCode,
  FileCheck,
  Tag,
  Plus,
  Trash2,
  Image,
  Sparkles,
  Eye,
  EyeOff,
  Building,
  Newspaper,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Shop, Category, District } from '../types';
import { CATEGORIES, DISTRICTS } from '../data/initialData';
import confetti from 'canvas-confetti';

interface ShopkeeperProfileEditProps {
  shop: Shop;
  onUpdateShop: (updatedShop: Shop) => void;
  isMarathi: boolean;
}

const PRESET_BANNERS = [
  { label: 'किराणा / जनरल स्टोअर', url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1000' },
  { label: 'कापड दुकान / साडी सेंटर', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1000' },
  { label: 'कृषी केंद्र / खते बियाणे', url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb2250d?auto=format&fit=crop&q=80&w=1000' },
  { label: 'मोबाईल शॉपी / इलेक्ट्रॉनिक्स', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000' },
  { label: 'हॉटेल, नाश्ता व चहा', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000' },
  { label: 'मेडिकल व फार्मसी', url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=1000' },
  { label: 'हॉस्पिटल व क्लिनिक', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000' },
  { label: 'सीएससी / महा-ई-सेवा', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1000' },
  { label: 'बँकिंग पॉईंट / पतसंस्था', url: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&q=80&w=1000' },
  { label: 'फळ विक्रेते / फ्रूट्स', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1000' },
  { label: 'ऑप्टिकल्स / चष्म्याचे दुकान', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=1000' },
  { label: 'पॅथॉलॉजी लॅब / डायग्नोस्टिक', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1000' },
  { label: 'हॉस्टेल / पीजी लॉजिंग', url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1000' },
  { label: 'सिव्हिल इंजिनिअर / आर्किटेक्ट', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1000' },
  { label: 'शाळा / इंग्लिश स्कूल / कॉलेज', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1000' },
  { label: 'मंदिर ट्रस्ट / धार्मिक स्थळ', url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&q=80&w=1000' },
  { label: 'पान शॉप / स्नॅक्स व कोल्ड्रिंक्स', url: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=1000' },
  { label: 'टॅक्स कन्सल्टंट / CA GST', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000' },
  { label: 'सीसीटीव्ही व सिक्युरिटी', url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=1000' },
  { label: 'सोनार व ज्वेलर्स', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000' },
  { label: 'बेकरी व गोडधोड', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1000' },
  { label: 'ऑटो गॅरेज व पंक्चर', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=1000' },
  { label: 'हार्डवेअर व सिमेंट', url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&q=80&w=1000' },
  { label: 'मंडप व कॅटरिंग', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000' },
];

export const ShopkeeperProfileEdit: React.FC<ShopkeeperProfileEditProps> = ({
  shop,
  onUpdateShop,
  isMarathi,
}) => {
  const [editMarathiName, setEditMarathiName] = useState(shop.marathiName || '');
  const [editEnglishName, setEditEnglishName] = useState(shop.name || '');
  const [editOwner, setEditOwner] = useState(shop.ownerName || '');
  const [editCategory, setEditCategory] = useState(shop.category || 'kirana');
  const [editCustomCategory, setEditCustomCategory] = useState(shop.customCategoryName || '');
  const [editSpecialization, setEditSpecialization] = useState(shop.serviceSpecialization || '');
  
  // Location
  const [editDistrict, setEditDistrict] = useState(shop.district || 'सातारा');
  const [editTaluka, setEditTaluka] = useState(shop.taluka || '');
  const [editVillageOrCity, setEditVillageOrCity] = useState(shop.villageOrCity || '');
  const [editLandmark, setEditLandmark] = useState(shop.landmark || '');
  const [editAddress, setEditAddress] = useState(shop.fullAddress || '');

  // Contact & Auth
  const [editMobile, setEditMobile] = useState(shop.mobile || '');
  const [editWhatsapp, setEditWhatsapp] = useState(shop.whatsapp || shop.mobile || '');
  const [editAlternatePhone, setEditAlternatePhone] = useState(shop.alternatePhone || '');
  const [editEmail, setEditEmail] = useState(shop.email || '');
  const [editUsername, setEditUsername] = useState(shop.username || '');
  const [editPassword, setEditPassword] = useState(shop.password || '');
  const [showPassword, setShowPassword] = useState(false);

  // Business info
  const [editHours, setEditHours] = useState(shop.openingHours || 'सकाळी ८:०० ते रात्री ९:००');
  const [editUpi, setEditUpi] = useState(shop.upiId || '');
  const [editGst, setEditGst] = useState(shop.gstNumber || '');
  const [editBannerUrl, setEditBannerUrl] = useState(shop.bannerUrl || PRESET_BANNERS[0].url);

  // Products / Services tag list
  const [productsList, setProductsList] = useState<string[]>(
    shop.productsServices && shop.productsServices.length > 0
      ? shop.productsServices
      : ['सर्व उत्पादने व सेवा']
  );
  const [newProductTag, setNewProductTag] = useState('');

  // Media / Patrakar fields
  const [editNewspaper, setEditNewspaper] = useState(shop.newspaperName || '');
  const [editNewsChannel, setEditNewsChannel] = useState(shop.newsChannelName || '');
  const [editPressCard, setEditPressCard] = useState(shop.pressCardNo || '');
  const [editNewsWhatsappGroup, setEditNewsWhatsappGroup] = useState(shop.newsWhatsappGroupUrl || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddProductTag = () => {
    if (!newProductTag.trim()) return;
    const trimmed = newProductTag.trim();
    if (!productsList.includes(trimmed)) {
      setProductsList([...productsList, trimmed]);
    }
    setNewProductTag('');
  };

  const handleRemoveProductTag = (tag: string) => {
    setProductsList(productsList.filter((t) => t !== tag));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCategoryObj = CATEGORIES.find((c) => c.id === editCategory);

    const updatedShop: Shop = {
      ...shop,
      marathiName: editMarathiName.trim() || shop.marathiName,
      name: editEnglishName.trim() || shop.name,
      ownerName: editOwner.trim() || shop.ownerName,
      category: editCategory,
      categoryLabelMr: selectedCategoryObj ? selectedCategoryObj.nameMr : shop.categoryLabelMr,
      categoryLabelEn: selectedCategoryObj ? selectedCategoryObj.nameEn : shop.categoryLabelEn,
      customCategoryName: editCategory === 'other' ? editCustomCategory.trim() : undefined,
      serviceSpecialization: editSpecialization.trim() || undefined,
      district: editDistrict,
      taluka: editTaluka.trim() || undefined,
      villageOrCity: editVillageOrCity.trim() || shop.villageOrCity,
      landmark: editLandmark.trim() || undefined,
      fullAddress: editAddress.trim() || shop.fullAddress,
      mobile: editMobile.trim().replace(/\D/g, '') || shop.mobile,
      whatsapp: editWhatsapp.trim().replace(/\D/g, '') || shop.whatsapp || shop.mobile,
      alternatePhone: editAlternatePhone.trim() || undefined,
      email: editEmail.trim() || undefined,
      username: editUsername.trim().toLowerCase().replace(/\s+/g, '_') || undefined,
      password: editPassword.trim() || shop.password,
      openingHours: editHours.trim() || shop.openingHours,
      upiId: editUpi.trim() || undefined,
      gstNumber: editGst.trim() ? editGst.trim().toUpperCase() : undefined,
      bannerUrl: editBannerUrl.trim() || shop.bannerUrl,
      productsServices: productsList.length > 0 ? productsList : shop.productsServices,
      newspaperName: editCategory === 'patrakar' ? editNewspaper.trim() : undefined,
      newsChannelName: editCategory === 'patrakar' ? editNewsChannel.trim() : undefined,
      pressCardNo: editCategory === 'patrakar' ? editPressCard.trim() : undefined,
      newsWhatsappGroupUrl: editCategory === 'patrakar' ? editNewsWhatsappGroup.trim() : undefined,
    };

    onUpdateShop(updatedShop);
    setSavedSuccess(true);
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header alert */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-5 text-white shadow-md flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black font-['Noto_Sans_Devanagari',sans-serif]">
            {isMarathi ? '📝 दुकानदार प्रोफाइल व माहिती संपादन' : 'Shopkeeper Profile & Business Settings'}
          </h3>
          <p className="text-xs text-amber-100 mt-0.5">
            {isMarathi
              ? 'येथे आपण दुकानाचे नाव, पत्ता, मोबाईल, वेळ, वस्तूंची यादी, फोटो व लॉगिन पासवर्ड बदलू शकता.'
              : 'Update your shop details, address, working hours, product list, photos and login password.'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
          <Store className="w-6 h-6" />
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-md text-xs sm:text-sm font-black flex items-center justify-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5 text-white" />
          <span>{isMarathi ? '✓ दुकानाची माहिती यशस्वीपणे अपडेट केली आहे!' : '✓ Shop profile updated successfully!'}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* SECTION 1: LOGIN & SECURITY CREDENTIALS */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
            <Lock className="w-4.5 h-4.5 text-orange-600" />
            <span>{isMarathi ? '१. लॉगिन युजरनेम व पासवर्ड (Login & Security)' : '1. Login & Security'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'लॉगिन युजरनेम (Username)' : 'Username'}
              </label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                placeholder="savitri_kirana"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-mono font-bold bg-slate-50/70"
              />
              <p className="text-[10px] text-slate-500 mt-1">{isMarathi ? 'लॉगिनसाठी सोपे युजरनेम ठेवा' : 'Use for quick login'}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'लॉगिन पासवर्ड (Password)' : 'Login Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-mono font-bold bg-slate-50/70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'ईमेल आयडी (Email ID - ऐच्छिक)' : 'Email ID (Optional)'}
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="myshop@gmail.com"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 bg-slate-50/70"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: SHOP BASIC INFO & CATEGORY */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
            <Store className="w-4.5 h-4.5 text-orange-600" />
            <span>{isMarathi ? '२. दुकानाचे नाव, मालक व कॅटेगरी' : '2. Business Identity & Category'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'दुकानाचे नाव (मराठीत)' : 'Shop Name (Marathi)'} *
              </label>
              <input
                type="text"
                required
                value={editMarathiName}
                onChange={(e) => setEditMarathiName(e.target.value)}
                placeholder="उदा. सावित्री किराणा स्टोअर्स"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'दुकानाचे नाव (इंग्रजीत)' : 'Shop Name (English)'}
              </label>
              <input
                type="text"
                value={editEnglishName}
                onChange={(e) => setEditEnglishName(e.target.value)}
                placeholder="e.g. Savitri Kirana Stores"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'दुकानदार / संचालकाचे नाव' : 'Owner / Proprietor Name'} *
              </label>
              <input
                type="text"
                required
                value={editOwner}
                onChange={(e) => setEditOwner(e.target.value)}
                placeholder="उदा. रमेश विठ्ठल पाटील"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'व्यवसाय प्रवर्ग (Category)' : 'Business Category'} *
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-bold bg-white"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameMr} ({cat.nameEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Category if other */}
          {editCategory === 'other' && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <label className="block text-xs font-bold text-amber-950 mb-1">
                {isMarathi ? 'आपल्या व्यवसायाचे नाव टाईप करा (Custom Category):' : 'Specify Custom Business Category:'}
              </label>
              <input
                type="text"
                value={editCustomCategory}
                onChange={(e) => setEditCustomCategory(e.target.value)}
                placeholder="उदा. फर्निचर मार्ट, लाकडी घाणा, मत्स्य व्यवसाय..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 bg-white text-slate-900 font-bold"
              />
            </div>
          )}

          {/* Specialization Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isMarathi ? 'विशेष सेवा / वैशिष्ट्ये / स्पेशलायझेशन' : 'Specialization & Facilities'}
            </label>
            <input
              type="text"
              value={editSpecialization}
              onChange={(e) => setEditSpecialization(e.target.value)}
              placeholder="उदा. २४ तास इमर्जन्सी, मोफत होम डिलिव्हरी, ५००० लिटर पिण्याचे पाणी, 2D/3D नकाशे..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-medium"
            />
          </div>

          {/* Journalist Specific Fields */}
          {editCategory === 'patrakar' && (
            <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-rose-950">
                <Newspaper className="w-4 h-4 text-rose-600" />
                <span>{isMarathi ? 'वृत्तपत्र व मीडिया माहिती (Media Details)' : 'Journalist Media Details'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-rose-900 mb-1">वृत्तपत्र नाव</label>
                  <input
                    type="text"
                    value={editNewspaper}
                    onChange={(e) => setEditNewspaper(e.target.value)}
                    placeholder="उदा. दैनिक सकाळ, लोकमत, पुढारी..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-rose-300 bg-white text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-rose-900 mb-1">न्यूज चॅनेल / वेब पोर्टल</label>
                  <input
                    type="text"
                    value={editNewsChannel}
                    onChange={(e) => setEditNewsChannel(e.target.value)}
                    placeholder="उदा. ABP माझा, युट्यूब न्यूज..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-rose-300 bg-white text-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-rose-900 mb-1">प्रेस कार्ड / RNI क्रमांक</label>
                  <input
                    type="text"
                    value={editPressCard}
                    onChange={(e) => setEditPressCard(e.target.value)}
                    placeholder="उदा. MH/PRESS/2026/..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-rose-300 bg-white text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-rose-900 mb-1">बातम्या WhatsApp ग्रुप लिंक</label>
                  <input
                    type="url"
                    value={editNewsWhatsappGroup}
                    onChange={(e) => setEditNewsWhatsappGroup(e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-rose-300 bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: CONTACT & ADDRESS */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
            <Phone className="w-4.5 h-4.5 text-orange-600" />
            <span>{isMarathi ? '३. संपर्क क्रमांक व पत्ता (Contact & Location)' : '3. Contact & Address'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'कॉलिंग मोबाईल नंबर' : 'Calling Mobile Number'} *
              </label>
              <input
                type="tel"
                required
                value={editMobile}
                onChange={(e) => setEditMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'व्हॉट्सॲप नंबर' : 'WhatsApp Number'} *
              </label>
              <input
                type="tel"
                required
                value={editWhatsapp}
                onChange={(e) => setEditWhatsapp(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'पर्यायी फोन (Alternate Phone)' : 'Alternate Phone'}
              </label>
              <input
                type="tel"
                value={editAlternatePhone}
                onChange={(e) => setEditAlternatePhone(e.target.value)}
                placeholder="9822000000"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'जिल्हा (District)' : 'District'} *
              </label>
              <select
                value={editDistrict}
                onChange={(e) => setEditDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-bold bg-white"
              >
                {DISTRICTS.filter((d) => d.id !== 'all').map((d) => (
                  <option key={d.id} value={d.nameMr}>
                    {d.nameMr} ({d.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'तालुका (Taluka)' : 'Taluka'}
              </label>
              <input
                type="text"
                value={editTaluka}
                onChange={(e) => setEditTaluka(e.target.value)}
                placeholder="उदा. कराड, फलटण, वाई..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'गाव किंवा शहर (Village / City)' : 'Village / City'} *
              </label>
              <input
                type="text"
                required
                value={editVillageOrCity}
                onChange={(e) => setEditVillageOrCity(e.target.value)}
                placeholder="उदा. कोडोली, ओगलेवाडी..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'लँडमार्क / जवळची खूण (Landmark)' : 'Landmark'}
              </label>
              <input
                type="text"
                value={editLandmark}
                onChange={(e) => setEditLandmark(e.target.value)}
                placeholder="उदा. ग्रामपंचायत शेजारी, बस स्टँड समोर..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'संपूर्ण पत्ता (Full Address)' : 'Full Address'} *
              </label>
              <input
                type="text"
                required
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder="उदा. दुकान क्र. ४, मेन रोड, सातारा"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: TIMINGS, PAYMENT & GST */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
            <Clock className="w-4.5 h-4.5 text-orange-600" />
            <span>{isMarathi ? '४. कामाची वेळ, UPI व GST' : '4. Timings, UPI & GST'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'दुकान उघडण्याची व बंद होण्याची वेळ' : 'Opening Hours'}
              </label>
              <input
                type="text"
                value={editHours}
                onChange={(e) => setEditHours(e.target.value)}
                placeholder="उदा. सकाळी ८:०० ते रात्री ९:००"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'दुकान UPI आयडी (ग्राहक पेमेंट QR साठी)' : 'Shop UPI ID (For Direct Payments)'}
              </label>
              <input
                type="text"
                value={editUpi}
                onChange={(e) => setEditUpi(e.target.value.trim())}
                placeholder="उदा. 9876543210@paytm / okaxis"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isMarathi ? 'GST नंबर (ऐच्छिक)' : 'GSTIN (Optional)'}
              </label>
              <input
                type="text"
                value={editGst}
                onChange={(e) => setEditGst(e.target.value.toUpperCase())}
                placeholder="27AAAAA0000A1Z5"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: PRODUCTS & SERVICES LIST */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
            <Tag className="w-4.5 h-4.5 text-orange-600" />
            <span>{isMarathi ? '५. उपलब्ध वस्तू, उत्पादने व सेवांची यादी' : '5. Products & Services Tags'}</span>
          </div>

          <p className="text-xs text-slate-600">
            {isMarathi
              ? 'आपल्या दुकानात मिळणाऱ्या वस्तू किंवा सेवांचे नाव टाईप करून (+) दाबा. ग्राहक सर्च करताना ही नावे पटकन शोधू शकतात.'
              : 'Add keywords of items or services available at your shop so customers find you easily.'}
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newProductTag}
              onChange={(e) => setNewProductTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddProductTag();
                }
              }}
              placeholder={isMarathi ? 'उदा. तांदूळ, मसाले, गव्हाचे पीठ, ड्रायफ्रूट्स...' : 'e.g. Rice, Spices, Wheat Flour...'}
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-semibold"
            />
            <button
              type="button"
              onClick={handleAddProductTag}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{isMarathi ? 'जोडा' : 'Add'}</span>
            </button>
          </div>

          {/* Tag Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {productsList.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-950 border border-orange-200 text-xs font-bold shadow-2xs"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveProductTag(tag)}
                  className="p-0.5 text-orange-400 hover:text-rose-600 rounded cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* SECTION 6: SHOP BANNER PHOTO */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
            <Image className="w-4.5 h-4.5 text-orange-600" />
            <span>{isMarathi ? '६. दुकानाचा बॅनर / फोटो (Shop Banner Photo)' : '6. Shop Banner Photo'}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isMarathi ? 'फोटो लिंक (Image URL)' : 'Image URL'}
            </label>
            <input
              type="url"
              value={editBannerUrl}
              onChange={(e) => setEditBannerUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500/40 text-slate-900 font-mono"
            />
          </div>

          <div>
            <span className="block text-xs font-bold text-slate-700 mb-2">
              {isMarathi ? 'किंवा खालीलपैकी एचडी फोटो निवडा (Quick Preset Photo):' : 'Or select a high-quality preset banner:'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {PRESET_BANNERS.map((preset, i) => {
                const isSelected = editBannerUrl === preset.url;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setEditBannerUrl(preset.url)}
                    className={`relative rounded-2xl overflow-hidden border-2 text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-500 ring-2 ring-orange-500/40 scale-102 shadow-md'
                        : 'border-slate-200 hover:border-orange-300'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-20 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-1.5 bg-slate-900/80 text-white text-[10px] font-bold truncate">
                      {preset.label}
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 p-1 bg-orange-500 text-white rounded-full shadow">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SUBMIT SAVE BUTTON */}
        <div className="sticky bottom-4 z-20 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 font-medium text-center sm:text-left">
            {isMarathi ? 'सर्व माहिती अचूक असल्याची खात्री करा आणि बदल जतन करा.' : 'Save updated details to refresh your store instantly.'}
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>{isMarathi ? 'बदल जतन करा (Save Changes)' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
