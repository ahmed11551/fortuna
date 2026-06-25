export interface User {
  id: string;
  telegram_id: number;
  username: string;
  first_name: string;
  balance_tickets: number;
  referral_code: string;
  referred_by: number | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: "purchase" | "spin" | "bonus" | "referral" | "raffle_entry";
  amount: number;
  description: string;
  created_at: string;
}

export interface Prize {
  id: number;
  name: string;
  category: "common" | "rare" | "epic" | "legendary";
  probability: number;
  color: string;
  textColor: string;
  is_super_prize: boolean;
}

export interface Winner {
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

export interface Raffle {
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

export interface AdminStats {
  totalUsers: number;
  totalSpins: number;
  totalSalesRub: number;
  totalTicketsBought: number;
  pendingClaims: number;
  winners: Winner[];
  prizes: Prize[];
}
