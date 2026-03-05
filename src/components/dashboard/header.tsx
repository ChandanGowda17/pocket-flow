"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import AddTransactionDialog from "./add-transaction-dialog";
import type { Transaction } from "@/lib/data";
import { ThemeToggle } from "../theme-toggle";

interface DashboardHeaderProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  transactions: Transaction[];
}

export default function DashboardHeader({ onAddTransaction, transactions }: DashboardHeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="font-semibold text-lg">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <AddTransactionDialog onAddTransaction={onAddTransaction} transactions={transactions} />
        <ThemeToggle />
      </div>
    </header>
  );
}
