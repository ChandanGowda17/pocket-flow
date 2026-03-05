"use client";

import * as React from "react";
import type { Transaction, Budget } from "@/lib/data";
import { collection, serverTimestamp, query, orderBy } from "firebase/firestore";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";

import DashboardHeader from "@/components/dashboard/header";
import FinancialOverview from "@/components/dashboard/overview";
import BudgetProgress from "@/components/dashboard/budget-progress";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import SpendingChart from "@/components/dashboard/spending-chart";
import AuthGate from "@/components/auth-gate";
import AppShell from "@/components/app-shell";

function Dashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const transactionsCollectionRef = useMemoFirebase(
    () => (user ? collection(firestore, "users", user.uid, "transactions") : null),
    [firestore, user]
  );
  
  const transactionsQuery = useMemoFirebase(
    () => (transactionsCollectionRef ? query(transactionsCollectionRef, orderBy("date", "desc")) : null),
    [transactionsCollectionRef]
  );

  const { data: rawTransactions, isLoading: transactionsLoading } = useCollection<any>(transactionsQuery);

  const budgetsQuery = useMemoFirebase(
    () => (user ? collection(firestore, "users", user.uid, "budgets") : null),
    [firestore, user]
  );
  const { data: budgets, isLoading: budgetsLoading } = useCollection<Budget>(budgetsQuery);

  const transactions: Transaction[] = React.useMemo(() => {
    if (!rawTransactions) return [];
    return rawTransactions.map((t: any) => ({
      ...t,
      date: t.date?.toDate ? t.date.toDate() : new Date(t.date),
    }));
  }, [rawTransactions]);

  const handleAddTransaction = React.useCallback((newTransaction: Omit<Transaction, 'id'>) => {
    if (!user || !transactionsCollectionRef) return;

    const transactionData = {
      ...newTransaction,
      userId: user.uid,
      date: newTransaction.date,
      isRecurrent: false, // Default value
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    addDocumentNonBlocking(transactionsCollectionRef, transactionData);
  }, [user, transactionsCollectionRef]);

  if (transactionsLoading || budgetsLoading) {
    return (
      <AppShell>
        <DashboardHeader onAddTransaction={handleAddTransaction} transactions={[]} />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Loading your financial data...</p>
          </div>
        </main>
      </AppShell>
    );
  }

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
            <BudgetProgress budgets={budgets || []} transactions={transactions} />
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
