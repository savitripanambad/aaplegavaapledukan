import React, { useState, useEffect, useMemo } from 'react';
import { PlayStoreBanner } from './components/PlayStoreBanner';
import { Header } from './components/Header';
import { HeroSearchBanner } from './components/HeroSearchBanner';
import { ShopCard } from './components/ShopCard';
import { ShopDetailModal } from './components/ShopDetailModal';
import { ShopkeeperAuthModal } from './components/ShopkeeperAuthModal';
import { ShopkeeperDashboard } from './components/ShopkeeperDashboard';
import { AgentAuthModal } from './components/AgentAuthModal';
import { AgentDashboard } from './components/AgentDashboard';
import { VillageSelectorModal } from './components/VillageSelectorModal';
import { SavedShopsModal } from './components/SavedShopsModal';
import { OffersView } from './components/OffersView';
import { WorkersView } from './components/WorkersView';
import { WorkerRegistrationModal } from './components/WorkerRegistrationModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { INITIAL_SHOPS, INITIAL_WORKERS, INITIAL_CLAIMS, INITIAL_AGENTS, INITIAL_AGENT_CLAIMS, CATEGORIES, DISTRICTS } from './data/initialData';
import { Shop, District, Review, Worker, ClaimRequest, Agent, AgentClaimRequest } from './types';
import { Store, PlusCircle, Sparkles, MapPin, Heart, ShieldCheck, Users, ShieldAlert, CloudCheck, BadgePercent } from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateAgentEarnings } from './utils/helpers';
import {
  subscribeToShops,
  subscribeToWorkers,
  subscribeToClaims,
  syncShopToCloud,
  deleteShopFromCloud,
  syncWorkerToCloud,
  deleteWorkerFromCloud,
  syncClaimToCloud
} from './services/firebaseSync';

const STORAGE_SHOPS_KEY = 'aapla_gavatil_dukan_shops_v2';
const STORAGE_WORKERS_KEY = 'aapla_gavatil_dukan_workers_v2';
const STORAGE_CLAIMS_KEY = 'aapla_gavatil_dukan_claims_v2';
const STORAGE_AGENTS_KEY = 'aapla_gavatil_dukan_agents_v2';
const STORAGE_AGENT_CLAIMS_KEY = 'aapla_gavatil_dukan_agent_claims_v2';
const STORAGE_SAVED_KEY = 'aapla_gavatil_dukan_saved_v2';
const STORAGE_USER_SHOP_KEY = 'aapla_gavatil_dukan_logged_shop_v2';
const STORAGE_USER_AGENT_KEY = 'aapla_gavatil_dukan_logged_agent_v2';
const STORAGE_ADMIN_KEY = 'aapla_gavatil_dukan_admin_v2';

export default function App() {
  const [isMarathi, setIsMarathi] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'offers' | 'workers' | 'dashboard' | 'agent' | 'admin'>('home');

  // Shops State with LocalStorage
  const [shops, setShops] = useState<Shop[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SHOPS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading localStorage shops:', e);
    }
    return INITIAL_SHOPS;
  });

  // Workers State with LocalStorage
  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_WORKERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading localStorage workers:', e);
    }
    return INITIAL_WORKERS;
  });

  // Referral Claim Requests State with LocalStorage
  const [claimRequests, setClaimRequests] = useState<ClaimRequest[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CLAIMS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading localStorage claims:', e);
    }
    return INITIAL_CLAIMS;
  });

  // Agents State with LocalStorage
  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_AGENTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading localStorage agents:', e);
    }
    return INITIAL_AGENTS;
  });

  // Agent Claims State with LocalStorage
  const [agentClaims, setAgentClaims] = useState<AgentClaimRequest[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_AGENT_CLAIMS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading localStorage agent claims:', e);
    }
    return INITIAL_AGENT_CLAIMS;
  });

  // Saved / Bookmarked shops
  const [savedShopIds, setSavedShopIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SAVED_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading saved shops:', e);
    }
    return [];
  });

  // Logged-in Shopkeeper ID
  const [loggedInShopId, setLoggedInShopId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_USER_SHOP_KEY) || null;
    } catch {
      return null;
    }
  });

  // Logged-in Agent ID
  const [loggedInAgentId, setLoggedInAgentId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_USER_AGENT_KEY) || null;
    } catch {
      return null;
    }
  });

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_ADMIN_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Location filter state
  const [currentDistrict, setCurrentDistrict] = useState<District>(DISTRICTS[0]);
  const [currentVillage, setCurrentVillage] = useState<string>('सर्व');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);

  // Modals state
  const [selectedShopForModal, setSelectedShopForModal] = useState<Shop | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAgentAuthModal, setShowAgentAuthModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [showWorkerRegModal, setShowWorkerRegModal] = useState(false);

  // Subscribe to real-time Cloud Firestore updates
  useEffect(() => {
    const unsubShops = subscribeToShops((cloudShops) => {
      if (cloudShops && cloudShops.length > 0) {
        setShops(cloudShops);
      }
    });

    const unsubWorkers = subscribeToWorkers((cloudWorkers) => {
      if (cloudWorkers && cloudWorkers.length > 0) {
        setWorkers(cloudWorkers);
      }
    });

    const unsubClaims = subscribeToClaims((cloudClaims) => {
      if (cloudClaims && cloudClaims.length > 0) {
        setClaimRequests(cloudClaims);
      }
    });

    return () => {
      unsubShops();
      unsubWorkers();
      unsubClaims();
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SHOPS_KEY, JSON.stringify(shops));
    } catch (e) {
      console.error('Error saving shops:', e);
    }
  }, [shops]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WORKERS_KEY, JSON.stringify(workers));
    } catch (e) {
      console.error('Error saving workers:', e);
    }
  }, [workers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CLAIMS_KEY, JSON.stringify(claimRequests));
    } catch (e) {
      console.error('Error saving claims:', e);
    }
  }, [claimRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedShopIds));
    } catch (e) {
      console.error('Error saving savedShopIds:', e);
    }
  }, [savedShopIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_AGENTS_KEY, JSON.stringify(agents));
    } catch (e) {
      console.error('Error saving agents:', e);
    }
  }, [agents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_AGENT_CLAIMS_KEY, JSON.stringify(agentClaims));
    } catch (e) {
      console.error('Error saving agent claims:', e);
    }
  }, [agentClaims]);

  useEffect(() => {
    try {
      if (loggedInShopId) {
        localStorage.setItem(STORAGE_USER_SHOP_KEY, loggedInShopId);
      } else {
        localStorage.removeItem(STORAGE_USER_SHOP_KEY);
      }
    } catch (e) {
      console.error('Error storing user shop:', e);
    }
  }, [loggedInShopId]);

  useEffect(() => {
    try {
      if (loggedInAgentId) {
        localStorage.setItem(STORAGE_USER_AGENT_KEY, loggedInAgentId);
      } else {
        localStorage.removeItem(STORAGE_USER_AGENT_KEY);
      }
    } catch (e) {
      console.error('Error storing user agent:', e);
    }
  }, [loggedInAgentId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ADMIN_KEY, isAdminLoggedIn ? 'true' : 'false');
    } catch (e) {
      console.error('Error saving admin status:', e);
    }
  }, [isAdminLoggedIn]);

  const loggedInShop = useMemo(() => {
    if (!loggedInShopId) return null;
    return shops.find((s) => s.id === loggedInShopId) || null;
  }, [loggedInShopId, shops]);

  const loggedInAgent = useMemo(() => {
    if (!loggedInAgentId) return null;
    return agents.find((a) => a.id === loggedInAgentId) || null;
  }, [loggedInAgentId, agents]);

  // Toggle bookmark / save
  const handleToggleSave = (shopId: string) => {
    setSavedShopIds((prev) =>
      prev.includes(shopId) ? prev.filter((id) => id !== shopId) : [...prev, shopId]
    );
  };

  // Add review to a shop
  const handleAddReview = (shopId: string, reviewData: Omit<Review, 'id' | 'shopId'>) => {
    setShops((prev) =>
      prev.map((s) => {
        if (s.id === shopId) {
          const currentTotal = s.totalReviews || 0;
          const currentRating = s.rating || 5;
          const newTotal = currentTotal + 1;
          const newRating = (currentRating * currentTotal + reviewData.rating) / newTotal;
          const updatedShop: Shop = {
            ...s,
            totalReviews: newTotal,
            rating: Number(newRating.toFixed(1)),
          };
          syncShopToCloud(updatedShop);
          return updatedShop;
        }
        return s;
      })
    );
  };

  // Shopkeeper updates profile / sales / offers
  const handleUpdateShop = (updatedShop: Shop) => {
    setShops((prev) => prev.map((s) => (s.id === updatedShop.id ? updatedShop : s)));
    syncShopToCloud(updatedShop);
  };

  // Shopkeeper newly registered (status is 'pending' approval)
  const handleShopRegistrationSubmit = (newShop: Shop) => {
    setShops((prev) => {
      const exists = prev.some((s) => s.id === newShop.id);
      return exists ? prev.map((s) => (s.id === newShop.id ? newShop : s)) : [newShop, ...prev];
    });

    // Credit Agent if registered with valid Agent Referral Code
    if (newShop.referredByAgentCode && newShop.referredByAgentCode.trim()) {
      const refCode = newShop.referredByAgentCode.trim().toUpperCase();
      setAgents((prevAgents) =>
        prevAgents.map((ag) => {
          if (ag.referralCode.toUpperCase() === refCode) {
            const updatedReferrals = (ag.totalReferrals || 0) + 1;
            const updatedEarnings = calculateAgentEarnings(updatedReferrals);
            return {
              ...ag,
              totalReferrals: updatedReferrals,
              totalEarnings: updatedEarnings.totalEarnings,
            };
          }
          return ag;
        })
      );
    }

    syncShopToCloud(newShop);
  };

  // Shopkeeper logged in
  const handleLoginSuccess = (shop: Shop) => {
    setShops((prev) => {
      const exists = prev.some((s) => s.id === shop.id);
      return exists ? prev.map((s) => (s.id === shop.id ? shop : s)) : [shop, ...prev];
    });

    // Credit Agent if registered with valid Agent Referral Code
    if (shop.referredByAgentCode && shop.referredByAgentCode.trim()) {
      const refCode = shop.referredByAgentCode.trim().toUpperCase();
      setAgents((prevAgents) =>
        prevAgents.map((ag) => {
          if (ag.referralCode.toUpperCase() === refCode) {
            const updatedReferrals = (ag.totalReferrals || 0) + 1;
            const updatedEarnings = calculateAgentEarnings(updatedReferrals);
            return {
              ...ag,
              totalReferrals: updatedReferrals,
              totalEarnings: updatedEarnings.totalEarnings,
            };
          }
          return ag;
        })
      );
    }

    setLoggedInShopId(shop.id);
    setShowAuthModal(false);
    setActiveTab('dashboard');
    syncShopToCloud(shop);
  };

  const handleLogout = () => {
    setLoggedInShopId(null);
    setActiveTab('home');
  };

  // Agent Login / Logout handlers
  const handleAgentLoginSuccess = (agent: Agent) => {
    setAgents((prev) => {
      const exists = prev.some((a) => a.id === agent.id);
      return exists ? prev.map((a) => (a.id === agent.id ? agent : a)) : [agent, ...prev];
    });
    setLoggedInAgentId(agent.id);
    setShowAgentAuthModal(false);
    setActiveTab('agent');
  };

  const handleAgentLogout = () => {
    setLoggedInAgentId(null);
    setActiveTab('home');
  };

  const handleUpdateAgent = (updated: Agent) => {
    setAgents((prev) => prev.map((ag) => (ag.id === updated.id ? updated : ag)));
  };

  // Agent claims earnings
  const handleAgentClaim = (claim: AgentClaimRequest) => {
    setAgentClaims((prev) => [claim, ...prev]);
  };

  // Admin approves / rejects agent payout claim
  const handleProcessAgentClaim = (claimId: string, status: 'paid' | 'rejected', utr?: string) => {
    setAgentClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          return {
            ...c,
            status,
            utrNumber: utr || c.utrNumber,
            processedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    // If paid, add to agent's claimedAmount
    if (status === 'paid') {
      const targetClaim = agentClaims.find((c) => c.id === claimId);
      if (targetClaim) {
        setAgents((prev) =>
          prev.map((ag) => {
            if (ag.id === targetClaim.agentId) {
              return {
                ...ag,
                claimedAmount: (ag.claimedAmount || 0) + targetClaim.amount,
              };
            }
            return ag;
          })
        );
      }
    }
  };

  const handleDeleteAgent = (agentId: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== agentId));
  };

  const handleApproveAgent = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, status: 'active' as const } : a))
    );
  };

  // Admin Actions
  const handleApproveShop = (shopId: string) => {
    setShops((prev) =>
      prev.map((s) => {
        if (s.id === shopId) {
          const updated: Shop = { ...s, approvalStatus: 'approved' };
          syncShopToCloud(updated);
          return updated;
        }
        return s;
      })
    );
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleRejectShop = (shopId: string) => {
    setShops((prev) =>
      prev.map((s) => {
        if (s.id === shopId) {
          const updated: Shop = { ...s, approvalStatus: 'rejected' };
          syncShopToCloud(updated);
          return updated;
        }
        return s;
      })
    );
  };

  const handleDeleteShop = (shopId: string) => {
    setShops((prev) => prev.filter((s) => s.id !== shopId));
    deleteShopFromCloud(shopId);
  };

  const handleApproveWorker = (workerId: string) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id === workerId) {
          const updated: Worker = { ...w, approvalStatus: 'approved' };
          syncWorkerToCloud(updated);
          return updated;
        }
        return w;
      })
    );
  };

  const handleDeleteWorker = (workerId: string) => {
    setWorkers((prev) => prev.filter((w) => w.id !== workerId));
    deleteWorkerFromCloud(workerId);
  };

  const handleUpdateWorker = (updatedWorker: Worker) => {
    setWorkers((prev) => prev.map((w) => (w.id === updatedWorker.id ? updatedWorker : w)));
    syncWorkerToCloud(updatedWorker);
  };

  const handleClaimReferral = (shopId: string, amount: number, upiId: string) => {
    const shop = shops.find((s) => s.id === shopId);
    const newClaim: ClaimRequest = {
      id: `claim-${Date.now()}`,
      shopId: shopId,
      shopName: shop ? shop.marathiName : 'दुकान',
      shopMobile: shop ? shop.mobile : '',
      amount: amount,
      upiId: upiId,
      requestedAt: new Date().toLocaleDateString('mr-IN'),
      status: 'pending',
    };
    setClaimRequests((prev) => [newClaim, ...prev]);
    syncClaimToCloud(newClaim);
  };

  const handleProcessClaim = (claimId: string, status: 'approved' | 'rejected') => {
    setClaimRequests((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const updated: ClaimRequest = { ...c, status: status };
          syncClaimToCloud(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const handleWorkerRegistrationSuccess = (newWorker: Worker) => {
    setWorkers((prev) => [newWorker, ...prev]);
    syncWorkerToCloud(newWorker);
    setShowWorkerRegModal(false);
    setActiveTab('workers');
  };

  // Filtered Shops List (ONLY SHOW APPROVED & ENABLED SHOPS on Home page!)
  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      // Must not be disabled
      if (shop.isDisabled) {
        return false;
      }

      // Must be approved to appear on public home directory
      if (shop.approvalStatus === 'pending' || shop.approvalStatus === 'rejected') {
        return false;
      }

      // District filter
      if (currentDistrict.id !== 'all') {
        const matchesDistrict =
          shop.district.toLowerCase() === currentDistrict.nameMr.toLowerCase() ||
          shop.district.toLowerCase() === currentDistrict.nameEn.toLowerCase() ||
          shop.district.toLowerCase() === currentDistrict.id.toLowerCase();
        if (!matchesDistrict) return false;
      }

      // Village filter
      if (currentVillage !== 'सर्व' && currentVillage.trim() !== '') {
        const villageMatch =
          shop.villageOrCity.toLowerCase().includes(currentVillage.toLowerCase()) ||
          (shop.taluka && shop.taluka.toLowerCase().includes(currentVillage.toLowerCase()));
        if (!villageMatch) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (shop.category !== selectedCategory) return false;
      }

      // Only Offers filter
      if (onlyOffers && (!shop.offers || shop.offers.length === 0)) {
        return false;
      }

      // Only Open Now
      if (onlyOpenNow && shop.isOpenNow === false) {
        return false;
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const inMarathiName = shop.marathiName?.toLowerCase().includes(q);
        const inEnglishName = shop.name?.toLowerCase().includes(q);
        const inOwner = shop.ownerName?.toLowerCase().includes(q);
        const inVillage = shop.villageOrCity?.toLowerCase().includes(q);
        const inDistrict = shop.district?.toLowerCase().includes(q);
        const inAddress = shop.fullAddress?.toLowerCase().includes(q);
        const inCategory =
          shop.categoryLabelMr?.toLowerCase().includes(q) ||
          shop.categoryLabelEn?.toLowerCase().includes(q);
        const inProducts = shop.productsServices?.some((p) => p.toLowerCase().includes(q));

        if (
          !inMarathiName &&
          !inEnglishName &&
          !inOwner &&
          !inVillage &&
          !inDistrict &&
          !inAddress &&
          !inCategory &&
          !inProducts
        ) {
          return false;
        }
      }

      return true;
    });
  }, [shops, currentDistrict, currentVillage, selectedCategory, onlyOffers, onlyOpenNow, searchQuery]);

  const savedShopsList = useMemo(() => {
    return shops.filter((s) => savedShopIds.includes(s.id));
  }, [shops, savedShopIds]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16 md:pb-0 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Android / Play Store banner */}
      <PlayStoreBanner isMarathi={isMarathi} />

      {/* Main Navigation Header */}
      <Header
        currentDistrict={currentDistrict}
        currentVillage={currentVillage}
        onOpenLocationModal={() => setShowLocationModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenAgentAuthModal={() => setShowAgentAuthModal(true)}
        onOpenSavedModal={() => setShowSavedModal(true)}
        savedShopsCount={savedShopIds.length}
        loggedInShop={loggedInShop}
        loggedInAgent={loggedInAgent}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenDashboard={() => setActiveTab('dashboard')}
        onOpenAgentDashboard={() => setActiveTab('agent')}
        onOpenAdminLoginModal={() => setShowAdminLoginModal(true)}
        onOpenAdminDashboard={() => setActiveTab('admin')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMarathi={isMarathi}
        setIsMarathi={setIsMarathi}
      />

      {/* Main App Content View */}
      <main className="flex-1">
        {activeTab === 'admin' && isAdminLoggedIn ? (
          <AdminDashboard
            shops={shops}
            workers={workers}
            claimRequests={claimRequests}
            agents={agents}
            agentClaims={agentClaims}
            districts={DISTRICTS}
            categories={CATEGORIES}
            onApproveShop={handleApproveShop}
            onRejectShop={handleRejectShop}
            onDeleteShop={handleDeleteShop}
            onUpdateShop={handleUpdateShop}
            onApproveWorker={handleApproveWorker}
            onDeleteWorker={handleDeleteWorker}
            onUpdateWorker={handleUpdateWorker}
            onProcessClaim={handleProcessClaim}
            onProcessAgentClaim={handleProcessAgentClaim}
            onApproveAgent={handleApproveAgent}
            onDeleteAgent={handleDeleteAgent}
            onLogout={() => {
              setIsAdminLoggedIn(false);
              setActiveTab('home');
            }}
            isMarathi={isMarathi}
          />
        ) : activeTab === 'agent' && loggedInAgent ? (
          <AgentDashboard
            agent={loggedInAgent}
            allShops={shops}
            onUpdateAgent={handleUpdateAgent}
            onLogout={handleAgentLogout}
            onRequestClaim={handleAgentClaim}
            isMarathi={isMarathi}
          />
        ) : activeTab === 'dashboard' && loggedInShop ? (
          <ShopkeeperDashboard
            shop={loggedInShop}
            onUpdateShop={handleUpdateShop}
            onLogout={handleLogout}
            isMarathi={isMarathi}
            onClaimReferral={handleClaimReferral}
          />
        ) : activeTab === 'workers' ? (
          <WorkersView
            workers={workers}
            districts={DISTRICTS}
            selectedDistrict={currentDistrict.id}
            onSelectDistrict={(id) => {
              const d = DISTRICTS.find((item) => item.id === id) || DISTRICTS[0];
              setCurrentDistrict(d);
            }}
            onOpenWorkerRegistration={() => setShowWorkerRegModal(true)}
            isMarathi={isMarathi}
          />
        ) : activeTab === 'offers' ? (
          <OffersView
            shops={shops.filter((s) => s.approvalStatus === 'approved' && !s.isDisabled)}
            onSelectShop={(shop) => setSelectedShopForModal(shop)}
            isMarathi={isMarathi}
          />
        ) : (
          /* HOME TAB: Hero Search, Category Filters, and Shops Grid */
          <div>
            <HeroSearchBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={CATEGORIES}
              currentDistrict={currentDistrict}
              currentVillage={currentVillage}
              onOpenLocationModal={() => setShowLocationModal(true)}
              onlyOffers={onlyOffers}
              setOnlyOffers={setOnlyOffers}
              onlyOpenNow={onlyOpenNow}
              setOnlyOpenNow={setOnlyOpenNow}
              totalShopsCount={filteredShops.length}
              isMarathi={isMarathi}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
              {/* Active District / Village Indicator & Count */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse" />
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Noto_Sans_Devanagari',sans-serif]">
                    {currentDistrict.id === 'all'
                      ? isMarathi ? 'महाराष्ट्रातील सर्व मंजूर दुकाने' : 'All Approved Maharashtra Shops'
                      : isMarathi
                      ? `${currentDistrict.nameMr} ${currentVillage !== 'सर्व' ? `(${currentVillage})` : ''} मधील दुकाने`
                      : `Shops in ${currentDistrict.nameEn} ${currentVillage !== 'सर्व' ? `(${currentVillage})` : ''}`}
                  </h3>
                  <span className="text-xs bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-md">
                    {filteredShops.length}
                  </span>
                </div>

                <button
                  onClick={() => setShowLocationModal(true)}
                  className="text-xs text-orange-600 hover:text-orange-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isMarathi ? 'गाव बदला' : 'Change Location'}</span>
                </button>
              </div>

              {/* Shops Cards Grid */}
              {filteredShops.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm max-w-xl mx-auto my-8">
                  <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4 border border-orange-100">
                    <Store className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {isMarathi ? 'या निकषांनुसार कोणतेही दुकान सापडले नाही' : 'No shops found for your search'}
                  </h3>
                  <p className="text-xs text-slate-600 mb-5 font-medium">
                    {isMarathi
                      ? 'कृपया गावाचे नाव बदला किंवा कॅटेगरी फिल्टर काढा. किंवा आपल्या दुकानाची नोंदणी करा.'
                      : 'Try resetting filters or registering your shop in this village!'}
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setCurrentDistrict(DISTRICTS[0]);
                        setCurrentVillage('सर्व');
                        setOnlyOffers(false);
                        setOnlyOpenNow(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isMarathi ? 'सर्व दुकाने दाखवा' : 'Reset all filters'}
                    </button>

                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-orange-500/20"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>{isMarathi ? 'येथे दुकान जोडा' : 'Add your shop'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredShops.map((shop) => (
                    <ShopCard
                      key={shop.id}
                      shop={shop}
                      onSelectShop={(selected) => setSelectedShopForModal(selected)}
                      isSaved={savedShopIds.includes(shop.id)}
                      onToggleSave={handleToggleSave}
                      isMarathi={isMarathi}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Call to Action for Local Shopkeepers & Workers */}
            <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-indigo-700 text-white py-10 px-4 sm:px-6 mt-12 relative overflow-hidden">
              <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-bold border border-white/20">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isMarathi ? 'महाराष्ट्र डिजिटल व्यापारी, कामगार व एजंट अभियान' : 'Maharashtra Digital Merchant, Artisan & Agent Mission'}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-['Noto_Sans_Devanagari',sans-serif]">
                  {isMarathi
                    ? 'आपण दुकानदार, कारागीर किंवा एजंट आहात का? आजच जुडा!'
                    : 'Are you a shopkeeper, artisan, or field agent? Join us today!'}
                </h3>

                <p className="text-xs sm:text-sm text-orange-100 max-w-2xl mx-auto font-medium">
                  {isMarathi
                    ? 'दुकानदारांसाठी ₹११ नोंदणी शुल्क (१ आठवडा मोफत). कामगारांसाठी मोफत नोंदणी. एजंट्सना प्रत्येक दुकान जोडणीवर ₹३ + दर ५० दुकानांमागे ₹१०० बोनस!'
                    : 'Register your shop for ₹11 (1 week free), worker service for free, or become a Village Agent and earn ₹3 per shop + ₹100 bonus on 50 shops.'}
                </p>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-5 py-3.5 rounded-2xl bg-white hover:bg-orange-50 text-slate-900 font-extrabold text-xs sm:text-sm shadow-xl transition-all cursor-pointer hover:scale-105 inline-flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4 text-orange-600" />
                    <span>{isMarathi ? 'दुकानदार नोंदणी (१ आठवडा मोफत)' : 'Register Shopkeeper'}</span>
                  </button>

                  <button
                    onClick={() => setShowWorkerRegModal(true)}
                    className="px-5 py-3.5 rounded-2xl bg-indigo-900/80 hover:bg-indigo-900 text-white font-extrabold text-xs sm:text-sm shadow-xl transition-all cursor-pointer hover:scale-105 inline-flex items-center gap-2 border border-indigo-300/30"
                  >
                    <Users className="w-4 h-4 text-indigo-300" />
                    <span>{isMarathi ? 'कामगार नोंदणी (मोफत)' : 'Register Artisan'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (loggedInAgent) {
                        setActiveTab('agent');
                      } else {
                        setShowAgentAuthModal(true);
                      }
                    }}
                    className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl transition-all cursor-pointer hover:scale-105 inline-flex items-center gap-2"
                  >
                    <BadgePercent className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                    <span>{isMarathi ? '🎯 एजंट व्हा (₹ कमवा)' : 'Become an Agent'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 text-xs py-8 px-4 sm:px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-rose-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm font-['Noto_Sans_Devanagari',sans-serif]">
                {isMarathi ? 'आपलं गावातील दुकान' : 'Aapla Gavatil Dukan'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isMarathi ? 'महाराष्ट्रातील सर्व गावांचा व शहरांचा डिजिटल बाजार व कारागीर केंद्र' : 'Maharashtra Local Village & Town Business Platform'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-slate-400">
            <span>🚩 सातारा</span>
            <span>🚩 पुणे</span>
            <span>🚩 कोल्हापूर</span>
            <span>🚩 सांगली</span>
            <span>🚩 सोलापूर</span>
            <span>🚩 नाशिक</span>
            <span>🚩 अहमदनगर</span>
            <span>🚩 संभाजीनगर</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  setActiveTab('admin');
                } else {
                  setShowAdminLoginModal(true);
                }
              }}
              className="text-orange-400 hover:text-orange-300 underline font-bold cursor-pointer"
            >
              {isAdminLoggedIn ? 'अ‍ॅडमिन पॅनेल' : 'अ‍ॅडमिन प्रवेश'}
            </button>
            <span>•</span>
            <button
              onClick={() => {
                if (loggedInAgent) {
                  setActiveTab('agent');
                } else {
                  setShowAgentAuthModal(true);
                }
              }}
              className="text-purple-400 hover:text-purple-300 underline font-bold cursor-pointer"
            >
              {isMarathi ? 'एजंट पोर्टल' : 'Agent Portal'}
            </button>
            <span>•</span>
            <span>© २०२६ आपलं गावातील दुकान</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loggedInShop={loggedInShop}
        loggedInAgent={loggedInAgent}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenAgentAuthModal={() => setShowAgentAuthModal(true)}
        onOpenAdminLoginModal={() => setShowAdminLoginModal(true)}
        isMarathi={isMarathi}
      />

      {/* MODALS */}
      {selectedShopForModal && (
        <ShopDetailModal
          shop={selectedShopForModal}
          onClose={() => setSelectedShopForModal(null)}
          isSaved={savedShopIds.includes(selectedShopForModal.id)}
          onToggleSave={handleToggleSave}
          onAddReview={handleAddReview}
          isMarathi={isMarathi}
        />
      )}

      {showAuthModal && (
        <ShopkeeperAuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSubmit={handleShopRegistrationSubmit}
          allShops={shops}
          categories={CATEGORIES}
          districts={DISTRICTS}
          isMarathi={isMarathi}
        />
      )}

      {showAgentAuthModal && (
        <AgentAuthModal
          onClose={() => setShowAgentAuthModal(false)}
          onLoginSuccess={handleAgentLoginSuccess}
          districts={DISTRICTS}
          allAgents={agents}
          isMarathi={isMarathi}
        />
      )}

      {showWorkerRegModal && (
        <WorkerRegistrationModal
          onClose={() => setShowWorkerRegModal(false)}
          onRegisterSuccess={handleWorkerRegistrationSuccess}
          districts={DISTRICTS}
          isMarathi={isMarathi}
        />
      )}

      {showAdminLoginModal && (
        <AdminLoginModal
          onClose={() => setShowAdminLoginModal(false)}
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            setShowAdminLoginModal(false);
            setActiveTab('admin');
          }}
          isMarathi={isMarathi}
        />
      )}

      {showLocationModal && (
        <VillageSelectorModal
          districts={DISTRICTS}
          currentDistrict={currentDistrict}
          currentVillage={currentVillage}
          onSelectLocation={(dist, vill) => {
            setCurrentDistrict(dist);
            setCurrentVillage(vill);
          }}
          onClose={() => setShowLocationModal(false)}
          isMarathi={isMarathi}
        />
      )}

      {showSavedModal && (
        <SavedShopsModal
          savedShops={savedShopsList}
          onClose={() => setShowSavedModal(false)}
          onSelectShop={(shop) => setSelectedShopForModal(shop)}
          onRemoveSaved={handleToggleSave}
          isMarathi={isMarathi}
        />
      )}
    </div>
  );
}
