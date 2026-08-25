export interface Offer {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat' | 'bogo' | 'special';
  discountValue: string; // e.g. "15%", "₹50", "1 वर 1 मोफत"
  validTill: string;
  code?: string;
  badge?: string;
}

export interface SalesRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  customerName?: string;
  customerPhone?: string;
  amount: number;
  paymentMode: 'cash' | 'upi' | 'credit';
  itemsNotes: string;
}

export interface Review {
  id: string;
  shopId: string;
  userName: string;
  userPhone?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  village?: string;
}

export interface ClaimRequest {
  id: string;
  shopId: string;
  shopName: string;
  ownerName?: string;
  shopMobile?: string;
  amount: number;
  upiId: string;
  requestedAt?: string;
  date?: string;
  status: 'pending' | 'paid' | 'approved' | 'rejected';
}

export interface Shop {
  id: string;
  name: string;
  marathiName: string;
  ownerName: string;
  category: string; // category id
  categoryLabelMr: string;
  categoryLabelEn: string;
  mobile: string;
  whatsapp: string;
  alternatePhone?: string;
  bannerUrl: string;
  photoUrls: string[];
  district: string;
  taluka?: string;
  villageOrCity: string;
  landmark?: string;
  fullAddress: string;
  openingHours: string;
  isOpenNow?: boolean;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  offers: Offer[];
  productsServices: string[];
  upiId?: string;
  joinedDate: string;
  freeTrialEndsAt: string;
  isPaid: boolean;
  stats: {
    views: number;
    whatsappInquiries: number;
    callInquiries: number;
    dealClicks: number;
  };
  salesHistory: SalesRecord[];
  // New requirements
  approvalStatus: 'approved' | 'pending' | 'rejected';
  isDisabled?: boolean; // When disabled, shop is inactive and hidden from public
  username?: string; // Unique shopkeeper login username (e.g. savitri_kirana)
  password?: string; // Secure login password created by shopkeeper
  email?: string; // Shopkeeper contact/recovery email
  paymentDetails?: {
    amount: number;
    date: string;
    time?: string;
    upiId: string;
    utrNumber?: string;
    status: 'completed' | 'pending' | 'verified';
  };
  reviews?: Review[];
  gstNumber?: string;
  referralCode?: string;
  referredBy?: string;
  referralEarnings?: number; // ₹1 per referred shop
  referralCount?: number;
  claimRequests?: ClaimRequest[];
}

export interface PaymentRecord {
  id: string;
  shopId: string;
  shopName: string;
  ownerName: string;
  mobile: string;
  amount: number;
  date: string;
  time: string;
  upiId: string; // 9307220454@pz
  utrNumber?: string;
  status: 'completed' | 'pending' | 'verified';
  note: string;
}

export interface Category {
  id: string;
  nameMr: string;
  nameEn: string;
  iconName: string;
  color: string;
  bgGradient: string;
  popularItems: string[];
}

export interface Taluka {
  id: string;
  nameMr: string;
  nameEn: string;
  villages: string[];
}

export interface District {
  id: string;
  nameMr: string;
  nameEn: string;
  division?: string;
  talukas?: Taluka[];
  popularVillages: string[];
}

// Skilled Artisans / Workers without physical shops (Wireman, Lohar, Sutar, etc.)
export interface WorkerProfession {
  id: string;
  nameMr: string;
  nameEn: string;
  iconName: string;
  color: string;
  bgGradient: string;
  popularWork: string[];
}

export interface Worker {
  id: string;
  name: string;
  profession: string; // 'wireman' | 'sutar' | 'lohar' | 'plumber' | 'painter' | 'mason' | 'mechanic' | 'tractor' | 'other'
  professionLabelMr: string;
  professionLabelEn: string;
  mobile: string;
  whatsapp: string;
  district: string;
  villageOrCity: string;
  landmark?: string;
  experienceYears: number;
  dailyRate: string; // e.g. "₹500 - ₹800 / दिवस" किंवा "कामावर आधारित"
  skills: string[];
  photoUrl: string;
  isAvailable: boolean; // कामासाठी उपलब्ध आहे / सध्या व्यस्त
  rating: number;
  totalReviews: number;
  bio?: string;
  joinedDate: string;
  isVerified: boolean;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  isDisabled?: boolean;
  stats: {
    views: number;
    calls: number;
    whatsappInquiries: number;
  };
}

