export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
}

export const categories = [
  "Groceries",
  "Salary",
  "Entertainment",
  "Utilities",
  "Rent",
  "Transport",
  "Dining Out",
  "Shopping",
  "Healthcare",
  "Travel",
  "Other",
];
