import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// Interfaces
interface User {
  id: string;
  telegram_id: number;
  username: string;
  first_name: string;
  balance_tickets: number;
  referral_code: string;
  referred_by: number | null;
  created_at: string;
}

interface Transaction {
  id: string;
  user_id: string;
  type: "purchase" | "spin" | "bonus" | "referral" | "raffle_entry";
  amount: number;
  description: string;
  created_at: string;
}

interface Prize {
  id: number;
  name: string;
  category: "common" | "rare" | "epic" | "legendary";
  probability: number;
  color: string;
  textColor: string;
  is_super_prize: boolean;
}

interface Winner {
  id: string;
  user_id: string;
  telegram_id: number;
  username: string;
  prize_name: string;
  category: string;
  full_name?: string;
  phone?: string;
  address?: string;
  status: "pending" | "sent";
  created_at: string;
}

interface Raffle {
  id: string;
  title: string;
  prize_name: string;
  ticket_cost: number;
  draw_date: string;
  image_url: string;
  participants: { telegram_id: number; username: string; entries: number }[];
  winner_username?: string;
  winner_prize?: string;
  is_drawn: boolean;
}

// Default Prizes (total probability must sum to 1.0)
const DEFAULT_PRIZES: Prize[] = [
  { id: 1, name: "+2 билета", category: "common", probability: 0.25, color: "#1E3A8A", textColor: "#FFFFFF", is_super_prize: false },
  { id: 2, name: "Скидка 15%", category: "common", probability: 0.20, color: "#EC4899", textColor: "#FFFFFF", is_super_prize: false },
  { id: 3, name: "Попробуй еще!", category: "common", probability: 0.25, color: "#F59E0B", textColor: "#1E293B", is_super_prize: false },
  { id: 4, name: "1000₽ на карту", category: "rare", probability: 0.05, color: "#10B981", textColor: "#FFFFFF", is_super_prize: true },
  { id: 5, name: "+5 билетов", category: "rare", probability: 0.15, color: "#3B82F6", textColor: "#FFFFFF", is_super_prize: false },
  { id: 6, name: "Скидка 30%", category: "epic", probability: 0.08, color: "#8B5CF6", textColor: "#FFFFFF", is_super_prize: false },
  { id: 7, name: "iPhone 16", category: "legendary", probability: 0.01, color: "#EF4444", textColor: "#FFFFFF", is_super_prize: true },
  { id: 8, name: "PlayStation 5", category: "legendary", probability: 0.01, color: "#D97706", textColor: "#FFFFFF", is_super_prize: true },
];

const DEFAULT_RAFFLES: Raffle[] = [
  {
    id: "r1",
    title: "Мега Розыгрыш Смартфона",
    prize_name: "iPhone 16 Pro Max",
    ticket_cost: 10,
    draw_date: "2026-07-15",
    image_url: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=400",
    participants: [
      { telegram_id: 1234567, username: "ozon_lover", entries: 5 },
      { telegram_id: 7654321, username: "lucky_spin", entries: 3 }
    ],
    is_drawn: false
  },
  {
    id: "r2",
    title: "Розыгрыш для Геймеров",
    prize_name: "Sony PlayStation 5 Slim",
    ticket_cost: 5,
    draw_date: "2026-07-20",
    image_url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=400",
    participants: [
      { telegram_id: 1234567, username: "ozon_lover", entries: 2 }
    ],
    is_drawn: false
  },
  {
    id: "r3",
    title: "Летнее Путешествие",
    prize_name: "Сертификат на отдых 100,000₽",
    ticket_cost: 15,
    draw_date: "2026-06-25", // Draw date in the past for completed sample
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
    participants: [
      { telegram_id: 999999, username: "traveler", entries: 4 },
      { telegram_id: 888888, username: "sea_breeze", entries: 8 }
    ],
    winner_username: "sea_breeze",
    winner_prize: "Сертификат на отдых 100,000₽",
    is_drawn: true
  }
];

// Database File Path
const DB_FILE = path.join(process.cwd(), "db.json");

// Local DB Helpers
function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [] as User[],
      transactions: [] as Transaction[],
      prizes: DEFAULT_PRIZES,
      winners: [] as Winner[],
      raffles: DEFAULT_RAFFLES,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading database file, resetting:", err);
    const initialData = {
      users: [] as User[],
      transactions: [] as Transaction[],
      prizes: DEFAULT_PRIZES,
      winners: [] as Winner[],
      raffles: DEFAULT_RAFFLES,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
}

function writeDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// Generate unique referral code
function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Initialize and start Express
async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Initialize DB on launch
  readDB();

  // API Route: User auth (get or create)
  app.get("/api/user", (req, res) => {
    try {
      const telegramIdRaw = req.query.telegram_id;
      const username = (req.query.username as string) || "guest_" + Math.floor(1000 + Math.random() * 9000);
      const firstName = (req.query.first_name as string) || "Игрок";
      const referredByCode = req.query.referred_by_code as string | undefined;

      if (!telegramIdRaw) {
        return res.status(400).json({ error: "telegram_id is required" });
      }

      const telegram_id = parseInt(telegramIdRaw as string, 10);
      if (isNaN(telegram_id)) {
        return res.status(400).json({ error: "Invalid telegram_id" });
      }

      const db = readDB();
      let user = db.users.find((u: User) => u.telegram_id === telegram_id);

      if (!user) {
        // Create user
        let referred_by_id: number | null = null;
        if (referredByCode) {
          const referrer = db.users.find((u: User) => u.referral_code === referredByCode.toUpperCase());
          if (referrer && referrer.telegram_id !== telegram_id) {
            referred_by_id = referrer.telegram_id;
            // Reward referrer with 1 ticket
            referrer.balance_tickets += 1;
            db.transactions.push({
              id: "t_ref_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
              user_id: referrer.id,
              type: "referral",
              amount: 1,
              description: `Бонус за приглашение @${username}`,
              created_at: new Date().toISOString()
            });
          }
        }

        user = {
          id: "u_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          telegram_id,
          username,
          first_name: firstName,
          balance_tickets: 5, // 5 free tickets on sign-up!
          referral_code: generateReferralCode(),
          referred_by: referred_by_id,
          created_at: new Date().toISOString()
        };

        db.users.push(user);

        // Add welcome transaction
        db.transactions.push({
          id: "t_welcome_" + Date.now(),
          user_id: user.id,
          type: "bonus",
          amount: 5,
          description: "Подарок за регистрацию",
          created_at: new Date().toISOString()
        });

        writeDB(db);
      } else {
        // Update username / first name if changed
        let updated = false;
        if (user.username !== username) {
          user.username = username;
          updated = true;
        }
        if (user.first_name !== firstName) {
          user.first_name = firstName;
          updated = true;
        }
        if (updated) {
          writeDB(db);
        }
      }

      // Return user and their last 15 transactions
      const userTransactions = db.transactions
        .filter((t: Transaction) => t.user_id === user!.id)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 15);

      res.json({
        user,
        transactions: userTransactions
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Spin Wheel
  app.post("/api/spin", (req, res) => {
    try {
      const { telegram_id } = req.body;
      if (!telegram_id) {
        return res.status(400).json({ error: "telegram_id is required" });
      }

      const db = readDB();
      const user = db.users.find((u: User) => u.telegram_id === telegram_id);

      if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }

      if (user.balance_tickets < 1) {
        return res.status(400).json({ error: "Недостаточно билетов" });
      }

      // Spend 1 ticket
      user.balance_tickets -= 1;
      const spinTxId = "t_spin_" + Date.now();
      db.transactions.push({
        id: spinTxId,
        user_id: user.id,
        type: "spin",
        amount: -1,
        description: "Вращение колеса",
        created_at: new Date().toISOString()
      });

      // Roll a prize based on probabilities
      const roll = Math.random();
      let cumulative = 0;
      let chosenPrize = db.prizes[0] || DEFAULT_PRIZES[0];

      // Normalize probabilities dynamically in case they don't sum to exactly 1.0
      const totalProb = db.prizes.reduce((sum: number, p: Prize) => sum + p.probability, 0);

      for (const prize of db.prizes) {
        const normProb = totalProb > 0 ? prize.probability / totalProb : prize.probability;
        cumulative += normProb;
        if (roll <= cumulative) {
          chosenPrize = prize;
          break;
        }
      }

      // Apply prize rewards
      let winDescription = `Выигран приз: ${chosenPrize.name}`;

      if (chosenPrize.name.includes("билет")) {
        // Parse ticket count, e.g. "+2 билета" -> 2
        const match = chosenPrize.name.match(/\+(\d+)/);
        const bonusCount = match ? parseInt(match[1], 10) : 0;
        if (bonusCount > 0) {
          user.balance_tickets += bonusCount;
          db.transactions.push({
            id: "t_win_bonus_" + Date.now(),
            user_id: user.id,
            type: "bonus",
            amount: bonusCount,
            description: `Выигрыш на колесе: +${bonusCount} билетов`,
            created_at: new Date().toISOString()
          });
        }
      } else if (chosenPrize.is_super_prize) {
        // Major prize, add to claims / winners list
        const winnerId = "w_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
        db.winners.push({
          id: winnerId,
          user_id: user.id,
          telegram_id: user.telegram_id,
          username: user.username,
          prize_name: chosenPrize.name,
          category: chosenPrize.category,
          status: "pending",
          created_at: new Date().toISOString()
        });
      }

      writeDB(db);

      res.json({
        prize: chosenPrize,
        new_balance: user.balance_tickets,
        winner_id: chosenPrize.is_super_prize ? db.winners[db.winners.length - 1].id : null,
        success: true
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Buy Tickets (Simulate Payment via Tariffs)
  app.post("/api/buy-tickets", (req, res) => {
    try {
      const { telegram_id, tickets, price } = req.body;
      if (!telegram_id || !tickets || !price) {
        return res.status(400).json({ error: "Missing telegram_id, tickets or price" });
      }

      const db = readDB();
      const user = db.users.find((u: User) => u.telegram_id === telegram_id);

      if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }

      // Add tickets
      user.balance_tickets += parseInt(tickets, 10);
      db.transactions.push({
        id: "t_buy_" + Date.now(),
        user_id: user.id,
        type: "purchase",
        amount: parseInt(tickets, 10),
        description: `Покупка ${tickets} билетов за ${price}₽`,
        created_at: new Date().toISOString()
      });

      writeDB(db);

      res.json({
        success: true,
        new_balance: user.balance_tickets,
        message: `Баланс успешно пополнен на +${tickets} билетов!`
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Claim Delivery Details for physical wins
  app.post("/api/claim-prize", (req, res) => {
    try {
      const { winner_id, full_name, phone, address } = req.body;
      if (!winner_id || !full_name || !phone || !address) {
        return res.status(400).json({ error: "Не все поля заполнены" });
      }

      const db = readDB();
      const winner = db.winners.find((w: Winner) => w.id === winner_id);

      if (!winner) {
        return res.status(404).json({ error: "Запись выигрыша не найдена" });
      }

      winner.full_name = full_name;
      winner.phone = phone;
      winner.address = address;
      winner.status = "pending";

      writeDB(db);

      res.json({ success: true, message: "Адрес доставки успешно сохранен! С вами свяжется менеджер." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Get all winners/claims
  app.get("/api/winners", (req, res) => {
    try {
      const db = readDB();
      // Return a list of winners (hide sensitive addresses/phones for non-admins, but return public info)
      const publicWinners = db.winners.map((w: Winner) => ({
        id: w.id,
        telegram_id: w.telegram_id,
        username: w.username,
        prize_name: w.prize_name,
        category: w.category,
        status: w.status,
        created_at: w.created_at
      }));
      res.json(publicWinners);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Get raffles
  app.get("/api/raffles", (req, res) => {
    try {
      const db = readDB();
      res.json(db.raffles);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API Route: Enter Raffle with Tickets
  app.post("/api/raffles/enter", (req, res) => {
    try {
      const { telegram_id, raffle_id, tickets_to_spend } = req.body;
      if (!telegram_id || !raffle_id || !tickets_to_spend) {
        return res.status(400).json({ error: "Missing parameters" });
      }

      const spend = parseInt(tickets_to_spend, 10);
      if (isNaN(spend) || spend <= 0) {
        return res.status(400).json({ error: "Invalid tickets count" });
      }

      const db = readDB();
      const user = db.users.find((u: User) => u.telegram_id === telegram_id);
      if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }

      if (user.balance_tickets < spend) {
        return res.status(400).json({ error: "Недостаточно билетов" });
      }

      const raffle = db.raffles.find((r: Raffle) => r.id === raffle_id);
      if (!raffle) {
        return res.status(404).json({ error: "Розыгрыш не найден" });
      }

      if (raffle.is_drawn) {
        return res.status(400).json({ error: "Розыгрыш уже завершен" });
      }

      // Spend tickets
      user.balance_tickets -= spend;
      db.transactions.push({
        id: "t_raffle_spend_" + Date.now() + "_" + Math.floor(Math.random() * 100),
        user_id: user.id,
        type: "raffle_entry",
        amount: -spend,
        description: `Покупка ${spend} билетов для участия в: ${raffle.title}`,
        created_at: new Date().toISOString()
      });

      // Add to raffle participant
      const existingParticipant = raffle.participants.find((p: any) => p.telegram_id === telegram_id);
      if (existingParticipant) {
        existingParticipant.entries += spend;
      } else {
        raffle.participants.push({
          telegram_id: user.telegram_id,
          username: user.username,
          entries: spend
        });
      }

      writeDB(db);

      res.json({
        success: true,
        new_balance: user.balance_tickets,
        raffle,
        message: `Вы успешно приобрели ${spend} билетов на розыгрыш!`
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ================= ADMIN ROUTES =================

  // Get Admin statistics
  app.get("/api/admin/stats", (req, res) => {
    try {
      const db = readDB();
      const totalUsers = db.users.length;
      const totalSpins = db.transactions.filter((t: Transaction) => t.type === "spin").length;
      
      let totalSalesRub = 0;
      let totalTicketsBought = 0;
      db.transactions.filter((t: Transaction) => t.type === "purchase").forEach((t: Transaction) => {
        totalTicketsBought += t.amount;
        // Estimate price: e.g. "Покупка 5 билетов за 200₽" -> parse 200
        const match = t.description.match(/за (\d+)₽/);
        if (match) {
          totalSalesRub += parseInt(match[1], 10);
        } else {
          // fallback estimation
          totalSalesRub += t.amount * 40;
        }
      });

      const pendingClaims = db.winners.filter((w: Winner) => w.status === "pending" && w.full_name).length;

      res.json({
        totalUsers,
        totalSpins,
        totalSalesRub,
        totalTicketsBought,
        pendingClaims,
        winners: db.winners, // Return full winners with delivery info
        prizes: db.prizes
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: update winner status
  app.post("/api/admin/winners/status", (req, res) => {
    try {
      const { winner_id, status } = req.body;
      if (!winner_id || !status) {
        return res.status(400).json({ error: "Missing parameters" });
      }

      const db = readDB();
      const winner = db.winners.find((w: Winner) => w.id === winner_id);
      if (!winner) {
        return res.status(404).json({ error: "Winner not found" });
      }

      winner.status = status;
      writeDB(db);

      res.json({ success: true, message: "Статус успешно обновлен!" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: Update prize settings (wheel sections)
  app.post("/api/admin/prizes", (req, res) => {
    try {
      const { prizes } = req.body;
      if (!Array.isArray(prizes)) {
        return res.status(400).json({ error: "Prizes must be an array" });
      }

      const db = readDB();
      db.prizes = prizes;
      writeDB(db);

      res.json({ success: true, message: "Настройки колеса сохранены!" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: Draw Raffle winner
  app.post("/api/admin/raffles/draw", (req, res) => {
    try {
      const { raffle_id } = req.body;
      if (!raffle_id) {
        return res.status(400).json({ error: "raffle_id is required" });
      }

      const db = readDB();
      const raffle = db.raffles.find((r: Raffle) => r.id === raffle_id);
      if (!raffle) {
        return res.status(404).json({ error: "Raffle not found" });
      }

      if (raffle.is_drawn) {
        return res.status(400).json({ error: "Raffle already drawn" });
      }

      if (raffle.participants.length === 0) {
        return res.status(400).json({ error: "В розыгрыше нет участников" });
      }

      // Draw based on tickets purchased (entries)
      // Build a weighted pool
      const pool: string[] = [];
      raffle.participants.forEach((p: any) => {
        for (let i = 0; i < p.entries; i++) {
          pool.push(p.username);
        }
      });

      if (pool.length === 0) {
        return res.status(400).json({ error: "Нет купленных билетов в розыгрыше" });
      }

      const winningUsername = pool[Math.floor(Math.random() * pool.length)];
      const winnerParticipant = raffle.participants.find((p: any) => p.username === winningUsername);

      raffle.winner_username = winningUsername;
      raffle.winner_prize = raffle.prize_name;
      raffle.is_drawn = true;

      // Add to winners/claims list if it's a major reward
      const dbWinnerUser = db.users.find((u: User) => u.username === winningUsername);
      if (dbWinnerUser) {
        db.winners.push({
          id: "w_raffle_" + Date.now(),
          user_id: dbWinnerUser.id,
          telegram_id: dbWinnerUser.telegram_id,
          username: dbWinnerUser.username,
          prize_name: `[РОЗЫГРЫШ] ${raffle.prize_name}`,
          category: "legendary",
          status: "pending",
          created_at: new Date().toISOString()
        });
      }

      writeDB(db);

      res.json({
        success: true,
        winner_username: winningUsername,
        winner_participant: winnerParticipant,
        message: `Победитель успешно определен: @${winningUsername}!`
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: Reset Database to default state
  app.post("/api/admin/reset", (req, res) => {
    try {
      const initialData = {
        users: [] as User[],
        transactions: [] as Transaction[],
        prizes: DEFAULT_PRIZES,
        winners: [] as Winner[],
        raffles: DEFAULT_RAFFLES,
      };
      writeDB(initialData);
      res.json({ success: true, message: "База данных успешно сброшена к начальному состоянию!" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware setup for SPA
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
