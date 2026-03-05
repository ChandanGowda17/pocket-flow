"use client";

import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { mockTransactions } from "@/lib/data";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import AuthGate from "@/components/auth-gate";
import AppShell from "@/components/app-shell";

function Transactions() {
  return (
    <AppShell>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Transactions</h1>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <RecentTransactions transactions={mockTransactions} />
      </main>
    </AppShell>
  );
}

export default function TransactionsPage() {
  return (
    <AuthGate>
      <Transactions />
    </AuthGate>
  )
}
