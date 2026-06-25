import React, { useEffect, useState } from "react";
import { 
  Ticket, User as UserIcon, Share2, Shield, Award, Gift, 
  Sparkles, Copy, Check, ChevronRight, RefreshCw, 
  TrendingUp, DollarSign, Package, Compass, Plus, 
  Clock, MapPin, Phone, UserPlus, Sliders, Play, Trash2,
  Smartphone, Gamepad2, Headphones, Watch, CreditCard
} from "lucide-react";
import { User, Transaction, Prize, Winner, Raffle, AdminStats } from "./types";
import Roulette from "./components/Roulette";

// Showcase data for super prizes showroom with real Unsplash images
const SHOWROOM_PRIZES = [
  {
    name: "iPhone 16 Pro Max",
    category: "Легендарный",
    image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=400",
    description: "Флагман со сверхмощной камерой и процессором A18 Pro.",
    chance: "1%",
    tag: "СУПЕРПРИЗ"
  },
  {
    name: "Sony PlayStation 5 Slim",
    category: "Легендарный",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=400",
    description: "Игровая консоль нового поколения для лучших приключений.",
    chance: "1%",
    tag: "ГОРЯЧИЙ ХИТ"
  },
  {
    name: "Apple AirPods Max",
    category: "Эпический",
    image: "https://images.unsplash.com/photo-1588449668338-d15168822481?auto=format&fit=crop&q=80&w=400",
    description: "Чистейший звук и непревзойденное активное шумоподавление.",
    chance: "8%",
    tag: "ТРЕНД"
  },
  {
    name: "Apple Watch Series 9",
    category: "Эпический",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=400",
    description: "Умный помощник для спорта, здоровья и продуктивности.",
    chance: "8%",
    tag: "СТИЛЬ"
  },
  {
    name: "Денежные призы до 10,000₽",
    category: "Редкий",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=400",
    description: "Прямые зачисления рублей на вашу банковскую карту.",
    chance: "5%",
    tag: "МОМЕНТАЛЬНО"
  }
];

// Beautiful image wrapper with elegant placeholder fallback if image load fails
function ShowroomImage({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false);
  const lowerName = alt.toLowerCase();

  if (hasError) {
    if (lowerName.includes("iphone") || lowerName.includes("телефон") || lowerName.includes("смартфон")) {
      return (
        <div className="w-full h-full bg-gradient-to-tr from-pink-600 via-[#F91155] to-rose-400 flex flex-col items-center justify-center text-white relative">
          <Smartphone size={32} className="opacity-90 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-75">iPhone 16</span>
        </div>
      );
    }
    if (lowerName.includes("playstation") || lowerName.includes("ps5") || lowerName.includes("приставка") || lowerName.includes("джойстик")) {
      return (
        <div className="w-full h-full bg-gradient-to-tr from-blue-700 via-indigo-800 to-indigo-500 flex flex-col items-center justify-center text-white relative">
          <Gamepad2 size={32} className="opacity-90 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-75">PS5 Slim</span>
        </div>
      );
    }
    if (lowerName.includes("наушник") || lowerName.includes("airpods") || lowerName.includes("подс")) {
      return (
        <div className="w-full h-full bg-gradient-to-tr from-purple-700 via-purple-800 to-pink-500 flex flex-col items-center justify-center text-white relative">
          <Headphones size={32} className="opacity-90 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-75">AirPods</span>
        </div>
      );
    }
    if (lowerName.includes("часы") || lowerName.includes("watch")) {
      return (
        <div className="w-full h-full bg-gradient-to-tr from-indigo-700 via-blue-800 to-cyan-500 flex flex-col items-center justify-center text-white relative">
          <Watch size={32} className="opacity-90 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-75">Apple Watch</span>
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-gradient-to-tr from-emerald-600 via-teal-700 to-green-500 flex flex-col items-center justify-center text-white relative">
        <CreditCard size={32} className="opacity-90 animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-75">Кешбэк ₽</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
  );
}

// Helper to render beautiful thumbnail images for active prize odds lists
function PrizeThumbnail({ name, category }: { name: string; category: string }) {
  const [hasError, setHasError] = useState(false);
  const lowerName = name.toLowerCase();
  
  const images = {
    iphone: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=120",
    ps5: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=120",
    headphones: "https://images.unsplash.com/photo-1588449668338-d15168822481?auto=format&fit=crop&q=80&w=120",
    watch: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=120",
    cash: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=120",
  };

  if (hasError) {
    if (lowerName.includes("iphone") || lowerName.includes("телефон") || lowerName.includes("смартфон")) {
      return (
        <div className="h-7 w-7 rounded-lg bg-pink-100 flex items-center justify-center text-[#F91155] border border-pink-200 shrink-0">
          <Smartphone size={14} />
        </div>
      );
    }
    if (lowerName.includes("playstation") || lowerName.includes("ps5") || lowerName.includes("приставка") || lowerName.includes("джойстик")) {
      return (
        <div className="h-7 w-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 shrink-0">
          <Gamepad2 size={14} />
        </div>
      );
    }
    if (lowerName.includes("наушник") || lowerName.includes("airpods") || lowerName.includes("подс")) {
      return (
        <div className="h-7 w-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 border border-purple-200 shrink-0">
          <Headphones size={14} />
        </div>
      );
    }
    if (lowerName.includes("часы") || lowerName.includes("watch")) {
      return (
        <div className="h-7 w-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200 shrink-0">
          <Watch size={14} />
        </div>
      );
    }
    if (lowerName.includes("руб") || lowerName.includes("₽") || lowerName.includes("карт") || lowerName.includes("деньг")) {
      return (
        <div className="h-7 w-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200 shrink-0">
          <CreditCard size={14} />
        </div>
      );
    }
  }

  if (lowerName.includes("iphone") || lowerName.includes("телефон") || lowerName.includes("смартфон")) {
    return (
      <div className="h-7 w-7 rounded-lg overflow-hidden border border-pink-200 shrink-0 bg-white relative">
        <img src={images.iphone} alt={name} onError={() => setHasError(true)} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-pink-500/10 mix-blend-multiply" />
      </div>
    );
  }
  if (lowerName.includes("playstation") || lowerName.includes("ps5") || lowerName.includes("приставка") || lowerName.includes("джойстик")) {
    return (
      <div className="h-7 w-7 rounded-lg overflow-hidden border border-blue-200 shrink-0 bg-white relative">
        <img src={images.ps5} alt={name} onError={() => setHasError(true)} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-blue-500/10 mix-blend-multiply" />
      </div>
    );
  }
  if (lowerName.includes("наушник") || lowerName.includes("airpods") || lowerName.includes("подс")) {
    return (
      <div className="h-7 w-7 rounded-lg overflow-hidden border border-purple-200 shrink-0 bg-white relative">
        <img src={images.headphones} alt={name} onError={() => setHasError(true)} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-purple-500/10 mix-blend-multiply" />
      </div>
    );
  }
  if (lowerName.includes("часы") || lowerName.includes("watch")) {
    return (
      <div className="h-7 w-7 rounded-lg overflow-hidden border border-indigo-200 shrink-0 bg-white relative">
        <img src={images.watch} alt={name} onError={() => setHasError(true)} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-indigo-500/10 mix-blend-multiply" />
      </div>
    );
  }
  if (lowerName.includes("руб") || lowerName.includes("₽") || lowerName.includes("карт") || lowerName.includes("деньг")) {
    return (
      <div className="h-7 w-7 rounded-lg overflow-hidden border border-emerald-200 shrink-0 bg-white relative">
        <img src={images.cash} alt={name} onError={() => setHasError(true)} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-emerald-500/10 mix-blend-multiply" />
      </div>
    );
  }
  if (lowerName.includes("билет")) {
    return (
      <div className="h-7 w-7 rounded-lg bg-amber-500 text-white shrink-0 flex items-center justify-center text-[10px] shadow-sm border border-amber-400 font-bold">
        🎟️
      </div>
    );
  }
  if (lowerName.includes("скидк") || lowerName.includes("промокод") || lowerName.includes("%")) {
    return (
      <div className="h-7 w-7 rounded-lg bg-orange-500 text-white shrink-0 flex items-center justify-center text-[10px] shadow-sm border border-orange-400 font-bold">
        %
      </div>
    );
  }
  
  return (
    <div className="h-7 w-7 rounded-lg bg-slate-100 text-slate-500 shrink-0 flex items-center justify-center text-[10px] border border-slate-200">
      🎁
    </div>
  );
}

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<"game" | "buy" | "raffles" | "profile" | "referral" | "admin">("game");
  const [showAdminTab, setShowAdminTab] = useState<boolean>(true); // admin visibility control
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Telegram state & simulator state
  const [tgUser, setTgUser] = useState<{ id: number; username: string; first_name: string } | null>(null);
  const [simTelegramId, setSimTelegramId] = useState<string>("1234567");
  const [simUsername, setSimUsername] = useState<string>("lucky_pioneer");
  const [simFirstName, setSimFirstName] = useState<string>("Александр");
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Spin States
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetPrizeId, setTargetPrizeId] = useState<number | null>(null);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [prizeWinnerId, setPrizeWinnerId] = useState<string | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);

  // Custom Delivery Form state
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isClaimSubmitting, setIsClaimSubmitting] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");

  // Referral register trigger
  const [referralInputCode, setReferralInputCode] = useState("");
  const [referralStatusMessage, setReferralStatusMessage] = useState("");

  // Admin dynamic states
  const [adminPrizes, setAdminPrizes] = useState<Prize[]>([]);
  const [adminStatusMessage, setAdminStatusMessage] = useState("");
  const [activeRaffleIdToSpend, setActiveRaffleIdToSpend] = useState<string | null>(null);
  const [spendTicketCount, setSpendTicketCount] = useState<number>(1);

  // General Toast notifications
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Notification trigger
  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Initialize User & Telegram WebApp
  useEffect(() => {
    // Attempt to load from window.Telegram
    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const userObj = tg.initDataUnsafe.user;
      setTgUser({
        id: userObj.id,
        username: userObj.username || `tg_${userObj.id}`,
        first_name: userObj.first_name || "Пользователь"
      });
      // Expand WebApp window for native feel
      tg.expand();
      // Set main button or theme colors if desired
    } else {
      // Set default simulator variables
      setTgUser({
        id: 1234567,
        username: "lucky_pioneer",
        first_name: "Александр"
      });
    }
  }, []);

  // Sync user from backend on tgUser change
  useEffect(() => {
    if (tgUser) {
      fetchUserData(tgUser.id, tgUser.username, tgUser.first_name);
    }
  }, [tgUser]);

  // Handle activeTab redirection if admin tab is hidden
  useEffect(() => {
    if (!showAdminTab && activeTab === "admin") {
      setActiveTab("game");
    }
  }, [showAdminTab, activeTab]);

  // Fetch all secondary resources (winners, raffles)
  useEffect(() => {
    fetchWinners();
    fetchRaffles();
  }, [activeTab]);

  const fetchUserData = async (id: number, username: string, name: string, refCode?: string) => {
    try {
      setLoading(true);
      let url = `/api/user?telegram_id=${id}&username=${username}&first_name=${encodeURIComponent(name)}`;
      if (refCode) {
        url += `&referred_by_code=${refCode}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        setTransactions(data.transactions || []);
      } else {
        showToast("Ошибка при синхронизации пользователя", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Не удалось подключиться к серверу", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchWinners = async () => {
    try {
      const response = await fetch("/api/winners");
      const data = await response.json();
      if (Array.isArray(data)) {
        setWinners(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRaffles = async () => {
    try {
      const response = await fetch("/api/raffles");
      const data = await response.json();
      if (Array.isArray(data)) {
        setRaffles(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      if (data) {
        setAdminStats(data);
        setAdminPrizes(data.prizes || []);
      }
    } catch (err) {
      console.error(err);
      showToast("Ошибка получения админ-статистики", "error");
    }
  };

  // Trigger admin fetch if active tab is admin
  useEffect(() => {
    if (activeTab === "admin") {
      fetchAdminStats();
    }
  }, [activeTab]);

  // Apply simulator profile
  const handleApplySimulator = () => {
    const idNum = parseInt(simTelegramId, 10);
    if (isNaN(idNum)) {
      showToast("Некорректный Telegram ID", "error");
      return;
    }
    setTgUser({
      id: idNum,
      username: simUsername.trim() || "guest",
      first_name: simFirstName.trim() || "Гость"
    });
    setIsSimulatorOpen(false);
    showToast(`Профиль изменен: @${simUsername}`, "info");
  };

  // Buy Ticket Simulator
  const handleBuyTickets = async (tickets: number, price: number) => {
    if (!user) return;
    try {
      const response = await fetch("/api/buy-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegram_id: user.telegram_id,
          tickets,
          price
        })
      });
      const data = await response.json();
      if (data.success) {
        // Refresh local user info
        setUser({ ...user, balance_tickets: data.new_balance });
        // Fetch fresh transactions list
        fetchUserData(user.telegram_id, user.username, user.first_name);
        showToast(data.message, "success");
      } else {
        showToast(data.error || "Ошибка оплаты", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Ошибка запроса на пополнение", "error");
    }
  };

  // Spin Trigger
  const handleSpinStart = async () => {
    if (!user || isSpinning) return;
    if (user.balance_tickets < 1) {
      showToast("У вас нет билетов! Приобретите билеты в магазине.", "error");
      return;
    }

    try {
      setIsSpinning(true);
      setWonPrize(null);
      setPrizeWinnerId(null);

      // Call spin backend API
      const response = await fetch("/api/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegram_id: user.telegram_id })
      });
      const data = await response.json();

      if (data.success) {
        // Set target prize ID so the Roulette component knows where to stop
        setTargetPrizeId(data.prize.id);
        setWonPrize(data.prize);
        setPrizeWinnerId(data.winner_id);
        
        // Deduct 1 ticket locally immediately for responsive interface
        setUser({ ...user, balance_tickets: data.new_balance });
      } else {
        setIsSpinning(false);
        showToast(data.error || "Не удалось совершить вращение", "error");
      }
    } catch (err) {
      setIsSpinning(false);
      showToast("Ошибка связи с сервером", "error");
    }
  };

  // Spin complete callback
  const handleSpinComplete = () => {
    setIsSpinning(false);
    setTargetPrizeId(null);
    setShowWinModal(true);
    
    // Refresh user balance and history from DB
    if (user) {
      fetchUserData(user.telegram_id, user.username, user.first_name);
    }
  };

  // Claim Form Submit
  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prizeWinnerId) return;

    if (!deliveryName.trim() || !deliveryPhone.trim() || !deliveryAddress.trim()) {
      showToast("Пожалуйста, заполните все поля формы доставки!", "error");
      return;
    }

    try {
      setIsClaimSubmitting(true);
      const response = await fetch("/api/claim-prize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          winner_id: prizeWinnerId,
          full_name: deliveryName,
          phone: deliveryPhone,
          address: deliveryAddress
        })
      });
      const data = await response.json();
      if (data.success) {
        setClaimMessage(data.message);
        showToast("Заявка успешно отправлена!", "success");
        fetchWinners(); // refresh
      } else {
        showToast(data.error || "Ошибка сохранения", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Не удалось отправить заявку", "error");
    } finally {
      setIsClaimSubmitting(false);
    }
  };

  // Close Win Modal & reset claims
  const handleCloseWinModal = () => {
    setShowWinModal(false);
    setWonPrize(null);
    setPrizeWinnerId(null);
    setDeliveryName("");
    setDeliveryPhone("");
    setDeliveryAddress("");
    setClaimMessage("");
  };

  // Submit manual referral code
  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !referralInputCode.trim()) return;

    if (referralInputCode.toUpperCase() === user.referral_code) {
      setReferralStatusMessage("Вы не можете использовать собственный код!");
      return;
    }

    fetchUserData(user.telegram_id, user.username, user.first_name, referralInputCode.trim());
    setReferralInputCode("");
    setReferralStatusMessage("Код успешно отправлен на проверку бэкенду!");
  };

  // Enter raffle spending tickets
  const handleEnterRaffle = async (raffleId: string, cost: number) => {
    if (!user) return;
    if (user.balance_tickets < cost) {
      showToast("У вас недостаточно билетов для входа", "error");
      return;
    }

    try {
      const response = await fetch("/api/raffles/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegram_id: user.telegram_id,
          raffle_id: raffleId,
          tickets_to_spend: cost
        })
      });
      const data = await response.json();
      if (data.success) {
        setUser({ ...user, balance_tickets: data.new_balance });
        fetchUserData(user.telegram_id, user.username, user.first_name);
        fetchRaffles();
        showToast(data.message, "success");
        setActiveRaffleIdToSpend(null);
      } else {
        showToast(data.error || "Ошибка записи на розыгрыш", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Сбой соединения при записи на розыгрыш", "error");
    }
  };

  // ================= ADMIN PANEL ACTIONS =================

  // Admin Toggle Winner Status
  const handleAdminToggleStatus = async (winnerId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "pending" ? "sent" : "pending";
    try {
      const response = await fetch("/api/admin/winners/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winner_id: winnerId, status: nextStatus })
      });
      const data = await response.json();
      if (data.success) {
        showToast(`Статус заявки изменен на ${nextStatus === 'sent' ? 'Отправлено' : 'В ожидании'}`, "success");
        fetchAdminStats();
      }
    } catch (err) {
      console.error(err);
      showToast("Ошибка обновления статуса", "error");
    }
  };

  // Admin Draw Raffle
  const handleAdminDrawRaffle = async (raffleId: string) => {
    try {
      const response = await fetch("/api/admin/raffles/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raffle_id: raffleId })
      });
      const data = await response.json();
      if (data.success) {
        showToast(data.message, "success");
        fetchAdminStats();
        fetchRaffles();
      } else {
        showToast(data.error || "Ошибка проведения розыгрыша", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Ошибка связи при розыгрыше", "error");
    }
  };

  // Admin reset DB
  const handleAdminResetDB = async () => {
    if (!window.confirm("Вы уверены, что хотите полностью сбросить базу данных? Все пользователи, балансы и выигрыши будут удалены!")) {
      return;
    }
    try {
      const response = await fetch("/api/admin/reset", { method: "POST" });
      const data = await response.json();
      if (data.success) {
        showToast("База данных успешно сброшена!", "success");
        setActiveTab("game");
        if (tgUser) {
          fetchUserData(tgUser.id, tgUser.username, tgUser.first_name);
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Не удалось сбросить базу данных", "error");
    }
  };

  // Admin dynamic probability adjust handler
  const handleAdminProbabilityChange = (index: number, val: number) => {
    const updated = [...adminPrizes];
    updated[index] = { ...updated[index], probability: parseFloat(val.toFixed(3)) };
    setAdminPrizes(updated);
  };

  // Save Admin Prize Changes
  const handleSaveAdminPrizes = async () => {
    // Check if sum of probabilities is valid
    const total = adminPrizes.reduce((sum, p) => sum + p.probability, 0);
    
    // Normalize weights automatically to sum to 1.0 before saving to make sure the math matches
    const normalized = adminPrizes.map(p => ({
      ...p,
      probability: parseFloat((p.probability / (total || 1)).toFixed(3))
    }));

    try {
      const response = await fetch("/api/admin/prizes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prizes: normalized })
      });
      const data = await response.json();
      if (data.success) {
        setAdminPrizes(normalized);
        showToast("Параметры колеса успешно сохранены и сбалансированы!", "success");
        fetchAdminStats();
      }
    } catch (err) {
      console.error(err);
      showToast("Ошибка при сохранении колеса", "error");
    }
  };

  // Direct mock invite click copy helper
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Ссылка скопирована в буфер!", "success");
  };

  const getRefLink = () => {
    if (!user) return "";
    const base = window.location.origin;
    return `${base}?startapp=${user.referral_code}`;
  };

  // Load default list of wheel prizes from local state to view chances in game tab
  const activePrizes = adminStats?.prizes || adminPrizes.length > 0 ? adminPrizes : [
    { id: 1, name: "+2 билета", category: "common", probability: 0.25, color: "#1E3A8A", textColor: "#FFFFFF", is_super_prize: false },
    { id: 2, name: "Скидка 15%", category: "common", probability: 0.20, color: "#EC4899", textColor: "#FFFFFF", is_super_prize: false },
    { id: 3, name: "Попробуй еще!", category: "common", probability: 0.25, color: "#F59E0B", textColor: "#1E293B", is_super_prize: false },
    { id: 4, name: "1000₽ на карту", category: "rare", probability: 0.05, color: "#10B981", textColor: "#FFFFFF", is_super_prize: true },
    { id: 5, name: "+5 билетов", category: "rare", probability: 0.15, color: "#3B82F6", textColor: "#FFFFFF", is_super_prize: false },
    { id: 6, name: "Скидка 30%", category: "epic", probability: 0.08, color: "#8B5CF6", textColor: "#FFFFFF", is_super_prize: false },
    { id: 7, name: "iPhone 16", category: "legendary", probability: 0.01, color: "#EF4444", textColor: "#FFFFFF", is_super_prize: true },
    { id: 8, name: "PlayStation 5", category: "legendary", probability: 0.01, color: "#D97706", textColor: "#FFFFFF", is_super_prize: true },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-900 font-sans selection:bg-[#F91155]/20 flex flex-col items-center pb-24">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm max-w-sm w-11/12 animate-fade-in ${
          toast.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : toast.type === "error"
            ? "bg-rose-50 border-rose-200 text-rose-800"
            : "bg-blue-50 border-blue-200 text-blue-800"
        }`}>
          <div className="h-2 w-2 rounded-full animate-ping bg-current" />
          <span className="flex-1 font-semibold">{toast.text}</span>
        </div>
      )}

      {/* Simulator Widget (Perfect for Sandbox Environment Verification) */}
      <div className="w-full bg-white border-b border-slate-200 text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-2 shadow-sm text-slate-800">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="inline-block h-2 w-2 rounded-full bg-[#005BFF] animate-pulse" />
          <span className="font-mono text-[11px] font-semibold text-slate-700">
            {user ? `Активен: @${user.username} (ID: ${user.telegram_id})` : "Загрузка пользователя..."}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
            className="px-2 py-1 rounded bg-slate-100 text-[#005BFF] hover:bg-[#005BFF]/10 font-bold transition-all cursor-pointer"
          >
            {isSimulatorOpen ? "Закрыть отладку 🛠️" : "Переключить профиль 🛠️"}
          </button>
        </div>
      </div>

      {/* Simulator Form Expansion */}
      {isSimulatorOpen && (
        <div className="w-full max-w-3xl bg-white border-b border-slate-200 p-5 shadow-inner animate-slide-down text-slate-800">
          <h3 className="text-sm font-bold text-[#005BFF] mb-3 flex items-center gap-1.5">
            <span>Панель симулятора аккаунтов Telegram</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Поскольку вы просматриваете приложение в iframe без окружения Telegram Mini App, воспользуйтесь этой панелью для симуляции разных пользователей и проверки работы рефералов, билетов и админки.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-bold uppercase">Simulated Telegram ID</label>
              <input
                type="text"
                value={simTelegramId}
                onChange={(e) => setSimTelegramId(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 rounded-xl text-xs border border-slate-200 text-slate-800 focus:outline-none focus:border-[#005BFF]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-bold uppercase">Simulated Username</label>
              <input
                type="text"
                value={simUsername}
                onChange={(e) => setSimUsername(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 rounded-xl text-xs border border-slate-200 text-slate-800 focus:outline-none focus:border-[#005BFF]"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1 font-bold uppercase">Simulated Name</label>
              <input
                type="text"
                value={simFirstName}
                onChange={(e) => setSimFirstName(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 rounded-xl text-xs border border-slate-200 text-slate-800 focus:outline-none focus:border-[#005BFF]"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <input
              type="checkbox"
              id="toggle-admin-tab"
              checked={showAdminTab}
              onChange={(e) => {
                setShowAdminTab(e.target.checked);
                showToast(e.target.checked ? "Панель администратора включена" : "Панель администратора скрыта", "info");
              }}
              className="w-4 h-4 text-[#F91155] border-slate-300 rounded focus:ring-[#F91155] cursor-pointer"
            />
            <label htmlFor="toggle-admin-tab" className="text-xs text-slate-700 font-bold cursor-pointer select-none">
              Показывать вкладку "Админ" в нижнем меню
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setSimTelegramId(Math.floor(100000 + Math.random() * 9000000).toString());
                setSimUsername("user_" + Math.floor(Math.random() * 9999));
                setSimFirstName("Игрок " + Math.floor(Math.random() * 100));
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              Случайный гость
            </button>
            <button
              onClick={handleApplySimulator}
              className="px-4 py-1.5 rounded-[#F91155] bg-[#F91155] text-white hover:bg-pink-600 font-bold text-xs transition-all shadow-md shadow-pink-200 cursor-pointer"
            >
              Войти как этот пользователь
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-5xl w-full px-4 sm:px-6 flex-1 flex flex-col py-6 relative">
        
        {/* App Branding Header in Ozon Style */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#005BFF] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
              <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin-slow"></div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#005BFF]">
                FORTUNA <span className="text-slate-400 font-light">| OZON STYLE</span>
              </h1>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Розыгрыши и Колесо Удачи</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {user && (
              <div 
                onClick={() => setActiveTab("buy")}
                className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 cursor-pointer hover:border-[#005BFF] transition-all"
              >
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Ваш Баланс</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-amber-900">₮</span>
                  </div>
                  <span className="text-lg font-black text-slate-900 font-mono">{user.balance_tickets}</span>
                  <span className="text-xs font-medium text-slate-500">билетов</span>
                </div>
              </div>
            )}
            {user && (
              <div 
                onClick={() => setActiveTab("profile")}
                className="w-12 h-12 bg-white rounded-full border-2 border-[#F91155] p-0.5 overflow-hidden shadow-sm cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-[#F91155] font-black text-sm uppercase">
                  {user.username.slice(0, 2)}
                </div>
              </div>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <RefreshCw className="text-[#F91155] animate-spin mb-4" size={32} />
            <p className="text-sm text-slate-400 font-mono">Соединение с Fortuna Server...</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            
            {/* 1. GAME VIEW */}
            {activeTab === "game" && user && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in text-slate-800">
                
                {/* Main Game: The Wheel (col-span-1 md:col-span-2 md:row-span-2) */}
                <div className="md:col-span-2 md:row-span-2 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden flex flex-col items-center justify-center p-6 sm:p-8">
                  <div className="absolute top-6 left-6 sm:left-8 bg-blue-50 text-[#005BFF] px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    Супер-приз: iPhone 16 Pro
                  </div>
                  
                  {/* Wheel container */}
                  <div className="w-full mt-8">
                    <Roulette
                      prizes={activePrizes}
                      targetPrizeId={targetPrizeId}
                      isSpinning={isSpinning}
                      onSpinStart={handleSpinStart}
                      onSpinComplete={handleSpinComplete}
                      disabled={isSpinning || user.balance_tickets < 1}
                      ticketsCount={user.balance_tickets}
                    />
                  </div>
                  
                  <p className="mt-4 text-slate-400 text-xs sm:text-sm font-medium">Стоимость: 1 билет</p>
                </div>

                {/* Referral Program (col-span-1) */}
                <div className="md:col-span-1 bg-[#005BFF] rounded-[2rem] sm:rounded-[2.5rem] p-6 text-white flex flex-col justify-between shadow-sm min-h-[220px]">
                  <div>
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 text-xl">
                      🚀
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold leading-tight mb-2">Приведи друга — получи +1 билет</h3>
                    <p className="text-blue-100 text-xs sm:text-sm mb-4">Ваш друг получит 5 билетов на старт!</p>
                    <p className="text-blue-100 text-xs font-mono bg-white/10 p-2 rounded-lg inline-block">Код: <span className="font-bold text-white">{user.referral_code}</span></p>
                  </div>
                  <button 
                    onClick={() => handleCopyText(getRefLink())}
                    className="w-full bg-white text-[#005BFF] py-3 rounded-xl font-bold text-sm mt-4 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    КОПИРОВАТЬ ССЫЛКУ
                  </button>
                </div>

                {/* Winners Feed (col-span-1 md:row-span-2) */}
                <div className="md:col-span-1 md:row-span-2 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 p-6 flex flex-col shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Недавние выигрыши</h3>
                  <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-1">
                    {winners.length === 0 ? (
                      <div className="text-xs text-slate-400 text-center py-6 font-medium">Пока нет победителей. Будьте первыми!</div>
                    ) : (
                      winners.slice(0, 5).map((win, i) => {
                        const colors = ["bg-blue-50 text-blue-500", "bg-pink-50 text-pink-500", "bg-amber-50 text-amber-600", "bg-purple-50 text-purple-500", "bg-slate-50 text-slate-500"];
                        const colorClass = colors[i % colors.length];
                        return (
                          <div key={win.id || i} className="flex items-center gap-3 border-b border-slate-50 pb-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${colorClass}`}>
                              {win.username ? win.username.slice(0, 2).toUpperCase() : "IG"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-800 truncate">{win.prize_name}</div>
                              <div className="text-[9px] text-slate-400 uppercase font-medium">{new Date(win.created_at).toLocaleTimeString()}</div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="mt-6 text-center">
                    <button 
                      onClick={() => setActiveTab("profile")}
                      className="text-[#005BFF] text-xs font-bold border-b border-blue-200 pb-0.5 hover:border-[#005BFF] transition-all cursor-pointer"
                    >
                      ВСЕ ПОБЕДИТЕЛИ
                    </button>
                  </div>
                </div>

                {/* Special Offer / Daily Bonus (col-span-1) */}
                <div className="md:col-span-1 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 p-6 flex flex-col justify-center items-center gap-2 overflow-hidden relative shadow-sm text-center">
                  <div className="absolute -right-4 -top-4 w-12 h-12 bg-[#F91155]/10 rotate-45"></div>
                  <span className="text-3xl">🎁</span>
                  <h4 className="font-bold text-sm text-slate-800">Ежедневный бонус</h4>
                  <span className="text-xs text-slate-400 leading-relaxed px-2">Заходите каждый день и получайте 1 билет бесплатно</span>
                  <button 
                    onClick={() => handleBuyTickets(1, 0)} // Daily bonus simulation (1 ticket for 0 rub)
                    className="mt-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    ЗАБРАТЬ
                  </button>
                </div>

                {/* Ticket Shop Row (col-span-1 md:col-span-3) */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 p-5 flex flex-col justify-between shadow-sm min-h-[140px]">
                    <div>
                      <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Старт</div>
                      <div className="text-xl font-black text-slate-800">1 билет</div>
                    </div>
                    <button 
                      onClick={() => handleBuyTickets(1, 50)}
                      className="bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 w-full py-2.5 rounded-xl font-bold text-xs text-[#005BFF] transition-all mt-4 cursor-pointer"
                    >
                      50 ₽
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border-2 border-[#005BFF] p-5 flex flex-col justify-between relative shadow-sm min-h-[140px]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#005BFF] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">Популярно</div>
                    <div>
                      <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Выгода</div>
                      <div className="text-xl font-black text-slate-800">5 билетов</div>
                    </div>
                    <button 
                      onClick={() => handleBuyTickets(5, 200)}
                      className="bg-[#005BFF] hover:bg-blue-600 w-full py-2.5 rounded-xl font-bold text-xs text-white transition-all mt-4 cursor-pointer"
                    >
                      200 ₽
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-[#F91155] to-[#FF4E8D] rounded-[1.5rem] sm:rounded-[2rem] p-5 flex flex-col justify-between text-white shadow-sm min-h-[140px]">
                    <div>
                      <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Максимум</div>
                      <div className="text-xl font-black">15 билетов</div>
                    </div>
                    <button 
                      onClick={() => handleBuyTickets(15, 500)}
                      className="bg-white hover:bg-slate-50 w-full py-2.5 rounded-xl font-bold text-xs text-[#F91155] transition-all mt-4 cursor-pointer"
                    >
                      500 ₽
                    </button>
                  </div>
                </div>

                {/* Settings/Profile Mini / Stats (col-span-1) */}
                <div className="md:col-span-1 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 p-6 flex flex-col justify-center items-center shadow-sm text-center">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                    <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Статистика</span>
                  <span className="text-3xl font-black text-slate-800">85%</span>
                  <span className="text-xs text-slate-500 font-medium">Удача сегодня</span>
                </div>

                {/* 🌟 SHOWROOM OF ACTIVE SUPERPRIZES */}
                <div className="md:col-span-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-3xl pointer-events-none rounded-full" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-[#F91155] uppercase bg-pink-500/10 px-3 py-1 rounded-full">Витрина призов</span>
                      <h3 className="text-lg sm:text-xl font-black mt-2">Реальные призы, которые вы можете выиграть</h3>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">Доставка по всей РФ бесплатно 📦</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {SHOWROOM_PRIZES.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:scale-[1.02] transition-all flex flex-col h-full group"
                      >
                        <div className="relative h-28 w-full overflow-hidden shrink-0">
                          <ShowroomImage src={item.image} alt={item.name} />
                          <div className="absolute top-2 left-2 bg-[#F91155] text-white font-black text-[8px] px-2 py-0.5 rounded uppercase tracking-wider">
                            {item.tag}
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-slate-300 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
                            Шанс: {item.chance}
                          </div>
                        </div>
                        <div className="p-3.5 flex flex-col flex-1">
                          <span className={`text-[8px] font-black uppercase tracking-wider ${
                            item.category === "Легендарный" ? "text-amber-400" : item.category === "Эпический" ? "text-purple-400" : "text-blue-400"
                          }`}>
                            {item.category}
                          </span>
                          <h4 className="font-bold text-xs text-slate-100 mt-1 line-clamp-1 group-hover:text-white transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed flex-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prized Categories Odds (col-span-1 md:col-span-4) */}
                <div className="md:col-span-4 bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-4 flex items-center justify-between">
                    <span>Шансы и категории призов в колесе фортуны</span>
                    <span className="text-[10px] text-slate-400">Всего: 100%</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {activePrizes.map((p) => (
                      <div 
                        key={p.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100/50 transition-colors"
                      >
                        <PrizeThumbnail name={p.name} category={p.category} />
                        <div className="truncate flex-1">
                          <div className="font-extrabold text-slate-800 text-[11px] truncate leading-tight">{p.name}</div>
                          <div className={`text-[9px] uppercase font-bold tracking-wider mt-0.5 ${
                            p.category === "legendary" 
                              ? "text-amber-500" 
                              : p.category === "epic" 
                              ? "text-purple-500"
                              : p.category === "rare"
                              ? "text-blue-500"
                              : "text-slate-400"
                          }`}>
                            {p.category === "legendary" ? "Легенда" : p.category === "epic" ? "Эпик" : p.category === "rare" ? "Редкий" : "Обычный"}
                          </div>
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 font-black bg-white px-2 py-1 rounded-lg border border-slate-200/60 shadow-sm shrink-0">
                          {Math.round(p.probability * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 2. BUY TICKETS VIEW */}
            {activeTab === "buy" && user && (
              <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
                
                <div className="rounded-[2rem] p-6 bg-white border border-slate-200 text-center shadow-sm max-w-3xl mx-auto w-full">
                  <Ticket className="text-[#F91155] mx-auto mb-2 animate-pulse" size={32} />
                  <h2 className="text-lg font-black text-[#005BFF]">Пополнить баланс билетов</h2>
                  <p className="text-xs text-slate-500 mt-2 max-w-lg mx-auto">
                    Билеты списываются за крутки колеса или покупку билетов в глобальных розыгрышах ценных гаджетов!
                  </p>
                </div>

                {/* Tariff Card List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto w-full">
                  {[
                    { count: 1, price: 50, originalPrice: 50, discount: 0, label: "Старт" },
                    { count: 5, price: 200, originalPrice: 250, discount: 20, label: "Популярный" },
                    { count: 15, price: 500, originalPrice: 750, discount: 33, label: "Выгодный" },
                    { count: 50, price: 1500, originalPrice: 2500, discount: 40, label: "Мега-пакет" },
                  ].map((pkg) => (
                    <div 
                      key={pkg.count}
                      className="rounded-[2rem] bg-white border border-slate-200 p-5 hover:border-[#005BFF]/40 transition-all flex items-center justify-between relative overflow-hidden shadow-sm"
                    >
                      {pkg.discount > 0 && (
                        <div className="absolute top-0 right-0 bg-[#F91155] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-lg">
                          Скидка {pkg.discount}%
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-white relative border border-slate-100">
                          <Ticket className="text-[#F91155]" size={22} />
                          <span className="absolute bottom-1 right-1 bg-[#005BFF] text-white text-[9px] font-black font-mono leading-none h-4 px-1 rounded flex items-center justify-center">
                            {pkg.count}
                          </span>
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-slate-800">
                            {pkg.count} {pkg.count === 1 ? "Билет" : pkg.count < 5 ? "Билета" : "Билетов"}
                          </div>
                          <div className="text-xs text-slate-400">{pkg.label}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-black text-slate-800 font-mono">{pkg.price} ₽</div>
                          {pkg.originalPrice > pkg.price && (
                            <div className="text-[10px] text-slate-400 line-through font-mono">{pkg.originalPrice} ₽</div>
                          )}
                        </div>
                        <button
                          onClick={() => handleBuyTickets(pkg.count, pkg.price)}
                          className="px-4 py-2 rounded-xl bg-[#005BFF] hover:bg-blue-600 active:scale-95 text-xs text-white font-extrabold transition-all shadow-md shadow-blue-100 cursor-pointer"
                        >
                          КУПИТЬ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Information Box */}
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 text-xs text-slate-500 flex gap-3 max-w-3xl mx-auto w-full shadow-sm">
                  <div className="h-2 w-2 rounded-full bg-[#005BFF] shrink-0 mt-1.5" />
                  <p>
                    <strong>Безопасная транзакция:</strong> Оплата полностью симулируется. На бэкенде моментально создается логируемая транзакция пополнения, а билеты сразу зачисляются на ваш баланс.
                  </p>
                </div>

              </div>
            )}

            {/* 3. RAFFLES VIEW */}
            {activeTab === "raffles" && user && (
              <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
                
                <div className="rounded-[2rem] p-6 bg-white border border-slate-200 text-center shadow-sm max-w-3xl mx-auto w-full">
                  <Award className="text-amber-500 mx-auto mb-2 animate-pulse" size={32} />
                  <h2 className="text-lg font-black text-[#005BFF]">Розыгрыши Суперпризов</h2>
                  <p className="text-xs text-slate-500 mt-2 max-w-lg mx-auto">
                    Обменивайте накопленные билеты на шансы в масштабных розыгрышах. Чем больше билетов вложили, тем выше вероятность выигрыша!
                  </p>
                </div>

                {/* Raffle Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
                  {raffles.map((raffle) => {
                    // count total entries
                    const totalEntries = raffle.participants.reduce((sum, p) => sum + p.entries, 0);
                    const userEntry = raffle.participants.find(p => p.telegram_id === user.telegram_id);
                    const userChance = totalEntries > 0 && userEntry ? Math.round((userEntry.entries / totalEntries) * 100) : 0;

                    return (
                      <div 
                        key={raffle.id}
                        className={`rounded-[2rem] bg-white border p-5 transition-all overflow-hidden shadow-sm flex flex-col justify-between ${
                          raffle.is_drawn ? "border-slate-100 opacity-75" : "border-slate-200 hover:border-[#005BFF]/30"
                        }`}
                      >
                        <div>
                          <div className="flex gap-4">
                            <img 
                              src={raffle.image_url} 
                              alt={raffle.prize_name}
                              className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-100"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1">
                                {raffle.is_drawn ? (
                                  <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                                    Завершен
                                  </span>
                                ) : (
                                  <span className="bg-blue-50 text-[#005BFF] text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-blue-100">
                                    Активен
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400 font-mono font-bold">
                                  Код: {raffle.id}
                                </span>
                              </div>
                              <h3 className="font-extrabold text-sm text-slate-800 truncate">{raffle.title}</h3>
                              <p className="text-xs text-[#F91155] font-bold">
                                Приз: {raffle.prize_name}
                              </p>
                            </div>
                          </div>

                          {/* Raffle entries statistics */}
                          <div className="mt-4 pt-4 border-t border-slate-100 text-xs flex flex-col gap-2">
                            <div className="flex justify-between text-slate-500">
                              <span>Всего билетов в пуле:</span>
                              <span className="font-mono font-bold text-slate-800">{totalEntries} шт</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                              <span>Ваше участие:</span>
                              <span className="font-mono font-bold text-[#005BFF]">
                                {userEntry ? `${userEntry.entries} билетов (${userChance}%)` : "Не участвуете"}
                              </span>
                            </div>

                            {/* Progress slider visually displaying weight */}
                            {!raffle.is_drawn && totalEntries > 0 && (
                              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#F91155] to-[#005BFF] rounded-full"
                                  style={{ width: `${Math.min(100, Math.max(5, userChance || (totalEntries > 0 ? 10 : 0)))}%` }}
                                />
                              </div>
                            )}

                            {raffle.is_drawn && raffle.winner_username && (
                              <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Award size={14} className="text-amber-500 shrink-0" />
                                  <span className="text-[11px] text-amber-800 font-medium">Победитель:</span>
                                </div>
                                <span className="font-mono font-extrabold text-amber-600 text-xs">@{raffle.winner_username}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Call to action */}
                        {!raffle.is_drawn && (
                          <div className="mt-4 pt-3 border-t border-slate-50">
                            {activeRaffleIdToSpend === raffle.id ? (
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-2 animate-fade-in">
                                <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Сколько вложить?</div>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="number"
                                    min={1}
                                    max={user.balance_tickets}
                                    value={spendTicketCount}
                                    onChange={(e) => setSpendTicketCount(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-20 px-3 py-1.5 bg-white rounded-lg text-xs border border-slate-200 text-slate-850 font-mono focus:outline-none focus:border-[#005BFF]"
                                  />
                                  <div className="text-[11px] text-slate-400 font-medium flex-1 pl-1">
                                    Цена: {raffle.ticket_cost} бил.
                                  </div>
                                  <button
                                    onClick={() => handleEnterRaffle(raffle.id, spendTicketCount * raffle.ticket_cost)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs cursor-pointer transition-colors"
                                  >
                                    Купить шансы
                                  </button>
                                </div>
                                <button 
                                  onClick={() => setActiveRaffleIdToSpend(null)}
                                  className="text-center text-[10px] text-slate-400 hover:text-slate-600 mt-1 uppercase font-bold"
                                >
                                  Отмена
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setActiveRaffleIdToSpend(raffle.id);
                                  setSpendTicketCount(1);
                                }}
                                className="w-full py-2.5 px-4 rounded-xl bg-[#005BFF] hover:bg-blue-600 font-extrabold text-xs text-white flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md shadow-blue-100"
                              >
                                <Plus size={14} />
                                КУПИТЬ УЧАСТИЕ ЗА {raffle.ticket_cost} БИЛЕТ
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* 4. MY PRIZES & HISTORY VIEW */}
            {activeTab === "profile" && user && (
              <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
                
                {/* Profile brief info */}
                <div className="rounded-[2rem] p-6 bg-white border border-slate-200 flex items-center gap-4 max-w-3xl mx-auto w-full shadow-sm">
                  <div className="h-14 w-14 rounded-full bg-pink-50 border-2 border-[#F91155] flex items-center justify-center text-[#F91155] font-black text-xl uppercase">
                    {user.username.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-slate-800 text-base">@{user.username}</h3>
                    <p className="text-xs text-slate-400 font-mono font-bold">TG ID: {user.telegram_id}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Регистрация: {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Physical Prize Wins claim list */}
                <div className="rounded-[2rem] bg-white border border-slate-200 p-6 max-w-3xl mx-auto w-full shadow-sm">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-black mb-4 flex items-center gap-1.5">
                    <Gift size={15} className="text-[#F91155]" />
                    <span>Выигранные призы ({winners.filter(w => w.telegram_id === user.telegram_id).length})</span>
                  </h3>
                  
                  {winners.filter(w => w.telegram_id === user.telegram_id).length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center font-medium">
                      Вы пока не выигрывали физические призы. Вращайте колесо!
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {winners
                        .filter(w => w.telegram_id === user.telegram_id)
                        .map((win) => (
                          <div 
                            key={win.id}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-extrabold text-sm text-slate-800">{win.prize_name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">Дата: {new Date(win.created_at).toLocaleDateString()}</div>
                            </div>
                            <div>
                              {win.status === "sent" ? (
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2.5 py-1 rounded-full font-black border border-emerald-100">
                                  ОТПРАВЛЕНО
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setWonPrize({ id: 0, name: win.prize_name, category: win.category as any, probability: 0, color: "", textColor: "", is_super_prize: true });
                                    setPrizeWinnerId(win.id);
                                    setShowWinModal(true);
                                  }}
                                  className="px-4 py-1.5 bg-[#F91155] hover:bg-pink-600 text-xs text-white font-extrabold rounded-xl transition-colors cursor-pointer shadow-sm shadow-pink-100"
                                >
                                  ДОСТАВКА
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Transaction history logs */}
                <div className="rounded-[2rem] bg-white border border-slate-200 p-6 max-w-3xl mx-auto w-full shadow-sm">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-black mb-4 flex items-center gap-1.5">
                    <Clock size={15} className="text-[#005BFF]" />
                    <span>История баланса (последние 15)</span>
                  </h3>
                  
                  {transactions.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center font-medium">История транзакций пуста.</p>
                  ) : (
                    <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {transactions.map((tx) => (
                        <div 
                          key={tx.id}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-800 text-[11px]">{tx.description}</div>
                            <div className="text-[9px] text-slate-400 mt-0.5">{new Date(tx.created_at).toLocaleTimeString()}</div>
                          </div>
                          <span className={`font-mono font-black text-xs ${
                            tx.amount > 0 ? "text-emerald-600" : "text-rose-600"
                          }`}>
                            {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 5. REFERRAL CODE VIEW */}
            {activeTab === "referral" && user && (
              <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
                
                <div className="rounded-[2rem] p-6 bg-white border border-slate-200 text-center shadow-sm max-w-3xl mx-auto w-full">
                  <Share2 className="text-[#005BFF] mx-auto mb-2 animate-bounce" size={32} />
                  <h2 className="text-lg font-black text-[#005BFF]">Реферальная Программа</h2>
                  <p className="text-xs text-slate-500 mt-2 max-w-lg mx-auto leading-relaxed">
                    Приглашайте друзей в колесо удачи! Каждый зарегистрированный друг по вашей ссылке получит <strong>5 подарочных билетов</strong>, а вы — <strong>+1 билет</strong> на свой баланс!
                  </p>
                </div>

                {/* Referral Link & code block */}
                <div className="rounded-[2rem] bg-white border border-slate-200 p-6 flex flex-col gap-4 max-w-3xl mx-auto w-full shadow-sm">
                  
                  {/* Promo code display */}
                  <div className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Ваш реферальный код</div>
                    <div className="text-xl font-black tracking-widest text-[#005BFF] font-mono mt-1">{user.referral_code}</div>
                  </div>

                  {/* Copy Link wrapper */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Пригласительная ссылка</label>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="text-xs font-mono text-slate-500 truncate flex-1 select-all pr-2 pl-2">
                        {getRefLink()}
                      </div>
                      <button
                        onClick={() => handleCopyText(getRefLink())}
                        className="p-2 rounded-xl bg-[#005BFF] hover:bg-blue-600 text-white shrink-0 cursor-pointer shadow-md shadow-blue-100 transition-all"
                        title="Скопировать ссылку"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Dynamic simulator help banner for sandbox validation */}
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-800 leading-relaxed">
                    💡 <strong>Как протестировать рефералов в браузере:</strong> Скопируйте ваш реферальный код. Затем вверху кликните «Переключить профиль», сгенерируйте новые случайные данные пользователя, вставьте реферальный код в форму ниже и пройдите аутентификацию. Вы увидите, как предыдущему пользователю начислился бонус приглашения!
                  </div>
                </div>

                {/* Form to claim someone's referral code manually */}
                <div className="rounded-[2rem] bg-white border border-slate-200 p-6 max-w-3xl mx-auto w-full shadow-sm">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-black mb-4 flex items-center gap-1.5">
                    <UserPlus size={15} className="text-[#F91155]" />
                    <span>Активировать промокод приглашения</span>
                  </h3>
                  
                  {user.referred_by ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex justify-between items-center font-semibold">
                      <span>Вы зарегистрировались по приглашению!</span>
                      <Check size={16} />
                    </div>
                  ) : (
                    <form onSubmit={handleReferralSubmit} className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Код, например: ABC123"
                        value={referralInputCode}
                        onChange={(e) => setReferralInputCode(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 rounded-2xl text-xs border border-slate-200 text-slate-800 font-mono uppercase tracking-widest flex-1 focus:outline-none focus:border-[#005BFF] focus:bg-white"
                      />
                      <button 
                        type="submit"
                        className="px-5 py-2.5 rounded-2xl bg-[#005BFF] hover:bg-blue-600 text-xs font-bold text-white transition-all cursor-pointer shadow-md shadow-blue-100"
                      >
                        Применить
                      </button>
                    </form>
                  )}
                  {referralStatusMessage && (
                    <p className="text-xs text-amber-600 mt-2 font-semibold font-mono">{referralStatusMessage}</p>
                  )}
                </div>

              </div>
            )}

            {/* 6. ADMIN VIEW */}
            {activeTab === "admin" && (
              <div className="flex flex-col gap-6 animate-fade-in text-slate-800">
                
                <div className="rounded-[2rem] p-6 bg-white border border-slate-200 text-center shadow-sm max-w-3xl mx-auto w-full">
                  <Shield className="text-[#005BFF] mx-auto mb-2" size={32} />
                  <h2 className="text-lg font-black text-[#005BFF]">Админ-Панель Управления</h2>
                  <p className="text-xs text-slate-500 mt-2 max-w-lg mx-auto leading-relaxed">
                    Управление колесом фортуны, мгновенный запуск розыгрышей и модерация заявок на доставку призов.
                  </p>
                </div>

                {/* Statistics Cards */}
                {adminStats && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto w-full">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                      <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-1">Пользователи</div>
                      <div className="text-xl font-black text-slate-800 font-mono">{adminStats.totalUsers}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                      <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-1">Всего вращений</div>
                      <div className="text-xl font-black text-[#005BFF] font-mono">{adminStats.totalSpins}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                      <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-1">Продажи (симуляция)</div>
                      <div className="text-xl font-black text-emerald-600 font-mono">{adminStats.totalSalesRub} ₽</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                      <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-1">Куплено билетов</div>
                      <div className="text-xl font-black text-[#F91155] font-mono">+{adminStats.totalTicketsBought}</div>
                    </div>
                  </div>
                )}

                {/* Dynamic Slice Chance Configurator */}
                <div className="rounded-[2rem] bg-white border border-slate-200 p-6 max-w-3xl mx-auto w-full shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <h3 className="text-xs uppercase tracking-wider text-slate-400 font-black flex items-center gap-1">
                      <Sliders size={14} className="text-[#F91155]" />
                      <span>Настройка шансов колеса</span>
                    </h3>
                    <button 
                      onClick={handleSaveAdminPrizes}
                      className="text-xs bg-[#F91155] hover:bg-pink-600 text-white font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-sm"
                    >
                      Сохранить и Нормализовать
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {adminPrizes.map((p, index) => {
                      // calc sum
                      const sum = adminPrizes.reduce((s, pr) => s + pr.probability, 0);
                      const currentPercent = sum > 0 ? Math.round((p.probability / sum) * 100) : 0;
                      
                      return (
                        <div key={p.id} className="text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <div className="flex justify-between font-bold text-slate-800 mb-1.5">
                            <span>{p.name} <span className="text-[9px] text-slate-400 uppercase">({p.category})</span></span>
                            <span className="font-mono text-[#005BFF]">{currentPercent}%</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input 
                              type="range"
                              min={0.001}
                              max={1.0}
                              step={0.005}
                              value={p.probability}
                              onChange={(e) => handleAdminProbabilityChange(index, parseFloat(e.target.value))}
                              className="flex-1 accent-[#F91155]"
                            />
                            <span className="text-[10px] font-mono text-slate-400 w-10 text-right font-bold">{p.probability}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Drawings triggering panel */}
                <div className="rounded-[2rem] bg-white border border-slate-200 p-6 max-w-3xl mx-auto w-full shadow-sm">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-black mb-4 flex items-center gap-1">
                    <Award size={14} className="text-amber-500" />
                    <span>Мгновенный запуск розыгрышей</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {raffles.map((raffle) => (
                      <div key={raffle.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs flex flex-col justify-between min-h-[140px]">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-extrabold text-slate-800 text-sm truncate max-w-[140px]">{raffle.title}</div>
                              <div className="text-[11px] text-[#F91155] font-bold mt-0.5">Суперприз: {raffle.prize_name}</div>
                            </div>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                              raffle.is_drawn ? "bg-slate-200 text-slate-500" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            }`}>
                              {raffle.is_drawn ? "Завершен" : "Активен"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between text-slate-400 pt-2 border-t border-slate-100">
                          <span className="font-medium">Участников: {raffle.participants.length}</span>
                          {!raffle.is_drawn ? (
                            <button
                              onClick={() => handleAdminDrawRaffle(raffle.id)}
                              disabled={raffle.participants.length === 0}
                              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:bg-slate-100 disabled:text-slate-400 font-bold text-slate-900 text-xs transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                            >
                              <Play size={12} />
                              Запуск!
                            </button>
                          ) : (
                            <span className="font-mono text-amber-600 font-bold">
                              Победил: @{raffle.winner_username}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* delivery shipping form log */}
                <div className="rounded-[2rem] bg-white border border-slate-200 p-6 max-w-3xl mx-auto w-full shadow-sm">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-black mb-4 flex items-center gap-1">
                    <Package size={14} className="text-emerald-500" />
                    <span>Заявки на отправку призов</span>
                  </h3>
                  {adminStats && adminStats.winners.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center font-medium">Заявок на доставку нет.</p>
                  ) : (
                    <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                      {adminStats?.winners.map((win) => (
                        <div key={win.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                          <div className="flex justify-between font-bold text-slate-800">
                            <span className="text-amber-600 font-black">{win.prize_name}</span>
                            <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black ${
                              win.status === "sent" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                            }`}>
                              {win.status === "sent" ? "ОТПРАВЛЕНО" : "ОЖИДАЕТ"}
                            </span>
                          </div>
                          
                          <div className="mt-2 text-[11px] text-slate-500 flex flex-col gap-1">
                            <div><strong>Игрок:</strong> @{win.username} (ID: {win.telegram_id})</div>
                            {win.full_name ? (
                              <>
                                <div><strong>ФИО:</strong> {win.full_name}</div>
                                <div><strong>Телефон:</strong> {win.phone}</div>
                                <div><strong>Адрес:</strong> {win.address}</div>
                              </>
                            ) : (
                              <div className="text-rose-500 italic font-semibold">Игрок еще не предоставил адрес доставки!</div>
                            )}
                          </div>

                          <div className="mt-3 flex justify-end gap-2">
                            <button
                              onClick={() => handleAdminToggleStatus(win.id, win.status)}
                              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-[#005BFF] shadow-sm cursor-pointer"
                            >
                              Изменить статус
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* dangerous panel */}
                <div className="rounded-[2rem] bg-rose-50 border border-rose-100 p-6 max-w-3xl mx-auto w-full shadow-sm">
                  <h3 className="text-xs font-bold text-rose-600 mb-1 flex items-center gap-1 uppercase tracking-wider">
                    <Trash2 size={14} />
                    <span>Опасная Зона</span>
                  </h3>
                  <p className="text-xs text-rose-700/80 mb-4 leading-relaxed">Очищает все записи базы данных, историю транзакций и сбрасывает настройки призов.</p>
                  <button 
                    onClick={handleAdminResetDB}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 font-bold text-xs text-white rounded-2xl transition-all shadow-md shadow-rose-200 cursor-pointer uppercase tracking-wider"
                  >
                    ПОЛНЫЙ СБРОС СЕРВЕРА
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* Navigation Footer Menu (Highly polished, sticky, Ozon look) */}
      <footer className="w-full max-w-md fixed bottom-4 bg-white/95 backdrop-blur-md border border-slate-200/85 rounded-3xl py-2.5 px-2 flex justify-around items-center z-20 shadow-xl">
        {[
          { id: "game", label: "Фортуна", icon: Sparkles },
          { id: "buy", label: "Магазин", icon: Ticket },
          { id: "raffles", label: "Розыгрыши", icon: Award },
          { id: "profile", label: "Призы", icon: Gift },
          { id: "referral", label: "Пригласить", icon: Share2 },
          ...(showAdminTab ? [{ id: "admin", label: "Админ", icon: Shield }] : []),
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                // auto scroll to top
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-2xl transition-all duration-150 cursor-pointer ${
                isActive 
                  ? "text-[#F91155] scale-105 font-extrabold" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={18} className={isActive ? "stroke-[2.5px]" : "stroke-[2px]"} />
              <span className="text-[9px] uppercase tracking-wider font-bold">{tab.label}</span>
            </button>
          );
        })}
      </footer>

      {/* Celebration Winning claim modal */}
      {showWinModal && wonPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] w-full max-w-sm p-6 relative overflow-hidden shadow-2xl text-slate-800">
            
            {/* Background elements */}
            <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-pink-500/10 blur-2xl" />
            <div className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-blue-500/10 blur-2xl" />

            <div className="text-center">
              <div className="text-4xl mb-2 animate-bounce">🎉</div>
              <h2 className="text-xl font-black text-slate-900">ВЫ ВЫИГРАЛИ!</h2>
              <div className="my-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 relative">
                <div className="text-xs text-[#F91155] uppercase font-black tracking-widest">ВАШ ПРИЗ:</div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {wonPrize.name}
                </div>
                <div className={`text-[10px] uppercase font-bold mt-1.5 inline-block px-2.5 py-0.5 rounded-full ${
                  wonPrize.category === "legendary" 
                    ? "bg-amber-100 text-amber-800" 
                    : wonPrize.category === "epic" 
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}>
                  Категория: {wonPrize.category}
                </div>
              </div>

              {/* Delivery claim conditional rendering */}
              {wonPrize.is_super_prize ? (
                <div className="mt-4 text-left">
                  <h3 className="text-xs font-bold uppercase text-slate-700 mb-2 flex items-center gap-1">
                    <MapPin size={14} className="text-[#F91155]" />
                    <span>Форма доставки приза</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                    Поздравляем с выигрышем суперприза! Пожалуйста, укажите ваши данные для доставки. Информация будет моментально передана администрации.
                  </p>

                  {claimMessage ? (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-center font-medium">
                      {claimMessage}
                    </div>
                  ) : (
                    <form onSubmit={handleClaimSubmit} className="flex flex-col gap-2.5">
                      <div>
                        <input 
                          type="text"
                          required
                          placeholder="ФИО получателя"
                          value={deliveryName}
                          onChange={(e) => setDeliveryName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 text-slate-800 focus:outline-none focus:border-[#005BFF]"
                        />
                      </div>
                      <div>
                        <input 
                          type="tel"
                          required
                          placeholder="Номер телефона"
                          value={deliveryPhone}
                          onChange={(e) => setDeliveryPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 text-slate-800 focus:outline-none focus:border-[#005BFF]"
                        />
                      </div>
                      <div>
                        <textarea 
                          required
                          placeholder="Полный адрес доставки (Индекс, Город, Улица, Дом, Квартира)"
                          rows={2}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 text-slate-800 focus:outline-none focus:border-[#005BFF] resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isClaimSubmitting}
                        className="w-full py-2.5 rounded-xl bg-[#F91155] hover:bg-pink-600 font-extrabold text-xs text-white cursor-pointer shadow-lg shadow-pink-100 transition-all"
                      >
                        {isClaimSubmitting ? "Отправка..." : "ОТПРАВИТЬ ЗАЯВКУ"}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {wonPrize.name.includes("билет") 
                    ? "Указанные бонусные билеты уже зачислены на ваш баланс. Продолжайте крутить!" 
                    : "Промокод зафиксирован в вашем аккаунте. Скоро он появится в списке бонусов!"}
                </p>
              )}

              <button
                onClick={handleCloseWinModal}
                className="mt-5 text-xs text-slate-400 hover:text-slate-600 font-bold uppercase cursor-pointer"
              >
                Закрыть
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
