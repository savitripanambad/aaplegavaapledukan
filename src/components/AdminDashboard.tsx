import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Store,
  Users,
  Search,
  Phone,
  MessageCircle,
  ExternalLink,
  DollarSign,
  Gift,
  Clock,
  Eye,
  LogOut,
  Save,
  Check,
  Plus,
  Filter,
  FileCheck,
  AlertCircle,
  FileDown,
  Power,
  PowerOff,
  Building2,
  MapPin,
  RefreshCw,
  Printer,
  CreditCard,
  Wallet,
  Receipt,
  BadgePercent,
  Award,
  CheckCheck,
  Landmark,
  ArrowDownToLine
} from 'lucide-react';
import { Shop, Worker, ClaimRequest, District, Category, Agent, AgentClaimRequest } from '../types';
import {
  ADMIN_NAME,
  ADMIN_NAME_MR,
  ADMIN_UPI_ID,
  ADMIN_PHONE,
  AGENCY_NAME_MR,
  APP_OWNER_INFO,
  REGISTRATION_DISCOUNTED_PRICE
} from '../utils/helpers';
import { exportShopsToPdf, exportWorkersToPdf, exportPaymentsToPdf, downloadMarathiShopCertificate } from '../utils/pdfExport';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  shops: Shop[];
  workers: Worker[];
  claimRequests: ClaimRequest[];
  agents?: Agent[];
  agentClaims?: AgentClaimRequest[];
  districts: District[];
  categories: Category[];
  onApproveShop: (shopId: string) => void;
  onRejectShop: (shopId: string) => void;
  onDeleteShop: (shopId: string) => void;
  onUpdateShop: (shop: Shop) => void;
  onApproveWorker: (workerId: string) => void;
  onDeleteWorker: (workerId: string) => void;
  onUpdateWorker: (worker: Worker) => void;
  onProcessClaim: (claimId: string, status: 'approved' | 'rejected') => void;
  onProcessAgentClaim?: (claimId: string, status: 'paid' | 'rejected', utr?: string) => void;
  onApproveAgent?: (agentId: string) => void;
  onDeleteAgent?: (agentId: string) => void;
  onLogout: () => void;
  isMarathi: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  shops,
  workers,
  claimRequests,
  agents = [],
  agentClaims = [],
  districts,
  categories,
  onApproveShop,
  onRejectShop,
  onDeleteShop,
  onUpdateShop,
  onApproveWorker,
  onDeleteWorker,
  onUpdateWorker,
  onProcessClaim,
  onProcessAgentClaim,
  onApproveAgent,
  onDeleteAgent,
  onLogout,
  isMarathi,
}) => {
  const [activeTab, setActiveTab] = useState<
    'pendingShops' | 'allShops' | 'payments' | 'agents' | 'agentClaims' | 'workers' | 'claims'
  >('pendingShops');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentSearchTerm, setPaymentSearchTerm] = useState('');
  const [agentSearchTerm, setAgentSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected' | 'disabled'>('all');

  // Claim UTR numbers map
  const [claimUtrMap, setClaimUtrMap] = useState<{ [id: string]: string }>({});

  // Edit Shop Modal state
  const [editingShop, setEditingShop] = useState<Shop | null>(null);

  // Edit Worker Modal state
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  const pendingShops = shops.filter((s) => s.approvalStatus === 'pending');
  const approvedShops = shops.filter((s) => s.approvalStatus === 'approved' && !s.isDisabled);
  const rejectedShops = shops.filter((s) => s.approvalStatus === 'rejected');
  const disabledShops = shops.filter((s) => s.isDisabled);
  const paidShops = shops.filter((s) => s.isPaid || s.paymentDetails);
  const totalRevenue = paidShops.reduce((sum, s) => sum + (s.paymentDetails?.amount || REGISTRATION_DISCOUNTED_PRICE), 0);
  const pendingWorkers = workers.filter((w) => w.approvalStatus === 'pending');
  const pendingClaims = claimRequests.filter((c) => c.status === 'pending');
  const pendingAgentClaims = agentClaims.filter((ac) => ac.status === 'pending');


  const filteredShops = shops.filter((s) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (s.marathiName && s.marathiName.toLowerCase().includes(q)) ||
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.ownerName && s.ownerName.toLowerCase().includes(q)) ||
      (s.username && s.username.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.villageOrCity && s.villageOrCity.toLowerCase().includes(q)) ||
      (s.mobile && s.mobile.includes(searchTerm));

    const matchesDistrict = filterDistrict === 'all' || s.district === filterDistrict;

    let matchesStatus = true;
    if (filterStatus === 'approved') matchesStatus = s.approvalStatus === 'approved' && !s.isDisabled;
    else if (filterStatus === 'pending') matchesStatus = s.approvalStatus === 'pending';
    else if (filterStatus === 'rejected') matchesStatus = s.approvalStatus === 'rejected';
    else if (filterStatus === 'disabled') matchesStatus = !!s.isDisabled;

    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const filteredPaidShops = paidShops.filter((s) => {
    const q = paymentSearchTerm.toLowerCase();
    return (
      (s.marathiName && s.marathiName.toLowerCase().includes(q)) ||
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.ownerName && s.ownerName.toLowerCase().includes(q)) ||
      (s.villageOrCity && s.villageOrCity.toLowerCase().includes(q)) ||
      (s.mobile && s.mobile.includes(paymentSearchTerm)) ||
      (s.paymentDetails?.utrNumber && s.paymentDetails.utrNumber.toLowerCase().includes(q))
    );
  });

  const filteredWorkers = workers.filter((w) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      w.name.toLowerCase().includes(q) ||
      w.villageOrCity.toLowerCase().includes(q) ||
      w.professionLabelMr.toLowerCase().includes(q) ||
      w.mobile.includes(searchTerm);
    return matchesSearch;
  });

  // Toggle Disable Shop
  const handleToggleDisableShop = (shop: Shop) => {
    const updated: Shop = {
      ...shop,
      isDisabled: !shop.isDisabled,
    };
    onUpdateShop(updated);
    confetti({ particleCount: 20, spread: 30 });
  };

  // Toggle Disable Worker
  const handleToggleDisableWorker = (worker: Worker) => {
    const updated: Worker = {
      ...worker,
      isDisabled: !worker.isDisabled,
    };
    onUpdateWorker(updated);
    confetti({ particleCount: 20, spread: 30 });
  };

  const handleSaveShopEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShop) return;
    onUpdateShop(editingShop);
    setEditingShop(null);
    confetti({ particleCount: 30, spread: 40 });
  };

  const handleSaveWorkerEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorker) return;
    onUpdateWorker(editingWorker);
    setEditingWorker(null);
    confetti({ particleCount: 30, spread: 40 });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* Admin Top Header */}
      <div className="bg-slate-900 text-white p-5 sm:p-7 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800 relative overflow-hidden">
        <div className="flex items-start sm:items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center justify-center shrink-0 shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-orange-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                मुख्य अ‍ॅडमिन पॅनेल (Super Admin)
              </span>
              <span className="text-xs text-amber-300 font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md">
                UPI: {ADMIN_UPI_ID}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1.5 font-['Noto_Sans_Devanagari',sans-serif]">
              {ADMIN_NAME_MR} ({ADMIN_NAME}) - नियंत्रण कक्ष
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mt-1">
              <span className="flex items-center gap-1 font-bold text-amber-400">
                <Building2 className="w-3.5 h-3.5" />
                {AGENCY_NAME_MR}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                जालना-बीड रोड, अंबड, जि. जालना - ४३१२०४
              </span>
              <span>•</span>
              <span className="font-mono text-emerald-400 font-bold">
                फोन: +91 {ADMIN_PHONE}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-center relative z-10">
          {/* Quick 1-Click PDF Export Button */}
          <button
            onClick={() => exportShopsToPdf(shops, 'सर्व नोंदणीकृत दुकाने अहवाल', 'सर्व दुकाने')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer hover:scale-105"
            title="सर्व दुकानांची PDF डाऊनलोड करा"
          >
            <Printer className="w-4 h-4" />
            <span>{isMarathi ? '१-क्लिक PDF डाउनलोड' : '1-Click PDF Export'}</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{isMarathi ? 'अ‍ॅडमिन बाहेर पडा' : 'Exit Admin'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div
          onClick={() => {
            setActiveTab('pendingShops');
            setFilterStatus('pending');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'pendingShops'
              ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isMarathi ? 'मंजुरी प्रलंबित' : 'Pending Approvals'}</span>
            <Clock className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {pendingShops.length}
          </div>
          <span className="text-[11px] text-amber-800 font-bold block mt-0.5">
            {pendingShops.length > 0 ? '⚠️ नवीन नोंदणी तपासणी बाकी' : 'सर्व दुकाने तपासलेली आहेत'}
          </span>
        </div>

        <div
          onClick={() => {
            setActiveTab('allShops');
            setFilterStatus('all');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'allShops'
              ? 'bg-orange-50 border-orange-500 shadow-sm ring-2 ring-orange-500/20'
              : 'bg-white border-slate-200 hover:border-orange-400'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isMarathi ? 'एकूण दुकाने' : 'Total Shops'}</span>
            <Store className="w-4.5 h-4.5 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {shops.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
            {approvedShops.length} लाईव्ह • {disabledShops.length} अक्षम
          </span>
        </div>

        {/* Total Payments Collected KPI */}
        <div
          onClick={() => setActiveTab('payments')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isMarathi ? 'जमा झालेले पेमेंट्स' : 'Total Collected'}</span>
            <CreditCard className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            ₹{totalRevenue}
          </div>
          <span className="text-[11px] text-emerald-800 font-bold block mt-0.5">
            {paidShops.length} दुकानदारांनी भरणा केला
          </span>
        </div>

        <div
          onClick={() => setActiveTab('agents')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'agents'
              ? 'bg-purple-50 border-purple-500 shadow-sm ring-2 ring-purple-500/20'
              : 'bg-white border-slate-200 hover:border-purple-400'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isMarathi ? 'अधिकृत एजंट' : 'Agents'}</span>
            <BadgePercent className="w-4.5 h-4.5 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700">
            {agents.length}
          </div>
          <span className="text-[11px] text-purple-800 font-bold block mt-0.5">
            प्रतिनिधी व रेफरल नेटवर्क
          </span>
        </div>

        <div
          onClick={() => setActiveTab('agentClaims')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'agentClaims'
              ? 'bg-rose-50 border-rose-500 shadow-sm ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isMarathi ? 'एजंट पेआउट्स' : 'Agent Payouts'}</span>
            <ArrowDownToLine className="w-4.5 h-4.5 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-700">
            {pendingAgentClaims.length}
          </div>
          <span className="text-[11px] text-rose-800 font-bold block mt-0.5">
            {pendingAgentClaims.length > 0 ? '⚠️ पेआउट देणे बाकी' : 'सर्व पेआउट्स पूर्ण'}
          </span>
        </div>

        <div
          onClick={() => setActiveTab('workers')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'workers'
              ? 'bg-indigo-50 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:border-indigo-400'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isMarathi ? 'कुशल कामगार' : 'Artisans'}</span>
            <Users className="w-4.5 h-4.5 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700">
            {workers.length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
            वायरमन, लोहार, सुतार, प्लंबर
          </span>
        </div>

        <div
          onClick={() => setActiveTab('claims')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'claims'
              ? 'bg-amber-50 border-amber-500 shadow-sm ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">{isMarathi ? 'रेफरल क्लेम्स' : 'Referral Claims'}</span>
            <Gift className="w-4.5 h-4.5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700">
            {pendingClaims.length}
          </div>
          <span className="text-[11px] text-amber-700 font-bold block mt-0.5">
            {pendingClaims.length > 0 ? 'पेमेंट करणे बाकी' : 'सर्व क्लेम पूर्ण'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 overflow-x-auto pb-1 gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pendingShops')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'pendingShops'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{isMarathi ? 'मंजुरी प्रलंबित दुकाने' : 'Pending Approvals'}</span>
            {pendingShops.length > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingShops.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('allShops')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'allShops'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{isMarathi ? 'सर्व दुकाने (Edit / Disable / Delete)' : 'All Shops'}</span>
          </button>

          {/* Dedicated Payments Tab */}
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-emerald-600 text-white font-black shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>{isMarathi ? 'जमा झालेले पेमेंट्स (₹)' : 'Payments (₹)'}</span>
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-full">
              ₹{totalRevenue}
            </span>
          </button>

          {/* Agents Management Tab */}
          <button
            onClick={() => setActiveTab('agents')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'agents'
                ? 'bg-purple-600 text-white font-black shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BadgePercent className="w-4 h-4" />
            <span>{isMarathi ? 'अधिकृत एजंट (Agents)' : 'Agents'}</span>
            <span className="bg-purple-100 text-purple-900 text-[10px] font-black px-2 py-0.5 rounded-full">
              {agents.length}
            </span>
          </button>

          {/* Agent Payouts Tab */}
          <button
            onClick={() => setActiveTab('agentClaims')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'agentClaims'
                ? 'bg-rose-600 text-white font-black shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>{isMarathi ? 'एजंट पेआउट क्लेम्स' : 'Agent Payouts'}</span>
            {pendingAgentClaims.length > 0 && (
              <span className="bg-white text-rose-700 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                {pendingAgentClaims.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('workers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'workers'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isMarathi ? 'कामगार / कारागीर व्यवस्थापन' : 'Artisans'}</span>
            {pendingWorkers.length > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingWorkers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'claims'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>{isMarathi ? 'रेफरल पेआउट क्लेम्स' : 'Referral Payouts'}</span>
            {pendingClaims.length > 0 && (
              <span className="bg-amber-300 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {pendingClaims.length}
              </span>
            )}
          </button>
        </div>

        {/* Global PDF Export Dropdown/Button */}
        <button
          onClick={() => {
            if (activeTab === 'payments') {
              exportPaymentsToPdf(shops, 'जमा झालेले पेमेंट्स व महसूल अहवाल');
            } else if (activeTab === 'workers') {
              exportWorkersToPdf(workers, 'कुशल कारागीर व कामगार संपूर्ण यादी');
            } else if (activeTab === 'pendingShops') {
              exportShopsToPdf(pendingShops, 'नवीन नोंदणी झालेली प्रलंबित दुकाने', 'प्रलंबित (Pending Review)');
            } else {
              exportShopsToPdf(filteredShops, 'दुकानदार यादी अहवाल', `${filterDistrict === 'all' ? 'सर्व जिल्हे' : filterDistrict} (${filterStatus})`);
            }
          }}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 cursor-pointer shadow-2xs"
        >
          <FileDown className="w-3.5 h-3.5 text-orange-600" />
          <span>{isMarathi ? 'या टॅबची PDF डाऊनलोड' : 'Export Current Tab PDF'}</span>
        </button>
      </div>

      {/* TAB 1: Pending Approvals */}
      {activeTab === 'pendingShops' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">
                  {isMarathi ? 'नवीन नोंदणी झालेली दुकाने (Approval Workflow):' : 'New Shop Registrations:'}
                </span>
                <span>
                  {isMarathi
                    ? 'नवीन नोंदणी झालेली दुकाने आपण "मंजूर (Approve)" करेपर्यंत मुख्य होम पेजवर ग्राहकांना दिसणार नाहीत. दुकानाची माहिती व पेमेंट तपासून मंजुरी द्या.'
                    : 'Newly registered shops remain hidden from home page until approved.'}
                </span>
              </div>
            </div>

            {pendingShops.length > 0 && (
              <button
                onClick={() => exportShopsToPdf(pendingShops, 'नवीन नोंदणी झालेली दुकाने यादी', 'प्रलंबित दुकाने')}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>{isMarathi ? 'नवीन दुकानांची PDF' : 'New Shops PDF'}</span>
              </button>
            )}
          </div>

          {pendingShops.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                {isMarathi ? 'सध्या कोणतेही नवीन दुकान मंजुरीसाठी प्रलंबित नाही!' : 'No Pending Shops!'}
              </h3>
              <p className="text-xs text-slate-500">
                {isMarathi ? 'सर्व दुकाने मंजूर असून होम पेजवर सक्रिय आहेत.' : 'All registered shops are live.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingShops.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white p-5 rounded-2xl border-2 border-amber-400 shadow-md space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                        <img src={shop.bannerUrl} alt={shop.marathiName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <span className="bg-amber-100 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {shop.categoryLabelMr}
                        </span>
                        <h4 className="font-black text-sm text-slate-900 mt-0.5">
                          {shop.marathiName}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {shop.ownerName} • {shop.villageOrCity}, {shop.district}
                        </p>
                      </div>
                    </div>

                    <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                      पेंडिंग
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700 font-medium">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">युजरनेम (Username):</span>
                      <span className="font-bold font-mono text-orange-600">{shop.username || '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">मोबाईल नंबर:</span>
                      <span className="font-bold font-mono">+91 {shop.mobile}</span>
                    </div>
                    {shop.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">ईमेल आयडी:</span>
                        <span className="font-semibold text-slate-900 truncate max-w-[200px]">{shop.email}</span>
                      </div>
                    )}
                    {shop.password && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">लॉगिन पासवर्ड:</span>
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{shop.password}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">पत्ता:</span>
                      <span className="font-bold truncate max-w-[220px]">{shop.fullAddress}</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-800 pt-1 border-t border-slate-200">
                      <span>नोंदणी शुल्क:</span>
                      <span className="font-black">₹{REGISTRATION_DISCOUNTED_PRICE} (Paid via UPI) ✓</span>
                    </div>
                    {shop.gstNumber && (
                      <div className="flex items-center justify-between text-indigo-700">
                        <span>GSTIN:</span>
                        <span className="font-mono font-bold">{shop.gstNumber}</span>
                      </div>
                    )}
                    {shop.upiId && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Shop UPI:</span>
                        <span className="font-mono">{shop.upiId}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => onApproveShop(shop.id)}
                      className="flex-1 min-w-[140px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{isMarathi ? 'मंजूर करा (Approve Live)' : 'Approve Shop'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`खरोखर "${shop.marathiName}" हे दुकान नाकारायचे (Reject) आहे का?`)) {
                          onRejectShop(shop.id);
                        }
                      }}
                      className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                      title="नोंदणी नाकारा"
                    >
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>{isMarathi ? 'नाकारा' : 'Reject'}</span>
                    </button>

                    <button
                      onClick={() => downloadMarathiShopCertificate(shop)}
                      className="py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs border border-orange-200 transition-all cursor-pointer flex items-center justify-center gap-1"
                      title="दुकान अधिकृत नोंदणी प्रमाणपत्र (PDF डाउनलोड)"
                    >
                      <Printer className="w-4 h-4 text-orange-600" />
                      <span>{isMarathi ? 'प्रमाणपत्र' : 'Certificate'}</span>
                    </button>

                    <button
                      onClick={() => setEditingShop(shop)}
                      className="p-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                      title="माहिती दुरुस्त करा"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`खरोखर "${shop.marathiName}" हे दुकान कायमचे हटवायचे आहे का?`)) {
                          onDeleteShop(shop.id);
                        }
                      }}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                      title="हटवा / रद्द करा"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: All Registered Shops */}
      {activeTab === 'allShops' && (
        <div className="space-y-4">
          {/* Search, District & Status Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isMarathi ? 'दुकान, मालक, गाव किंवा मोबाईलने शोधा...' : 'Search shop, owner, mobile...'}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40 text-slate-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              >
                <option value="all">{isMarathi ? 'सर्व जिल्हे' : 'All Districts'}</option>
                {districts.filter((d) => d.id !== 'all').map((d) => (
                  <option key={d.id} value={d.nameMr}>
                    {d.nameMr}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              >
                <option value="all">{isMarathi ? 'सर्व स्थिती (Status)' : 'All Status'}</option>
                <option value="approved">{isMarathi ? 'मंजूर व सक्रिय (Live)' : 'Approved'}</option>
                <option value="pending">{isMarathi ? 'प्रलंबित (Pending)' : 'Pending'}</option>
                <option value="disabled">{isMarathi ? 'अक्षम (Disabled / बंद)' : 'Disabled'}</option>
              </select>

              <button
                onClick={() =>
                  exportShopsToPdf(
                    filteredShops,
                    'दुकानदार यादी अहवाल',
                    `${filterDistrict === 'all' ? 'सर्व जिल्हे' : filterDistrict} (${filterStatus})`
                  )
                }
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                title="यादीची PDF डाऊनलोड करा"
              >
                <FileDown className="w-4 h-4" />
                <span>{isMarathi ? 'PDF डाऊनलोड' : 'Download PDF'}</span>
              </button>
            </div>
          </div>

          {/* Shops Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-black">
                    <th className="py-3 px-3.5">{isMarathi ? 'दुकान व मालक' : 'Shop / Owner'}</th>
                    <th className="py-3 px-3.5">{isMarathi ? 'गाव व जिल्हा' : 'Location'}</th>
                    <th className="py-3 px-3.5">{isMarathi ? 'कॅटेगरी' : 'Category'}</th>
                    <th className="py-3 px-3.5">{isMarathi ? 'स्थिती (Status)' : 'Status'}</th>
                    <th className="py-3 px-3.5">{isMarathi ? 'सक्रिय / बंद (Active/Disable)' : 'Visibility'}</th>
                    <th className="py-3 px-3.5">{isMarathi ? 'रेफरल कमाई' : 'Referral'}</th>
                    <th className="py-3 px-3.5 text-right">{isMarathi ? 'कृती (Actions)' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredShops.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                        {isMarathi ? 'कोणतेही दुकान सापडले नाही.' : 'No shops match the filter criteria.'}
                      </td>
                    </tr>
                  ) : (
                    filteredShops.map((shop) => (
                      <tr
                        key={shop.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          shop.isDisabled ? 'bg-slate-100/60 opacity-80' : ''
                        }`}
                      >
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={shop.bannerUrl}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-200"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-black text-slate-900 flex items-center gap-1">
                                <span>{shop.marathiName}</span>
                                {shop.gstNumber && (
                                  <FileCheck className="w-3.5 h-3.5 text-indigo-600" title={`GST: ${shop.gstNumber}`} />
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {shop.ownerName} • <span className="font-mono text-slate-700 font-bold">{shop.mobile}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3.5 text-slate-700 font-medium">
                          <div className="font-bold">{shop.villageOrCity}</div>
                          <div className="text-[10px] text-slate-400">{shop.district}</div>
                        </td>

                        <td className="py-3 px-3.5">
                          <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            {shop.categoryLabelMr}
                          </span>
                        </td>

                        <td className="py-3 px-3.5">
                          {shop.isDisabled ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-black">
                              <PowerOff className="w-3 h-3 text-slate-500" />
                              अक्षम (Disabled)
                            </span>
                          ) : shop.approvalStatus === 'approved' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              मंजूर (Live)
                            </span>
                          ) : shop.approvalStatus === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-300">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              नाकारलेले (Rejected)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-300">
                              <Clock className="w-3 h-3 text-amber-600" />
                              प्रलंबित (Pending)
                            </span>
                          )}
                        </td>

                        {/* Disable / Enable Toggle */}
                        <td className="py-3 px-3.5">
                          <button
                            onClick={() => handleToggleDisableShop(shop)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              shop.isDisabled
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                            }`}
                            title={shop.isDisabled ? 'पुन्हा सुरू करा' : 'दुकान तात्पुरते बंद / अक्षम करा'}
                          >
                            {shop.isDisabled ? (
                              <>
                                <Power className="w-3 h-3 text-emerald-700" />
                                <span>सुरू करा</span>
                              </>
                            ) : (
                              <>
                                <PowerOff className="w-3 h-3 text-amber-700" />
                                <span>अक्षम करा</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3 px-3.5">
                          <span className="font-bold text-orange-600">
                            ₹{shop.referralEarnings || 0}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            ({shop.referralCount || 0} रेफरल)
                          </span>
                        </td>

                        <td className="py-3 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {shop.approvalStatus === 'pending' && (
                              <button
                                onClick={() => onApproveShop(shop.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer transition-colors"
                                title="मंजूर करा"
                              >
                                Approve
                              </button>
                            )}

                            <button
                              onClick={() => downloadMarathiShopCertificate(shop)}
                              className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors"
                              title="दुकान अधिकृत नोंदणी प्रमाणपत्र (PDF डाउनलोड)"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setEditingShop(shop)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                              title="दुरुस्त करा (Edit)"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`खरोखर "${shop.marathiName}" हे दुकान कायमचे हटवायचे आहे का?`)) {
                                  onDeleteShop(shop.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                              title="काढून टाका (Delete)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Payment Tracking & Revenue Logs */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="bg-emerald-950 text-white p-5 sm:p-6 rounded-3xl border border-emerald-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  अधिकृत पेमेंट्स ट्रॅकर (₹11 नोंदी)
                </span>
                <h3 className="text-lg sm:text-xl font-black mt-1 text-white">
                  {isMarathi ? 'दुकानदार नोंदणी फी जमा रक्कम व पावत्या' : 'Shop Registration Payment Records'}
                </h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  सर्व पेमेंट्स <span className="font-mono font-bold text-amber-300">{ADMIN_UPI_ID}</span> (सावित्री मल्टीसर्विसेस, अंबड) खात्यावर जमा होतात. नियमानुसार हे शुल्क नॉन-रिफंडेबल (परत न मिळणारे) आहे.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => exportPaymentsToPdf(shops, 'जमा झालेले पेमेंट्स व महसूल अहवाल')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer hover:scale-105"
              >
                <Printer className="w-4 h-4" />
                <span>{isMarathi ? 'पेमेंट्स रिपोर्ट PDF डाऊनलोड' : 'Export Payments PDF'}</span>
              </button>
            </div>
          </div>

          {/* Payment Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={paymentSearchTerm}
                onChange={(e) => setPaymentSearchTerm(e.target.value)}
                placeholder={isMarathi ? 'दुकान, मालक, मोबाईल किंवा UTR नंबरने शोधा...' : 'Search by shop, owner, mobile, or UTR...'}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-bold px-3 py-2 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
                एकूण भरणा: {filteredPaidShops.length} दुकाने (₹{filteredPaidShops.reduce((sum, s) => sum + (s.paymentDetails?.amount || REGISTRATION_DISCOUNTED_PRICE), 0)})
              </span>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-emerald-50/80 border-b border-emerald-200 text-emerald-950 font-black">
                    <th className="py-3 px-3.5">क्र.</th>
                    <th className="py-3 px-3.5">{isMarathi ? 'दुकान व मालकाचे नाव' : 'Shop / Owner'}</th>
                    <th className="py-3 px-3.5">{isMarathi ? 'गाव व जिल्हा' : 'Location'}</th>
                    <th className="py-3 px-3.5">{isMarathi ? 'मोबाईल नंबर' : 'Mobile'}</th>
                    <th className="py-3 px-3.5 text-center">{isMarathi ? 'भरलेली रक्कम' : 'Amount Paid'}</th>
                    <th className="py-3 px-3.5 text-center">{isMarathi ? 'तारीख व वेळ' : 'Date & Time'}</th>
                    <th className="py-3 px-3.5 font-mono">{isMarathi ? 'UTR / संदर्भ क्र.' : 'UTR / Ref No'}</th>
                    <th className="py-3 px-3.5 text-center">{isMarathi ? 'पेमेंट स्थिती' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPaidShops.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-500 font-medium">
                        <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <span>{isMarathi ? 'कोणतेही पेमेंट रेकॉर्ड सापडले नाही.' : 'No payment records found.'}</span>
                      </td>
                    </tr>
                  ) : (
                    filteredPaidShops.map((shop, idx) => {
                      const pay = shop.paymentDetails;
                      const amount = pay?.amount || REGISTRATION_DISCOUNTED_PRICE;
                      const dateStr = pay?.date || shop.joinedDate || 'आज';
                      const timeStr = pay?.time || '10:00 AM';
                      const utrStr = pay?.utrNumber || `UPI-REC-${shop.id.slice(-6)}`;

                      return (
                        <tr key={shop.id} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="py-3 px-3.5 font-bold text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3.5">
                            <div className="font-black text-slate-900 flex items-center gap-1.5">
                              <span>{shop.marathiName}</span>
                              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-normal">
                                {shop.categoryLabelMr}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              मालक: {shop.ownerName}
                            </div>
                          </td>
                          <td className="py-3 px-3.5 text-slate-700 font-medium">
                            <div className="font-bold">{shop.villageOrCity}</div>
                            <div className="text-[10px] text-slate-400">{shop.district}</div>
                          </td>
                          <td className="py-3 px-3.5 font-mono font-bold text-slate-700">
                            +91 {shop.mobile}
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs font-mono">
                              ₹{amount}.00
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-center text-slate-600">
                            <div className="font-medium">{dateStr}</div>
                            <div className="text-[10px] text-slate-400">{timeStr}</div>
                          </td>
                          <td className="py-3 px-3.5 font-mono font-bold text-indigo-700">
                            {utrStr}
                          </td>
                          <td className="py-3 px-3.5 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>यशस्वी (Paid)</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Skilled Workers / Karagir Management */}
      {activeTab === 'workers' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 text-xs text-indigo-950 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">
                  {isMarathi ? 'कुशल कामगार / कारागीर नियंत्रण (Wireman, Lohar, Sutar, Plumber etc.):' : 'Artisans & Workers Management:'}
                </span>
                <span>
                  {isMarathi
                    ? 'ज्यांचे स्वतःचे दुकान नाही पण ते कौशल्याने काम करतात (उदा. वायरमन, लोहार, सुतार, प्लंबर, गवंडी) त्यांचे प्रोफाईल येथे तपासा, संपादित करा किंवा हटवा.'
                    : 'Manage on-demand skilled local technicians and artisans.'}
                </span>
              </div>
            </div>

            <button
              onClick={() => exportWorkersToPdf(workers, 'कुशल कारागीर व कामगार संपूर्ण यादी')}
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isMarathi ? 'कामगार PDF' : 'Workers PDF'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className={`bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm space-y-3 ${
                  worker.isDisabled ? 'opacity-75 bg-slate-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={worker.photoUrl}
                    alt={worker.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="bg-indigo-100 text-indigo-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                        {worker.professionLabelMr}
                      </span>
                      {worker.isDisabled && (
                        <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-1.5 py-0.2 rounded">
                          अक्षम
                        </span>
                      )}
                    </div>
                    <h4 className="font-black text-sm text-slate-900 mt-1 truncate">
                      {worker.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {worker.villageOrCity}, {worker.district} • {worker.experienceYears} वर्ष अनुभव
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>मोबाईल:</span>
                    <span className="font-mono font-bold">+91 {worker.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>दर:</span>
                    <span className="font-bold text-emerald-700">{worker.dailyRate}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    कौशल्ये: {worker.skills.join(', ')}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <button
                    onClick={() => handleToggleDisableWorker(worker)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      worker.isDisabled
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900'
                    }`}
                  >
                    {worker.isDisabled ? 'सुरू करा' : 'अक्षम करा'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {worker.approvalStatus === 'pending' && (
                      <button
                        onClick={() => onApproveWorker(worker.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        मंजूर करा
                      </button>
                    )}

                    <button
                      onClick={() => setEditingWorker(worker)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                      title="दुरुस्त करा"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`खरोखर "${worker.name}" यांना हटवायचे आहे का?`)) {
                          onDeleteWorker(worker.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      title="हटवा"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: AGENTS MANAGEMENT */}
      {activeTab === 'agents' && (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-xs text-purple-950 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <BadgePercent className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">
                  {isMarathi ? 'अधिकृत डिजिटल एजंट प्रतिनिधी (Agent Network):' : 'Official Agent Network:'}
                </span>
                <span>
                  {isMarathi
                    ? 'गावोगावी दुकानदारांना जोडणारे एजंट्स. प्रत्येक दुकानावर ₹३ कमिशन + ५० दुकानांनंतर ₹१०० रोख बोनस दिला जातो.'
                    : 'Agents bringing village shops to the platform. ₹3 per shop referral + ₹100 bonus on 50 referrals.'}
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="bg-purple-200/80 text-purple-950 px-3 py-1 rounded-xl font-black font-mono">
                एकूण एजंट: {agents.length}
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={agentSearchTerm}
              onChange={(e) => setAgentSearchTerm(e.target.value)}
              placeholder={isMarathi ? 'एजंट नाव, मोबाईल, रेफरल कोड किंवा गावाने शोधा...' : 'Search by agent name, phone, code or village...'}
              className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {agents.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <BadgePercent className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                {isMarathi ? 'अद्याप एकही एजंट नोंदणी झालेली नाही' : 'No Agents Registered Yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isMarathi
                  ? 'गावातील तरुण व प्रतिनिधी "एजंट पोर्टल" द्वारे ₹५१ फी भरून नोंदणी करू शकतात.'
                  : 'Agents can register via the Agent Portal by paying ₹51 fee.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents
                .filter((a) => {
                  const q = agentSearchTerm.toLowerCase();
                  return (
                    a.name.toLowerCase().includes(q) ||
                    a.mobile.includes(agentSearchTerm) ||
                    a.referralCode.toLowerCase().includes(q) ||
                    a.villageOrCity.toLowerCase().includes(q) ||
                    a.district.toLowerCase().includes(q)
                  );
                })
                .map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-base shrink-0">
                          {agent.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-slate-900">{agent.name}</h4>
                          <p className="text-xs text-slate-500">{agent.villageOrCity}, {agent.district}</p>
                        </div>
                      </div>

                      <span className="text-[10px] bg-purple-100 text-purple-900 font-mono font-black px-2 py-0.5 rounded-md">
                        {agent.referralCode}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">मोबाईल:</span>
                        <span className="font-mono font-bold text-slate-900">+91 {agent.mobile}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">UPI ID:</span>
                        <span className="font-mono font-bold text-indigo-700">{agent.upiId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">जोडलेली दुकाने:</span>
                        <span className="font-black text-slate-900">{agent.totalReferrals || 0} दुकाने</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-200">
                        <span className="text-slate-500">एकूण कमाई:</span>
                        <span className="font-black text-emerald-700">₹{agent.totalEarnings || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">दिलेले पेआउट:</span>
                        <span className="font-black text-purple-700">₹{agent.claimedAmount || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${agent.mobile}`}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="कॉल करा"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/91${agent.mobile}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                          title="व्हॉट्सॲप मेसेज करा"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      {onDeleteAgent && (
                        <button
                          onClick={() => {
                            if (window.confirm(`खरोखर "${agent.name}" या एजंटला हटवायचे आहे का?`)) {
                              onDeleteAgent(agent.id);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors"
                          title="हटवा"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: AGENT PAYOUT CLAIMS */}
      {activeTab === 'agentClaims' && (
        <div className="space-y-4">
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-xs text-rose-950 flex items-start gap-3">
            <ArrowDownToLine className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                {isMarathi ? 'एजंट पेआउट क्लेम्स (Agent Withdrawal Requests):' : 'Agent Withdrawal Requests:'}
              </span>
              <span>
                {isMarathi
                  ? 'एजंट्सनी केलेल्या पैसे काढण्याच्या विनंत्या येथे दिसतील. त्यांच्या UPI वर पैसे पाठवून Transaction UTR नंबर नोंदवा आणि "Paid" मार्क करा.'
                  : 'Process agent commission withdrawals, record UTR and mark as Paid.'}
              </span>
            </div>
          </div>

          {agentClaims.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                {isMarathi ? 'कोणतीही प्रलंबित एजंट क्लेम विनंती नाही' : 'No Agent Claims Pending'}
              </h3>
              <p className="text-xs text-slate-500">
                {isMarathi ? 'एजंटने पैसे काढण्याची विनंती केल्यावर ती येथे दिसेल.' : 'New withdrawal requests will appear here.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agentClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm text-slate-900">{claim.agentName}</h4>
                      <p className="text-xs text-slate-500">फोन: +91 {claim.agentMobile}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-emerald-700 font-mono">
                        ₹{claim.amount}.००
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 font-medium text-slate-700">
                    <div className="flex justify-between">
                      <span>UPI आयडी:</span>
                      <span className="font-mono font-black text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {claim.upiId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>तारीख:</span>
                      <span>{new Date(claim.requestedAt).toLocaleDateString('mr-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>स्थिती:</span>
                      {claim.status === 'paid' ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          पेमेंट पूर्ण (Paid)
                        </span>
                      ) : claim.status === 'rejected' ? (
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-md">
                          रद्द (Rejected)
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          प्रलंबित (Pending)
                        </span>
                      )}
                    </div>
                    {claim.utrNumber && (
                      <div className="flex justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                        <span>UTR संदर्भ:</span>
                        <span className="font-mono font-bold">{claim.utrNumber}</span>
                      </div>
                    )}
                  </div>

                  {claim.status === 'pending' && onProcessAgentClaim && (
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">
                          पेमेंट ट्रान्सफर UTR नंबर (Optional):
                        </label>
                        <input
                          type="text"
                          value={claimUtrMap[claim.id] || ''}
                          onChange={(e) =>
                            setClaimUtrMap({ ...claimUtrMap, [claim.id]: e.target.value })
                          }
                          placeholder="उदा. 4235XXXXXXXX"
                          className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 font-mono text-slate-900"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const utr = claimUtrMap[claim.id] || `UTR-PAY-${Date.now().toString().slice(-6)}`;
                            onProcessAgentClaim(claim.id, 'paid', utr);
                            confetti({ particleCount: 50, spread: 60 });
                          }}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>पैसे पाठवले (Mark as Paid)</span>
                        </button>
                        <button
                          onClick={() => onProcessAgentClaim(claim.id, 'rejected')}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          रद्द करा
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Referral Claims Payouts */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
            <Gift className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                {isMarathi ? 'दुकानदार रेफरल कमिशन क्लेम्स (Payouts):' : 'Referral Payouts:'}
              </span>
              <span>
                {isMarathi
                  ? 'दुकानदारांनी ५० रुपये किंवा त्याहून अधिक रेफरल कमाई जमा झाल्यावर केलेल्या क्लेम विनंत्या येथे दिसतील. पैसे ट्रान्सफर करून "Paid" मार्क करा.'
                  : 'Approve referral commissions to shopkeepers who reached ₹50 threshold.'}
              </span>
            </div>
          </div>

          {claimRequests.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                {isMarathi ? 'कोणतीही प्रलंबित क्लेम विनंती नाही' : 'No Pending Claims'}
              </h3>
              <p className="text-xs text-slate-500">
                {isMarathi ? 'दुकानदारांचे ५० रुपये पूर्ण झाल्यावर ते क्लेम करतील.' : 'Claims will appear here when shops reach ₹50.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {claimRequests.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm text-slate-900">{claim.shopName}</h4>
                      <p className="text-xs text-slate-500">फोन: {claim.shopMobile}</p>
                    </div>
                    <span className="text-xl font-black text-emerald-700">
                      ₹{claim.amount}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 font-medium text-slate-700">
                    <div className="flex justify-between">
                      <span>UPI ID:</span>
                      <span className="font-mono font-black text-indigo-700">{claim.upiId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>तारीख:</span>
                      <span>{claim.requestedAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>स्थिती:</span>
                      <span className="font-bold uppercase text-amber-700">{claim.status}</span>
                    </div>
                  </div>

                  {claim.status === 'pending' && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onProcessClaim(claim.id, 'approved')}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-xs"
                      >
                        पैसे पाठवले (Mark Paid)
                      </button>
                      <button
                        onClick={() => onProcessClaim(claim.id, 'rejected')}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        रद्द करा
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EDIT SHOP MODAL */}
      {editingShop && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200">
            <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>दुकान माहिती संपादन (Admin Edit)</span>
              <button
                onClick={() => setEditingShop(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </h3>

            <form onSubmit={handleSaveShopEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">दुकानाचे नाव</label>
                <input
                  type="text"
                  required
                  value={editingShop.marathiName}
                  onChange={(e) => setEditingShop({ ...editingShop, marathiName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">संचालकाचे नाव</label>
                <input
                  type="text"
                  required
                  value={editingShop.ownerName}
                  onChange={(e) => setEditingShop({ ...editingShop, ownerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">मोबाईल नंबर</label>
                  <input
                    type="text"
                    required
                    value={editingShop.mobile}
                    onChange={(e) => setEditingShop({ ...editingShop, mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">गाव / शहर</label>
                  <input
                    type="text"
                    required
                    value={editingShop.villageOrCity}
                    onChange={(e) => setEditingShop({ ...editingShop, villageOrCity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">युजरनेम (Username)</label>
                  <input
                    type="text"
                    value={editingShop.username || ''}
                    onChange={(e) => setEditingShop({ ...editingShop, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    placeholder="savitri_kirana"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ईमेल (Email ID)</label>
                  <input
                    type="email"
                    value={editingShop.email || ''}
                    onChange={(e) => setEditingShop({ ...editingShop, email: e.target.value })}
                    placeholder="shop@gmail.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">लॉगिन पासवर्ड (Login Password)</label>
                <input
                  type="text"
                  value={editingShop.password || ''}
                  onChange={(e) => setEditingShop({ ...editingShop, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">संपूर्ण पत्ता</label>
                <input
                  type="text"
                  required
                  value={editingShop.fullAddress}
                  onChange={(e) => setEditingShop({ ...editingShop, fullAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GST नंबर (ऐच्छिक)</label>
                  <input
                    type="text"
                    value={editingShop.gstNumber || ''}
                    onChange={(e) => setEditingShop({ ...editingShop, gstNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono uppercase text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">मंजुरी स्थिती</label>
                  <select
                    value={editingShop.approvalStatus}
                    onChange={(e) => setEditingShop({ ...editingShop, approvalStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-900"
                  >
                    <option value="approved">मंजूर (Approved)</option>
                    <option value="pending">प्रलंबित (Pending)</option>
                    <option value="rejected">रद्द (Rejected)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="disableCheckbox"
                  checked={!!editingShop.isDisabled}
                  onChange={(e) => setEditingShop({ ...editingShop, isDisabled: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <label htmlFor="disableCheckbox" className="text-xs font-bold text-slate-800 cursor-pointer">
                  दुकान अक्षम करा (Disable from public home view)
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black cursor-pointer shadow-md"
                >
                  बदल जतन करा (Save)
                </button>
                <button
                  type="button"
                  onClick={() => setEditingShop(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold cursor-pointer"
                >
                  रद्द करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT WORKER MODAL */}
      {editingWorker && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 space-y-4 border border-slate-200">
            <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>कामगार माहिती संपादन (Admin Edit)</span>
              <button
                onClick={() => setEditingWorker(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </h3>

            <form onSubmit={handleSaveWorkerEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">कामगाराचे नाव</label>
                <input
                  type="text"
                  required
                  value={editingWorker.name}
                  onChange={(e) => setEditingWorker({ ...editingWorker, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">मोबाईल</label>
                  <input
                    type="text"
                    required
                    value={editingWorker.mobile}
                    onChange={(e) => setEditingWorker({ ...editingWorker, mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">गाव / शहर</label>
                  <input
                    type="text"
                    required
                    value={editingWorker.villageOrCity}
                    onChange={(e) => setEditingWorker({ ...editingWorker, villageOrCity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">दैनिक दर / फी</label>
                <input
                  type="text"
                  value={editingWorker.dailyRate}
                  onChange={(e) => setEditingWorker({ ...editingWorker, dailyRate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="disableWorkerCheckbox"
                  checked={!!editingWorker.isDisabled}
                  onChange={(e) => setEditingWorker({ ...editingWorker, isDisabled: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <label htmlFor="disableWorkerCheckbox" className="text-xs font-bold text-slate-800 cursor-pointer">
                  कामगार अक्षम करा (Disable from public view)
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black cursor-pointer shadow-md"
                >
                  बदल जतन करा (Save)
                </button>
                <button
                  type="button"
                  onClick={() => setEditingWorker(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold cursor-pointer"
                >
                  रद्द करा
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
