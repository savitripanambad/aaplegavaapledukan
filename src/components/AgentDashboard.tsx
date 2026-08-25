import React, { useState } from 'react';
import {
  BadgePercent,
  Wallet,
  Store,
  ArrowDownToLine,
  TrendingUp,
  Share2,
  Copy,
  Check,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  LogOut,
  MapPin,
  Phone,
  Gift,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Send,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Agent, AgentClaimRequest, Shop } from '../types';
import {
  AGENT_REFERRAL_REWARD,
  AGENT_BONUS_AMOUNT,
  AGENT_BONUS_REFERRAL_THRESHOLD,
  AGENT_MIN_CLAIM_AMOUNT,
  calculateAgentEarnings
} from '../utils/helpers';

interface AgentDashboardProps {
  agent: Agent;
  allShops: Shop[];
  onUpdateAgent: (updated: Agent) => void;
  onLogout: () => void;
  onRequestClaim: (claim: AgentClaimRequest) => void;
  isMarathi: boolean;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  agent,
  allShops,
  onUpdateAgent,
  onLogout,
  onRequestClaim,
  isMarathi,
}) => {
  // Find all shops referred by this agent
  const myReferredShops = allShops.filter(
    (s) => s.referredBy && s.referredBy.trim().toUpperCase() === agent.referralCode.trim().toUpperCase()
  );

  const approvedShopsCount = myReferredShops.filter((s) => s.approvalStatus === 'approved').length;
  const pendingShopsCount = myReferredShops.filter((s) => s.approvalStatus === 'pending').length;

  // Earnings calculations
  const earningsData = calculateAgentEarnings(approvedShopsCount);
  const totalEarned = earningsData.totalEarnings;
  const totalClaimed = agent.claimedAmount || 0;
  const availableBalance = Math.max(0, totalEarned - totalClaimed);

  // Milestone calculations
  const progressToNextBonus = approvedShopsCount % AGENT_BONUS_REFERRAL_THRESHOLD;
  const progressPercent = Math.min(100, Math.round((progressToNextBonus / AGENT_BONUS_REFERRAL_THRESHOLD) * 100));
  const remainingForBonus = AGENT_BONUS_REFERRAL_THRESHOLD - progressToNextBonus;

  // State for Claim Modal
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimAmount, setClaimAmount] = useState<number>(availableBalance);
  const [claimUpiId, setClaimUpiId] = useState(agent.upiId || '');
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');
  const [claimErrorMsg, setClaimErrorMsg] = useState('');

  const [copiedCode, setCopiedCode] = useState(false);

  // Copy referral code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(agent.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // WhatsApp Share Invite
  const handleWhatsAppShare = () => {
    const message = `*महाराष्ट्र डिजिटल व्यापारी अभियान 🚩*\n\nनमस्कार! 🏪 आपल्या दुकानाची *'आपलं गावातील दुकान'* ॲपवर नोंदणी करा आणि थेट ग्राहकांकडून व्हॉट्सॲपवर ऑर्डर्स मिळवा.\n\n👉 *नोंदणी करताना माझा रेफरल कोड वापरा:*\n🎯 *${agent.referralCode}*\n\n📲 *ॲप लिंक:* ${window.location.origin}\n\nआपला अधिकृत प्रतिनिधी: ${agent.name} (${agent.villageOrCity}, ${agent.district})\nमोबाईल: ${agent.mobile}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Submit Claim / Withdrawal Request
  const handleProcessClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimErrorMsg('');

    if (claimAmount < AGENT_MIN_CLAIM_AMOUNT) {
      setClaimErrorMsg(
        isMarathi
          ? `किमान काढण्याची रक्कम ₹${AGENT_MIN_CLAIM_AMOUNT} आहे.`
          : `Minimum withdrawal amount is ₹${AGENT_MIN_CLAIM_AMOUNT}.`
      );
      return;
    }

    if (claimAmount > availableBalance) {
      setClaimErrorMsg(
        isMarathi
          ? `आपल्याकडे फक्त ₹${availableBalance} शिल्लक रक्कम उपलब्ध आहे.`
          : `Insufficient balance! Available: ₹${availableBalance}.`
      );
      return;
    }

    if (!claimUpiId.trim()) {
      setClaimErrorMsg(isMarathi ? 'कृपया वैध UPI आयडी प्रविष्ट करा.' : 'Please enter valid UPI ID.');
      return;
    }

    const newClaim: AgentClaimRequest = {
      id: `agent-claim-${Date.now()}`,
      agentId: agent.id,
      agentName: agent.name,
      agentMobile: agent.mobile,
      amount: claimAmount,
      upiId: claimUpiId.trim(),
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };

    onRequestClaim(newClaim);

    // Update local agent state
    const updatedAgent: Agent = {
      ...agent,
      totalReferrals: approvedShopsCount,
      totalEarnings: totalEarned,
      claimedAmount: totalClaimed + claimAmount,
      claimRequests: [newClaim, ...(agent.claimRequests || [])],
    };
    onUpdateAgent(updatedAgent);

    confetti({ particleCount: 70, spread: 60 });
    setClaimSuccessMsg(
      isMarathi
        ? `₹${claimAmount} रक्कम काढण्याची विनंती मुख्य अ‍ॅडमिनकडे पाठवली आहे! २४ तासांत आपल्या ${claimUpiId} वर जमा होईल.`
        : `Claim request of ₹${claimAmount} submitted to admin successfully!`
    );

    setTimeout(() => {
      setShowClaimModal(false);
      setClaimSuccessMsg('');
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-['Noto_Sans_Devanagari',sans-serif] space-y-6">
      {/* Top Banner & Profile Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-indigo-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
              {agent.name.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isMarathi ? 'अधिकृत डिजिटल प्रतिनिधी' : 'Official Agent'}
                </span>
                <span className="text-xs bg-white/10 text-purple-200 px-2.5 py-0.5 rounded-full">
                  ID: {agent.id}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white">
                {agent.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-purple-200 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  {agent.villageOrCity}, {agent.district}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-300" />
                  +91 {agent.mobile}
                </span>
                <span>•</span>
                <span className="font-mono text-amber-300">
                  UPI: {agent.upiId}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setClaimAmount(availableBalance);
                setShowClaimModal(true);
              }}
              disabled={availableBalance < AGENT_MIN_CLAIM_AMOUNT}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2 hover:scale-102"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>{isMarathi ? `रक्कम काढा (₹${availableBalance})` : `Claim Amount (₹${availableBalance})`}</span>
            </button>

            <button
              onClick={onLogout}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-white/20"
            >
              <LogOut className="w-4 h-4 text-rose-300" />
              <span>{isMarathi ? 'लॉगआउट' : 'Logout'}</span>
            </button>
          </div>
        </div>

        {/* Agent Referral Code Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl">
          <div className="space-y-0.5">
            <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">
              {isMarathi ? 'आपला नियुक्त एजंट रेफरल कोड (दुकानदारांना द्या):' : 'Your Agent Referral Code:'}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-wider">
                {agent.referralCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 cursor-pointer transition-colors"
                title="कोड कॉपी करा"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              {copiedCode && (
                <span className="text-[11px] text-emerald-400 font-bold">✓ कॉपी झाला!</span>
              )}
            </div>
          </div>

          <button
            onClick={handleWhatsAppShare}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 hover:scale-102"
          >
            <Share2 className="w-4 h-4" />
            <span>{isMarathi ? 'WhatsApp वर दुकानदारांना निमंत्रण पाठवा' : 'Invite Shops on WhatsApp'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earnings */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {isMarathi ? 'एकूण कमाई (Total Earnings)' : 'Total Earnings'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            ₹{totalEarned}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            ₹{AGENT_REFERRAL_REWARD}/दुकान + बोनस
          </div>
        </div>

        {/* Total Shops Referred */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {isMarathi ? 'जोडलेली दुकाने (Shops)' : 'Referred Shops'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono flex items-baseline gap-2">
            <span>{approvedShopsCount}</span>
            {pendingShopsCount > 0 && (
              <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                +{pendingShopsCount} प्रलंबित
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {isMarathi ? 'मंजूर दुकानांवर कमिशन' : 'Approved shops'}
          </div>
        </div>

        {/* Claimed Amount */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              {isMarathi ? 'काढलेली रक्कम (Paid)' : 'Claimed Payouts'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ArrowDownToLine className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            ₹{totalClaimed}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            {isMarathi ? 'बँक/UPI खात्यात जमा' : 'Paid to bank/UPI'}
          </div>
        </div>

        {/* Available Wallet Balance */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-4 sm:p-5 text-white shadow-md shadow-orange-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-100">
              {isMarathi ? 'शिल्लक वॉलेट (Available)' : 'Wallet Balance'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ₹{availableBalance}
          </div>
          <div className="text-[11px] text-orange-100 font-bold">
            {availableBalance >= AGENT_MIN_CLAIM_AMOUNT
              ? (isMarathi ? '✓ रक्कम काढण्यासाठी सज्ज' : 'Ready to withdraw')
              : (isMarathi ? `किमान ₹${AGENT_MIN_CLAIM_AMOUNT} आवश्यक` : `Min ₹${AGENT_MIN_CLAIM_AMOUNT}`)}
          </div>
        </div>
      </div>

      {/* 50 Referrals Milestone Progress Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-purple-500/10 rounded-3xl p-5 sm:p-6 border border-amber-300/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {isMarathi ? '५० रेफरल विशेष ₹१०० रोख बोनस टप्पा (Milestone)' : '50 Referrals ₹100 Bonus Milestone'}
              </h3>
              <p className="text-xs text-slate-600">
                {isMarathi
                  ? `दर ५० दुकानांनंतर अतिरिक्त ₹${AGENT_BONUS_AMOUNT} थेट आपल्या खात्यात!`
                  : `Get ₹${AGENT_BONUS_AMOUNT} bonus on every 50 shops referred!`}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-slate-500 block">
              {isMarathi ? 'पूर्ण झालेले टप्पे:' : 'Completed Milestones:'}
            </span>
            <span className="text-lg font-black text-indigo-950">
              {earningsData.completedMilestones} × ₹{AGENT_BONUS_AMOUNT} = ₹{earningsData.bonusEarnings}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700">
              {isMarathi ? `प्रगती: ${progressToNextBonus} / ${AGENT_BONUS_REFERRAL_THRESHOLD} दुकाने पूर्ण` : `Progress: ${progressToNextBonus} / 50 shops`}
            </span>
            <span className="text-amber-800 font-extrabold font-mono">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 rounded-full transition-all duration-700 shadow-inner"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span>
              {isMarathi
                ? `🎯 पुढील ₹१०० बोनससाठी आणखी फक्त ${remainingForBonus} दुकाने बाकी आहेत.`
                : `Only ${remainingForBonus} more shops needed for next ₹100 bonus.`}
            </span>
            <span className="text-emerald-700 font-bold">
              {isMarathi ? `+₹${AGENT_BONUS_AMOUNT} बोनस` : `+₹${AGENT_BONUS_AMOUNT} bonus`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Referred Shops & Payout History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Referred Shops List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {isMarathi ? 'माझ्या रेफरलने जोडलेली दुकाने' : 'My Referred Shops'}
                </h3>
                <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  {myReferredShops.length}
                </span>
              </div>
            </div>

            {myReferredShops.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <Store className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  {isMarathi ? 'अजून कोणतेही दुकान जोडले गेलेले नाही' : 'No shops registered with your code yet'}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {isMarathi
                    ? `आपला रेफरल कोड (${agent.referralCode}) परिसरातील दुकानदारांना द्या. दुकानदार नोंदणी करताना हा कोड टाकतील आणि आपल्याला लगेच कमिशन मिळेल!`
                    : 'Share your referral code with local shopkeepers to earn ₹3 per shop!'}
                </p>
                <button
                  onClick={handleWhatsAppShare}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isMarathi ? 'WhatsApp वर शेअर करा' : 'Share on WhatsApp'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myReferredShops.map((shop) => (
                  <div
                    key={shop.id}
                    className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black shrink-0 border border-orange-200">
                        <Store className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-900">
                            {shop.marathiName || shop.name}
                          </h4>
                          {shop.approvalStatus === 'approved' ? (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              मंजूर (Approved)
                            </span>
                          ) : shop.approvalStatus === 'rejected' ? (
                            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md">
                              नाकारले (Rejected)
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" />
                              प्रलंबित (Pending)
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600">
                          {shop.ownerName ? `${shop.ownerName} • ` : ''}{shop.villageOrCity}, {shop.district}
                        </p>

                        <p className="text-[11px] text-slate-400">
                          नोंदणी दिनांक: {shop.joinedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">
                          कमिशन
                        </span>
                        <span className="text-sm font-black text-emerald-700 font-mono">
                          {shop.approvalStatus === 'approved' ? `+₹${AGENT_REFERRAL_REWARD}.००` : 'प्रतीक्षेत...'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Payout Claims History */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDownToLine className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-900">
                  {isMarathi ? 'पैसे काढल्याचा इतिहास' : 'Withdrawal History'}
                </h3>
              </div>
            </div>

            {!agent.claimRequests || agent.claimRequests.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                {isMarathi ? 'अजून एकही क्लेम विनंती केलेली नाही.' : 'No claims submitted yet.'}
              </div>
            ) : (
              <div className="space-y-2.5">
                {agent.claimRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black font-mono text-slate-900">
                        ₹{req.amount}.००
                      </span>
                      {req.status === 'paid' ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          जमा झाले (Paid)
                        </span>
                      ) : req.status === 'rejected' ? (
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md">
                          नाकारले
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          प्रलंबित (Pending)
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>UPI: {req.upiId}</span>
                      <span>{new Date(req.requestedAt).toLocaleDateString('mr-IN')}</span>
                    </div>

                    {req.utrNumber && (
                      <div className="text-[10px] font-mono text-slate-600 bg-white p-1 rounded-md border border-slate-200">
                        UTR: {req.utrNumber}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Help Card */}
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 text-xs text-slate-700 space-y-2">
            <h4 className="font-black text-indigo-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>{isMarathi ? 'एजंट मदत व सपोर्ट' : 'Agent Support'}</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {isMarathi
                ? 'काही अडचण किंवा पेआउटबद्दल प्रश्न असल्यास थेट मुख्य अ‍ॅडमिन अविनाश बनसोडे यांच्याशी संपर्क साधा.'
                : 'For any payout questions, contact platform admin.'}
            </p>
            <div className="font-bold text-indigo-900 text-xs pt-1">
              📞 व्हॉट्सॲप / कॉल: ९३०७२२०४५४
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-['Noto_Sans_Devanagari',sans-serif]">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 relative">
              <button
                onClick={() => setShowClaimModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <ArrowDownToLine className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    {isMarathi ? 'रक्कम काढा (Withdraw Earnings)' : 'Claim Amount'}
                  </h3>
                  <p className="text-xs text-emerald-100">
                    {isMarathi ? `उपलब्ध शिल्लक: ₹${availableBalance}` : `Available: ₹${availableBalance}`}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleProcessClaimSubmit} className="p-5 space-y-4">
              {claimErrorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{claimErrorMsg}</span>
                </div>
              )}

              {claimSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{claimSuccessMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'काढायची रक्कम (₹) *' : 'Withdrawal Amount (₹) *'}
                </label>
                <input
                  type="number"
                  min={AGENT_MIN_CLAIM_AMOUNT}
                  max={availableBalance}
                  required
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-base font-black font-mono rounded-xl border border-slate-300 text-slate-900"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {isMarathi ? `किमान ₹${AGENT_MIN_CLAIM_AMOUNT} ते कमाल ₹${availableBalance}` : `Min ₹${AGENT_MIN_CLAIM_AMOUNT}`}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isMarathi ? 'जमा करण्यासाठी UPI आयडी *' : 'Payout UPI ID *'}
                </label>
                <input
                  type="text"
                  required
                  value={claimUpiId}
                  onChange={(e) => setClaimUpiId(e.target.value)}
                  placeholder="98XXXXXXXX@ybl"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-mono text-slate-900"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">💡 पेआउट प्रक्रिया:</span>
                <span>विनंती केल्यावर मुख्य अ‍ॅडमिनद्वारे आपल्या UPI खात्यावर रक्कम थेट जमा केली जाते व UTR नंबरसह नोंद ठेवली जाते.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isMarathi ? 'पैसे काढण्याची विनंती पाठवा' : 'Submit Withdrawal Request'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
