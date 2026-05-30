"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Currency symbols for finance theme
const CURRENCY_SYMBOLS = ["$", "€", "£", "¥", "₹", "₿", "₩", "₽", "฿", "₫"];

interface FloatingCurrency {
  id: number;
  symbol: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotateDirection: 1 | -1;
  opacity: number;
}

interface FinanceIcon {
  id: number;
  type: "chart" | "coin" | "percent" | "arrow";
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

function generateCurrencies(count: number): FloatingCurrency[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    symbol: CURRENCY_SYMBOLS[Math.floor(Math.random() * CURRENCY_SYMBOLS.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 32 + 16,
    duration: Math.random() * 25 + 20,
    delay: Math.random() * 10,
    rotateDirection: Math.random() > 0.5 ? 1 : -1,
    opacity: Math.random() * 0.04 + 0.02,
  }));
}

function generateFinanceIcons(count: number): FinanceIcon[] {
  const types: FinanceIcon["type"][] = ["chart", "coin", "percent", "arrow"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    type: types[Math.floor(Math.random() * types.length)],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 40 + 24,
    duration: Math.random() * 30 + 25,
    delay: Math.random() * 8,
  }));
}

function CurrencySymbol({ currency }: { currency: FloatingCurrency }) {
  return (
    <motion.div
      className="absolute font-bold text-primary select-none"
      style={{
        left: `${currency.x}%`,
        top: `${currency.y}%`,
        fontSize: currency.size,
        opacity: currency.opacity,
      }}
      animate={{
        x: [0, 40 * currency.rotateDirection, -30 * currency.rotateDirection, 50 * currency.rotateDirection, 0],
        y: [0, -50, 30, -40, 0],
        rotate: [0, 15 * currency.rotateDirection, -10 * currency.rotateDirection, 20 * currency.rotateDirection, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration: currency.duration,
        delay: currency.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {currency.symbol}
    </motion.div>
  );
}

function FinanceIconElement({ icon }: { icon: FinanceIcon }) {
  const iconPaths = {
    chart: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 5-6" />
      </svg>
    ),
    coin: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v2m0 8v2" />
        <path d="M9 10c0-1 1-2 3-2s3 1 3 2-1 2-3 2-3 1-3 2 1 2 3 2 3-1 3-2" />
      </svg>
    ),
    percent: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="7" cy="7" r="3" />
        <circle cx="17" cy="17" r="3" />
        <path d="M5 19L19 5" />
      </svg>
    ),
    arrow: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 17l10-10m0 0v8m0-8h-8" />
      </svg>
    ),
  };

  return (
    <motion.div
      className="absolute text-accent opacity-[0.04]"
      style={{
        left: `${icon.x}%`,
        top: `${icon.y}%`,
        width: icon.size,
        height: icon.size,
      }}
      animate={{
        x: [0, 60, -40, 30, 0],
        y: [0, -40, 60, -30, 0],
        rotate: [0, 10, -5, 15, 0],
        scale: [1, 1.2, 0.9, 1.15, 1],
      }}
      transition={{
        duration: icon.duration,
        delay: icon.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {iconPaths[icon.type]}
    </motion.div>
  );
}

function GradientOrbs() {
  return (
    <>
      {/* Deep Navy Primary orb */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(12, 39, 66, 0.12) 0%, transparent 70%)",
          top: "-15%",
          right: "-10%",
        }}
        animate={{
          x: [0, 80, -60, 100, 0],
          y: [0, 100, -50, 60, 0],
          scale: [1, 1.3, 0.85, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Mint accent orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(87, 191, 167, 0.1) 0%, transparent 70%)",
          bottom: "-10%",
          left: "-8%",
        }}
        animate={{
          x: [0, -100, 70, -50, 0],
          y: [0, -80, 50, -90, 0],
          scale: [1, 0.85, 1.25, 0.9, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary navy orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[80px]"
        style={{
          background: "radial-gradient(circle, rgba(12, 39, 66, 0.08) 0%, transparent 70%)",
          top: "50%",
          left: "40%",
        }}
        animate={{
          x: [0, 150, -100, 80, 0],
          y: [0, -120, 80, -60, 0],
          scale: [1, 1.4, 0.75, 1.2, 1],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating mint accent */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full blur-[60px]"
        style={{
          background: "radial-gradient(circle, rgba(87, 191, 167, 0.08) 0%, transparent 70%)",
          top: "20%",
          right: "20%",
        }}
        animate={{
          x: [0, -80, 100, -60, 0],
          y: [0, 100, -80, 60, 0],
          scale: [1, 1.2, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
}

function GridPattern() {
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(12, 39, 66, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(12, 39, 66, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
      animate={{
        backgroundPosition: ["0px 0px", "80px 80px"],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

function StockChartLine() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="chartGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0C2742" stopOpacity="0" />
          <stop offset="30%" stopColor="#0C2742" stopOpacity="0.06" />
          <stop offset="70%" stopColor="#57BFA7" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#57BFA7" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="chartGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#57BFA7" stopOpacity="0" />
          <stop offset="50%" stopColor="#57BFA7" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#0C2742" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* First stock line */}
      <motion.path
        d="M0 300 Q100 250 200 280 T400 220 T600 260 T800 180 T1000 220 T1200 150 T1400 200 T1600 120 T1800 180 T2000 100"
        fill="none"
        stroke="url(#chartGradient1)"
        strokeWidth="2"
        animate={{
          d: [
            "M0 300 Q100 250 200 280 T400 220 T600 260 T800 180 T1000 220 T1200 150 T1400 200 T1600 120 T1800 180 T2000 100",
            "M0 280 Q100 320 200 250 T400 280 T600 200 T800 240 T1000 160 T1200 200 T1400 140 T1600 180 T1800 100 T2000 150",
            "M0 320 Q100 280 200 300 T400 200 T600 280 T800 160 T1000 240 T1200 120 T1400 220 T1600 100 T1800 160 T2000 120",
            "M0 300 Q100 250 200 280 T400 220 T600 260 T800 180 T1000 220 T1200 150 T1400 200 T1600 120 T1800 180 T2000 100",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Second stock line */}
      <motion.path
        d="M0 400 Q150 350 300 380 T600 320 T900 360 T1200 280 T1500 320 T1800 260 T2000 300"
        fill="none"
        stroke="url(#chartGradient2)"
        strokeWidth="2"
        animate={{
          d: [
            "M0 400 Q150 350 300 380 T600 320 T900 360 T1200 280 T1500 320 T1800 260 T2000 300",
            "M0 380 Q150 420 300 350 T600 380 T900 300 T1200 340 T1500 260 T1800 300 T2000 240",
            "M0 420 Q150 380 300 400 T600 340 T900 380 T1200 300 T1500 340 T1800 280 T2000 320",
            "M0 400 Q150 350 300 380 T600 320 T900 360 T1200 280 T1500 320 T1800 260 T2000 300",
          ],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Third accent line */}
      <motion.path
        d="M0 500 Q200 450 400 480 T800 420 T1200 460 T1600 380 T2000 420"
        fill="none"
        stroke="url(#chartGradient1)"
        strokeWidth="1.5"
        strokeDasharray="8 4"
        animate={{
          d: [
            "M0 500 Q200 450 400 480 T800 420 T1200 460 T1600 380 T2000 420",
            "M0 480 Q200 520 400 450 T800 480 T1200 400 T1600 440 T2000 360",
            "M0 520 Q200 480 400 500 T800 440 T1200 480 T1600 400 T2000 440",
            "M0 500 Q200 450 400 480 T800 420 T1200 460 T1600 380 T2000 420",
          ],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />
    </svg>
  );
}

function BarChartBars() {
  const bars = [
    { x: 5, height: 60, delay: 0 },
    { x: 12, height: 85, delay: 0.5 },
    { x: 19, height: 45, delay: 1 },
    { x: 26, height: 70, delay: 1.5 },
    { x: 33, height: 90, delay: 2 },
    { x: 40, height: 55, delay: 2.5 },
    { x: 47, height: 75, delay: 3 },
    { x: 54, height: 40, delay: 3.5 },
    { x: 61, height: 80, delay: 4 },
    { x: 68, height: 65, delay: 4.5 },
    { x: 75, height: 95, delay: 5 },
    { x: 82, height: 50, delay: 5.5 },
    { x: 89, height: 70, delay: 6 },
    { x: 96, height: 85, delay: 6.5 },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-48 opacity-[0.03]">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-[4%] bg-primary rounded-t"
          style={{ left: `${bar.x}%` }}
          animate={{
            height: [`${bar.height}%`, `${bar.height * 0.6}%`, `${bar.height * 1.2}%`, `${bar.height * 0.8}%`, `${bar.height}%`],
          }}
          transition={{
            duration: 8,
            delay: bar.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function PieChartSegment() {
  return (
    <motion.div
      className="absolute opacity-[0.04]"
      style={{ top: "10%", right: "5%" }}
      animate={{
        rotate: [0, 360],
        scale: [1, 1.05, 0.95, 1.02, 1],
      }}
      transition={{
        rotate: { duration: 60, repeat: Infinity, ease: "linear" },
        scale: { duration: 15, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <svg width="200" height="200" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#0C2742" strokeWidth="20" strokeDasharray="75 175" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#57BFA7" strokeWidth="20" strokeDasharray="50 200" strokeDashoffset="-75" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#0C2742" strokeWidth="20" strokeDasharray="40 210" strokeDashoffset="-125" opacity="0.5" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#57BFA7" strokeWidth="20" strokeDasharray="30 220" strokeDashoffset="-165" opacity="0.5" />
      </svg>
    </motion.div>
  );
}

function FloatingCoins() {
  const coins = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    size: 20 + Math.random() * 30,
    duration: 20 + Math.random() * 15,
    delay: Math.random() * 8,
  }));

  return (
    <>
      {coins.map((coin) => (
        <motion.div
          key={coin.id}
          className="absolute"
          style={{
            left: `${coin.x}%`,
            top: `${coin.y}%`,
            width: coin.size,
            height: coin.size,
          }}
          animate={{
            x: [0, 50, -30, 40, 0],
            y: [0, -60, 40, -30, 0],
            rotateY: [0, 180, 360, 540, 720],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: coin.duration,
            delay: coin.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full text-accent opacity-[0.06]">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">$</text>
          </svg>
        </motion.div>
      ))}
    </>
  );
}

function RisingBubbles() {
  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 4 + Math.random() * 12,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 15,
  }));

  return (
    <>
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute bottom-0 rounded-full border border-accent"
          style={{
            left: `${bubble.x}%`,
            width: bubble.size,
            height: bubble.size,
            opacity: 0,
          }}
          animate={{
            y: [0, -800],
            opacity: [0, 0.08, 0.08, 0],
            scale: [0.5, 1, 1.2, 1],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

export function AnimatedBackground() {
  const [currencies, setCurrencies] = useState<FloatingCurrency[]>([]);
  const [financeIcons, setFinanceIcons] = useState<FinanceIcon[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrencies(generateCurrencies(18));
    setFinanceIcons(generateFinanceIcons(10));
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient orbs - base layer */}
      <GradientOrbs />

      {/* Animated grid pattern */}
      <GridPattern />

      {/* Stock chart lines */}
      <StockChartLine />

      {/* Bar chart animation */}
      <BarChartBars />

      {/* Rotating pie chart */}
      <PieChartSegment />

      {/* Floating currency symbols */}
      {currencies.map((currency) => (
        <CurrencySymbol key={currency.id} currency={currency} />
      ))}

      {/* Finance icons (charts, coins, etc.) */}
      {financeIcons.map((icon) => (
        <FinanceIconElement key={icon.id} icon={icon} />
      ))}

      {/* 3D-style floating coins */}
      <FloatingCoins />

      {/* Rising bubbles */}
      <RisingBubbles />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
