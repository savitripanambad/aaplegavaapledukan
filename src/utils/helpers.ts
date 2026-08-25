import { Shop, Offer, Worker } from '../types';

export const ADMIN_UPI_ID = '9307220454@pz';
export const ADMIN_PASSWORD = '9130551151'; // Secure Admin master password
export const ADMIN_NAME = 'Avinash Bansode';
export const ADMIN_NAME_MR = 'अविनाश बनसोडे';
export const ADMIN_PHONE = '9307220454';
export const ADMIN_EMAIL = 'savitripanambad@gmail.com';
export const AGENCY_NAME = 'Savitri Multiservices';
export const AGENCY_NAME_MR = 'सावित्री मल्टीसर्विसेस, अंबड';
export const AGENCY_ADDRESS = 'Savitri Multiservices, Jalna Beed Road, Ambad, Ta. Ambad, Dist. Jalna, PIN 431204';
export const AGENCY_ADDRESS_MR = 'सावित्री मल्टीसर्विसेस, जालना बीड रोड, अंबड, ता. अंबड, जि. जालना - ४३१२०४';

export const APP_TERMS_AND_CONDITIONS = [
  {
    titleMr: '१. नोंदणी शुल्क नॉन-रिफंडेबल (पैसे परत मिळणार नाहीत)',
    titleEn: '1. Registration Fee is Non-Refundable',
    descMr: 'दुकानदार नोंदणीसाठी भरलेले शुल्क (₹११ किंवा इतर कोणतीही रक्कम) कोणत्याही परिस्थितीत परत (Refund) केले जाणार नाही.',
    descEn: 'The registration fee paid (₹11 or any amount) is strictly non-refundable under all circumstances once processed.'
  },
  {
    titleMr: '२. सायबर हल्ला / सर्व्हर तांत्रिक अडचण धोरण',
    titleEn: '2. Cyber Attack & Technical Downtime Policy',
    descMr: 'अ‍ॅपवर किंवा सर्व्हरवर सायबर अटॅक (Cyber Attack), इंटरनेट अडचण किंवा इतर अनपेक्षित तांत्रिक समस्या उद्भवल्यास ॲप सेवा काही काळासाठी बंद होऊ शकते. अशा परिस्थितीत युजर्स आणि दुकानदारांसाठी सावित्री मल्टीसर्विसेस तर्फे नवीन ॲप, सुधारित लिंक किंवा पर्यायी सुरक्षित डिजिटल व्यवस्था त्वरित उपलब्ध करून देण्यात येईल.',
    descEn: 'In the event of a cyber attack, server crash, or unexpected technical failure, services may temporarily halt. Savitri Multiservices will promptly provide a new app version, backup link, or secure alternative platform.'
  },
  {
    titleMr: '३. अवैध अथवा फसव्या व्यापारास मनाई',
    titleEn: '3. Prohibition of Illegal or Fraudulent Trade',
    descMr: 'दुकानदारांनी केवळ वैध, कायदेशीर आणि अस्सल वस्तू/सेवांचीच माहिती नोंदवावी. कोणत्याही खोट्या दाव्यांना किंवा गैरव्यवहारास अ‍ॅप प्रशासन जबाबदार असणार नाही व अशा दुकानदारांचे खाते तात्काळ बंद (Ban) केले जाईल.',
    descEn: 'Shopkeepers must only list legal and genuine businesses. The app administration is not liable for merchant disputes and reserves the right to disable fraudulent accounts.'
  },
  {
    titleMr: '४. सर्व हक्क राखीव व संपर्क',
    titleEn: '4. Rights Reserved & Administration',
    descMr: 'सावित्री मल्टीसर्विसेस, अंबड (संचालक: अविनाश बनसोडे, संपर्क: ९३०७२२०४५४, ईमेल: savitripanambad@gmail.com) यांच्याकडे अ‍ॅपचे सर्व प्रशासकीय व व्यवस्थापकीय अधिकार सुरक्षित आहेत.',
    descEn: 'All platform rights are reserved by Savitri Multiservices, Ambad (Proprietor: Avinash Bansode, Contact: 9307220454, Email: savitripanambad@gmail.com).'
  }
];

export const APP_OWNER_INFO = {
  ownerName: ADMIN_NAME,
  ownerNameMr: ADMIN_NAME_MR,
  agencyName: AGENCY_NAME,
  agencyNameMr: AGENCY_NAME_MR,
  address: AGENCY_ADDRESS,
  addressMr: AGENCY_ADDRESS_MR,
  phone: ADMIN_PHONE,
  email: ADMIN_EMAIL,
  upiId: ADMIN_UPI_ID,
};

export const REGISTRATION_ORIGINAL_PRICE = 110;
export const REGISTRATION_DISCOUNTED_PRICE = 11;

// Shopkeeper referral settings
export const REFERRAL_REWARD_PER_SHOP = 1; // ₹1 earned per referral for shops
export const REFERRAL_CLAIM_THRESHOLD = 50; // Claim payout once ₹50 is accumulated

// Agent Panel & Referral System settings
export const AGENT_REGISTRATION_FEE = 51; // ₹51 registration/joining fee for Agents
export const AGENT_REFERRAL_REWARD = 3; // Agent earns ₹3 per successful referral
export const AGENT_BONUS_REFERRAL_THRESHOLD = 50; // 50 referrals
export const AGENT_BONUS_AMOUNT = 100; // Special ₹100 bonus on every 50 referrals
export const AGENT_MIN_CLAIM_AMOUNT = 10; // Minimum claim threshold for agents

/**
 * Calculate total agent earnings based on referral count
 * e.g. 50 referrals = 50 * 3 + 100 = ₹250
 */
export function calculateAgentEarnings(referralCount: number): {
  baseEarnings: number;
  bonusEarnings: number;
  totalEarnings: number;
  completedMilestones: number;
  nextMilestoneRemaining: number;
} {
  const baseEarnings = referralCount * AGENT_REFERRAL_REWARD;
  const completedMilestones = Math.floor(referralCount / AGENT_BONUS_REFERRAL_THRESHOLD);
  const bonusEarnings = completedMilestones * AGENT_BONUS_AMOUNT;
  const totalEarnings = baseEarnings + bonusEarnings;
  const nextMilestoneRemaining = AGENT_BONUS_REFERRAL_THRESHOLD - (referralCount % AGENT_BONUS_REFERRAL_THRESHOLD);

  return {
    baseEarnings,
    bonusEarnings,
    totalEarnings,
    completedMilestones,
    nextMilestoneRemaining: nextMilestoneRemaining === 0 ? AGENT_BONUS_REFERRAL_THRESHOLD : nextMilestoneRemaining,
  };
}

/**
 * Auto generates a clean, unique Agent referral code (e.g. AGT-SAT-8492)
 */
export function generateAgentReferralCode(prefix: string = 'AGT'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const cleanPrefix = (prefix || 'AGT').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3);
  return `AGT-${cleanPrefix || 'MH'}-${rand}`;
}

/**
 * Auto generates a clean, unique referral code (e.g., REF-SAT-8492 or REF-KIR-5931)
 */
export function generateReferralCode(prefix: string = 'MH'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const cleanPrefix = (prefix || 'MH').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3);
  return `REF-${cleanPrefix || 'MH'}-${rand}`;
}

export function openWhatsAppEnquiry(shop: Shop, offer?: Offer, customItem?: string) {
  const phone = shop.whatsapp.replace(/\D/g, '');
  const cleanPhone = phone.startsWith('91') ? phone : `91${phone}`;

  let message = `नमस्कार ${shop.ownerName || shop.marathiName} जी 🙏\n\nमी *आपलं गावातील दुकान* ॲपवरून आपल्या *"${shop.marathiName}"* बद्दल माहिती मिळवली आहे.`;

  if (offer) {
    message += `\n\n🎁 मला आपल्या *"${offer.title}"* (${offer.discountValue}) या ऑफरबद्दल माहिती हवी आहे.`;
  } else if (customItem) {
    message += `\n\n🛍️ मला आपल्याकडे *"${customItem}"* उपलब्ध आहे का आणि त्याची किंमत काय आहे ते जाणून घ्यायचे आहे.`;
  } else {
    message += `\n\nकृपया आपल्या दुकानातील वस्तूंचे दर / होम डिलिव्हरी उपलब्ध असल्यास कळवा. धन्यवाद!`;
  }

  message += `\n\n📍 गाव/शहर: ${shop.villageOrCity} (${shop.district})`;

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export function openWorkerWhatsAppEnquiry(worker: Worker, customTask?: string) {
  const phone = worker.whatsapp.replace(/\D/g, '');
  const cleanPhone = phone.startsWith('91') ? phone : `91${phone}`;

  let message = `नमस्कार ${worker.name} जी 🙏\n\nमी *आपलं गावातील दुकान* ॲपवरून आपल्या *${worker.professionLabelMr}* कामाबद्दल संपर्क करत आहे.`;

  if (customTask) {
    message += `\n\n🔧 कामाचा तपशील: *${customTask}*`;
  } else {
    message += `\n\n🔧 मला आपल्या कारागीर कामाची गरज आहे. आपण सध्या कामासाठी उपलब्ध आहात का? कृपया सांगा.`;
  }

  message += `\n\n📍 गाव/शहर: ${worker.villageOrCity} (${worker.district})`;

  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export function openPhoneCall(phoneNumber: string) {
  window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`;
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getMarathiDateString(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const months = ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

/**
 * Generate standard UPI intent URL for payment
 */
export function getUpiPaymentUrl(amount: number = 11, note: string = 'Aapla Gavatil Dukan Registration'): string {
  const encodedName = encodeURIComponent('Avinash Bansode');
  const encodedNote = encodeURIComponent(note);
  return `upi://pay?pa=${ADMIN_UPI_ID}&pn=${encodedName}&am=${amount}&cu=INR&tn=${encodedNote}`;
}

/**
 * Compresses an image File to a Data URL ensuring it stays well under 500 KB
 */
export function compressImageFile(file: File, maxKB: number = 500): Promise<{ dataUrl: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('फक्त इमेज फाईल (JPG/PNG/WEBP) अपलोड करा.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimension clamp to 1200px
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context failed'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        // Progressively compress until under maxKB
        while (sizeKb > maxKB && quality > 0.3) {
          quality -= 0.15;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        }

        resolve({ dataUrl, sizeKb });
      };
      img.onerror = () => reject(new Error('इमेज लोड करण्यात त्रुटी.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('फाईल वाचण्यात त्रुटी.'));
    reader.readAsDataURL(file);
  });
}

