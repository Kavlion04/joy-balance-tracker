export type TxType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  type: TxType;
  amount: number;
  category: string;
  comment: string | null;
  occurred_on: string; // ISO date
  created_at: string;
}
