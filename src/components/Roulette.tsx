import React, { useRef, useEffect, useState } from "react";
import { Prize } from "../types";
import { 
  Volume2, VolumeX, Smartphone, Headphones, Gamepad2, 
  Ticket, Percent, CreditCard, Watch, RotateCcw, 
  Sparkles, Gift, Compass, ChevronDown, ChevronUp
} from "lucide-react";

interface RouletteProps {
  prizes: Prize[];
  targetPrizeId: number | null;
  isSpinning: boolean;
  onSpinComplete: () => void;
  onSpinStart: () => void;
  disabled: boolean;
  ticketsCount: number;
}

// Map prizes to beautiful styled icons or real product photos with error fallback tracking
function PrizeIcon({ name, category }: { name: string; category: string }) {
  const [hasError, setHasError] = useState(false);
  const lowerName = name.toLowerCase();
  
  // High quality Unsplash URLs for real products
  const images = {
    iphone: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=120",
    ps5: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=120",
    headphones: "https://images.unsplash.com/photo-1588449668338-d15168822481?auto=format&fit=crop&q=80&w=120",
    watch: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=120",
    cash: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=120", // stacks of money
  };

  if (hasError) {
    if (lowerName.includes("iphone") || lowerName.includes("телефон") || lowerName.includes("смартфон")) {
      return (
        <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-sm border border-pink-300 shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
      );
    }
    if (lowerName.includes("playstation") || lowerName.includes("ps5") || lowerName.includes("приставка") || lowerName.includes("джойстик")) {
      return (
        <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm border border-blue-300 shrink-0">
          <Gamepad2 className="w-5 h-5" />
        </div>
      );
    }
    if (lowerName.includes("наушник") || lowerName.includes("airpods") || lowerName.includes("подс")) {
      return (
        <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-sm border border-purple-400 shrink-0">
          <Headphones className="w-5 h-5" />
        </div>
      );
    }
    if (lowerName.includes("часы") || lowerName.includes("watch")) {
      return (
        <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-sm border border-indigo-300 shrink-0">
          <Watch className="w-5 h-5" />
        </div>
      );
    }
    if (lowerName.includes("руб") || lowerName.includes("₽") || lowerName.includes("карт") || lowerName.includes("деньг")) {
      return (
        <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-sm border border-emerald-300 shrink-0">
          <CreditCard className="w-5 h-5" />
        </div>
      );
    }
  }

  if (lowerName.includes("iphone") || lowerName.includes("телефон") || lowerName.includes("смартфон")) {
    return (
      <div className="h-11 w-11 rounded-xl overflow-hidden border border-pink-200 shadow-sm relative group bg-white shrink-0">
        <img 
          src={images.iphone} 
          alt={name} 
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-pink-500/10 mix-blend-multiply" />
      </div>
    );
  }
  if (lowerName.includes("playstation") || lowerName.includes("ps5") || lowerName.includes("приставка") || lowerName.includes("джойстик")) {
    return (
      <div className="h-11 w-11 rounded-xl overflow-hidden border border-blue-200 shadow-sm relative group bg-white shrink-0">
        <img 
          src={images.ps5} 
          alt={name} 
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-blue-500/10 mix-blend-multiply" />
      </div>
    );
  }
  if (lowerName.includes("наушник") || lowerName.includes("airpods") || lowerName.includes("подс")) {
    return (
      <div className="h-11 w-11 rounded-xl overflow-hidden border border-purple-200 shadow-sm relative group bg-white shrink-0">
        <img 
          src={images.headphones} 
          alt={name} 
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-purple-500/10 mix-blend-multiply" />
      </div>
    );
  }
  if (lowerName.includes("часы") || lowerName.includes("watch")) {
    return (
      <div className="h-11 w-11 rounded-xl overflow-hidden border border-indigo-200 shadow-sm relative group bg-white shrink-0">
        <img 
          src={images.watch} 
          alt={name} 
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-indigo-500/10 mix-blend-multiply" />
      </div>
    );
  }
  if (lowerName.includes("руб") || lowerName.includes("₽") || lowerName.includes("карт") || lowerName.includes("деньг")) {
    return (
      <div className="h-11 w-11 rounded-xl overflow-hidden border border-emerald-200 shadow-sm relative group bg-white shrink-0">
        <img 
          src={images.cash} 
          alt={name} 
          onError={() => setHasError(true)}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-emerald-500/10 mix-blend-multiply" />
      </div>
    );
  }
  if (lowerName.includes("билет")) {
    return (
      <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-sm border border-amber-300 shrink-0">
        <Ticket className="w-5 h-5 animate-pulse" />
      </div>
    );
  }
  if (lowerName.includes("скидк") || lowerName.includes("промокод") || lowerName.includes("%")) {
    return (
      <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-sm border border-orange-300 shrink-0">
        <Percent className="w-5 h-5" />
      </div>
    );
  }
  if (lowerName.includes("еще") || lowerName.includes("попробуй")) {
    return (
      <div className="h-11 w-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm shrink-0">
        <RotateCcw className="w-5 h-5" />
      </div>
    );
  }

  // Default category-based fallbacks with real premium graphics feel
  if (category === "legendary") {
    return (
      <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-yellow-500 to-amber-400 flex items-center justify-center text-white shadow-sm border border-yellow-300 shrink-0">
        <Sparkles className="w-5 h-5 animate-spin-slow" />
      </div>
    );
  }
  if (category === "epic") {
    return (
      <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-sm border border-purple-400 shrink-0">
        <Gift className="w-5 h-5" />
      </div>
    );
  }
  return (
    <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-[#005BFF] to-blue-400 flex items-center justify-center text-white shadow-sm border border-blue-300 shrink-0">
      <Compass className="w-5 h-5" />
    </div>
  );
}

export default function Roulette({
  prizes,
  targetPrizeId,
  isSpinning,
  onSpinComplete,
  onSpinStart,
  disabled,
  ticketsCount
}: RouletteProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const animationRef = useRef<number | null>(null);
  
  const isSpinningRef = useRef(false);
  const [reelItems, setReelItems] = useState<Prize[]>([]);
  
  // Total height of one slot card including tailwind gap (72px height + 8px gap)
  const ITEM_HEIGHT = 80;
  // Starting alignment position for index 0 to be perfectly centered in a 280px viewport
  const STARTING_Y = 96;

  // Audio Context for mechanical clicking sounds
  const playTickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sine";
      // Satisfying heavy mechanical slot click
      oscillator.frequency.setValueAtTime(450, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.08);
      
      gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.08);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.09);
    } catch (e) {
      // AudioContext could be blocked, fail silently
    }
  };

  // Populate stable reel items strip on initialization
  useEffect(() => {
    if (prizes.length === 0) return;
    const tempItems: Prize[] = [];
    // We generate a long strip of 60 items
    for (let i = 0; i < 60; i++) {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      tempItems.push(randomPrize);
    }
    setReelItems(tempItems);
    
    // Set initial position
    if (listRef.current) {
      listRef.current.style.transform = `translateY(${STARTING_Y}px)`;
    }
  }, [prizes]);

  // Listen to spin trigger
  useEffect(() => {
    if (isSpinning && targetPrizeId !== null && !isSpinningRef.current) {
      const index = prizes.findIndex((p) => p.id === targetPrizeId);
      if (index !== -1) {
        startSpinAnimation(index);
      }
    }
  }, [isSpinning, targetPrizeId]);

  const startSpinAnimation = (prizesPoolIndex: number) => {
    isSpinningRef.current = true;
    
    // Target stopping index in our 60-item strip
    const targetReelIndex = 45;
    
    // Get the exact winning prize
    const winningPrize = prizes[prizesPoolIndex];
    if (!winningPrize) return;

    // Inject winning prize exactly at index 45 of our strip
    const updatedReel = [...reelItems];
    updatedReel[targetReelIndex] = winningPrize;
    setReelItems(updatedReel);

    // Initial Y is STARTING_Y (96px, item 0 centered)
    const startY = STARTING_Y;
    // Destination Y is 96 - (targetReelIndex * ITEM_HEIGHT)
    const destinationY = STARTING_Y - (targetReelIndex * ITEM_HEIGHT);

    const startTime = performance.now();
    const duration = 6000; // 6 seconds elegant deceleration

    const lastTickedIndexRef = { current: 0 };

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Spring overshoot deceleration easing function
      const easeOutBack = (t: number) => {
        const c1 = 1.1; // soft bounce pull back
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      };

      const currentProgressY = startY + (destinationY - startY) * easeOutBack(progress);

      // Hardware-accelerated dynamic scrolling
      if (listRef.current) {
        listRef.current.style.transform = `translateY(${currentProgressY}px)`;
      }

      // Calculate which item is currently crossing the center line to play satisfying clicks
      const currentItemInCenter = Math.round((STARTING_Y - currentProgressY) / ITEM_HEIGHT);
      if (currentItemInCenter >= 0 && currentItemInCenter < 60 && currentItemInCenter !== lastTickedIndexRef.current) {
        playTickSound();
        lastTickedIndexRef.current = currentItemInCenter;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        isSpinningRef.current = false;
        animationRef.current = null;
        onSpinComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Cleanup animations on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      
      {/* Sound toggle & status indicator */}
      <div className="w-full flex justify-between items-center px-4 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSpinning ? "bg-pink-400" : "bg-[#005BFF]"}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSpinning ? "bg-pink-500" : "bg-[#005BFF]"}`}></span>
          </span>
          <span className="text-xs text-slate-500 font-mono font-bold uppercase tracking-wider">
            {isSpinning ? "Идет выбор приза..." : "Фортуна заряжена"}
          </span>
        </div>
        
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shadow-sm"
          title={soundEnabled ? "Выключить звук" : "Включить звук"}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* Vertical Reel Window */}
      <div className="relative w-full max-w-[340px] h-[280px] bg-slate-50 border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-inner flex flex-col items-center justify-center">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-grid-slate-100 opacity-30 pointer-events-none" />
        
        {/* Shadow Overlay (Fade top and bottom items) */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent z-10 pointer-events-none" />

        {/* The Rolling Strip Container */}
        <div 
          ref={listRef} 
          className="absolute top-0 left-0 right-0 flex flex-col gap-2 p-2"
          style={{ transform: `translateY(${STARTING_Y}px)`, transition: "none" }}
        >
          {reelItems.map((item, idx) => (
            <div 
              key={idx}
              style={{ height: "72px" }}
              className={`w-full flex items-center gap-3.5 px-4 rounded-[1.5rem] shrink-0 border transition-all duration-300 ${
                item.category === "legendary"
                  ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-300 shadow-sm shadow-amber-500/5"
                  : item.category === "epic"
                  ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-300"
                  : item.category === "rare"
                  ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-200"
                  : "bg-white border-slate-200"
              }`}
            >
              {/* Product icon */}
              <PrizeIcon name={item.name} category={item.category} />

              {/* Product label info */}
              <div className="flex-1 min-w-0">
                <div className={`font-black text-[9px] uppercase tracking-widest leading-none mb-1 ${
                  item.category === "legendary" 
                    ? "text-amber-600" 
                    : item.category === "epic" 
                    ? "text-purple-600" 
                    : item.category === "rare" 
                    ? "text-blue-600" 
                    : "text-slate-400"
                }`}>
                  {item.category === "legendary" ? "🔥 ЛЕГЕНДАРНЫЙ" : item.category === "epic" ? "✨ ЭПИЧЕСКИЙ" : item.category === "rare" ? "💎 РЕДКИЙ" : "ОБЫЧНЫЙ"}
                </div>
                <div className="font-extrabold text-xs text-slate-800 truncate leading-snug">{item.name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Center Target Pointer Frame & side pins */}
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-6 bg-[#F91155] rounded-full shadow-sm z-10 animate-pulse flex items-center justify-center">
          <div className="h-1.5 w-1.5 bg-white rounded-full" />
        </div>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-2 h-6 bg-[#F91155] rounded-full shadow-sm z-10 animate-pulse flex items-center justify-center">
          <div className="h-1.5 w-1.5 bg-white rounded-full" />
        </div>
        
        {/* Horizontal highlight active slot frame */}
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-[76px] rounded-2xl border-2 border-[#F91155] bg-pink-500/5 shadow-lg shadow-pink-100 pointer-events-none z-0" />
      </div>

      {/* Action CTA Button */}
      <div className="mt-6 w-full max-w-[280px]">
        <button
          onClick={onSpinStart}
          disabled={disabled || isSpinning || ticketsCount < 1}
          className={`w-full py-4 px-6 rounded-2xl font-black text-sm transition-all transform duration-150 relative overflow-hidden flex flex-col items-center justify-center ${
            isSpinning
              ? "bg-slate-200 text-slate-400 cursor-not-allowed scale-95 border border-slate-300"
              : ticketsCount < 1
              ? "bg-slate-150 border border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-[#F91155] text-white hover:scale-[1.03] active:scale-95 cursor-pointer shadow-xl shadow-pink-200"
          }`}
        >
          {isSpinning ? (
            <span>ЛЕНТА КРУТИТСЯ...</span>
          ) : (
            <>
              <div className="flex items-center gap-1.5 uppercase tracking-wider">
                <span>ИСПЫТАТЬ УДАЧУ</span>
              </div>
              <span className="text-[10px] opacity-80 mt-0.5 font-bold">
                {ticketsCount >= 1 ? `Списать 1 билет (У вас: ${ticketsCount})` : "Нет билетов! Купите ниже 👇"}
              </span>
            </>
          )}

          {/* Golden shine wave effect */}
          {!isSpinning && ticketsCount >= 1 && (
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40 animate-shine" />
          )}
        </button>
      </div>
      
    </div>
  );
}
