export type TxType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  type: TxType;
  amount: number;
  category: string;
  comment: string | null;
  occurred_on: string;
  created_at: string;
  deleted_at?: string | null;
}

export type TextSize = "sm" | "md" | "lg";

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  background_url: string | null;
  accent_color: string | null;
  text_size: TextSize;
  onboarded: boolean;
}
