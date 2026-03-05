"use client";

import * as React from "react";
import type { Transaction, Budget } from "@/lib/data";
import { mockTransactions, mockBudgets } from "@/lib/data";

import DashboardHeader from "@/components/dashboard/header";
import FinancialOverview from "@/components/dashboard/overview";
import BudgetProgress from "@/components/dashboard/budget-progress";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import SpendingChart from "@/components/dashboard/spending-chart";
import AuthGate from "@/components/auth-gate";
import AppShell from "@/components/app-shell";

function Dashboard() {
  const [transactions, setTransactions] =
    React.useState<Transaction[]>(mockTransactions);
  const [budgets] = React.useState<Budget[]>(mockBudgets);

  const handleAddTransaction = React.useCallback((newTransaction: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [
      { ...newTransaction, id: `tx_${Date.now()}` },
      ...prev,
    ]);
  }, []);

  return (
    <AppShell>
      <DashboardHeader onAddTransaction={handleAddTransaction} transactions={transactions} />
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FinancialOverview transactions={transactions} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-12 lg:col-span-4">
            <SpendingChart transactions={transactions} />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <BudgetProgress budgets={budgets} transactions={transactions} />
          </div>
        </div>
          <div className="grid gap-4">
            <RecentTransactions transactions={transactions} limit={7} />
        </div>
      </main>
    </AppShell>
  );
}

export default function DashboardPage() {
  return (
    <AuthGate>
      <Dashboard />
    </AuthGate>
  )
}
