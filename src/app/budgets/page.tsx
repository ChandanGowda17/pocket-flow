"use client";

import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { collection, query, orderBy } from "firebase/firestore";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import type { Budget, Transaction } from "@/lib/data";
import BudgetProgress from "@/components/dashboard/budget-progress";
import AuthGate from "@/components/auth-gate";
import AppShell from "@/components/app-shell";
import { ThemeToggle } from "@/components/theme-toggle";

function Budgets() {
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

  const isLoading = transactionsLoading || budgetsLoading;

  return (
    <AppShell>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Budgets</h1>
        </div>
        <ThemeToggle />
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading budgets...</div>
          ) : (
            <BudgetProgress budgets={budgets || []} transactions={transactions} />
          )}
      </main>
    </AppShell>
  );
}

export default function BudgetsPage() {
  return (
    <AuthGate>
      <Budgets />
    </AuthGate>
  )
}
