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

export const mockTransactions: Transaction[] = [
  {
    id: "tx_1",
    date: new Date("2024-07-20"),
    description: "Monthly Salary",
    amount: 5000,
    type: "income",
    category: "Salary",
  },
  {
    id: "tx_2",
    date: new Date("2024-07-20"),
    description: "Apartment Rent",
    amount: 1500,
    type: "expense",
    category: "Rent",
  },
  {
    id: "tx_3",
    date: new Date("2024-07-18"),
    description: "Weekly Groceries - SuperMart",
    amount: 125.5,
    type: "expense",
    category: "Groceries",
  },
  {
    id: "tx_4",
    date: new Date("2024-07-17"),
    description: "Electricity Bill",
    amount: 75.2,
    type: "expense",
    category: "Utilities",
  },
  {
    id: "tx_5",
    date: new Date("2024-07-16"),
    description: "Dinner with friends at The Italian Place",
    amount: 80,
    type: "expense",
    category: "Dining Out",
  },
  {
    id: "tx_6",
    date: new Date("2024-07-15"),
    description: "Movie tickets - 'Space Adventure'",
    amount: 30,
    type: "expense",
    category: "Entertainment",
  },
  {
    id: "tx_7",
    date: new Date("2024-07-14"),
    description: "Monthly bus pass",
    amount: 60,
    type: "expense",
    category: "Transport",
  },
  {
    id: "tx_8",
    date: new Date("2024-07-12"),
    description: "New pair of running shoes",
    amount: 150,
    type: "expense",
    category: "Shopping",
  },
  {
    id: "tx_9",
    date: new Date("2024-07-10"),
    description: "Pharmacy - Cold medicine",
    amount: 22.8,
    type: "expense",
    category: "Healthcare",
  },
  {
    id: "tx_10",
    date: new Date("2024-07-05"),
    description: "Freelance Project Payment",
    amount: 750,
    type: "income",
    category: "Freelance",
  },
];

export const mockBudgets: Budget[] = [
  { id: "b_1", category: "Groceries", amount: 400 },
  { id: "b_2", category: "Dining Out", amount: 200 },
  { id: "b_3", category: "Shopping", amount: 300 },
  { id: "b_4", category: "Entertainment", amount: 150 },
  { id: "b_5", category: "Transport", amount: 100 },
];

export const mockUser = {
  name: "Alex Doe",
  email: "alex.doe@example.com",
};
