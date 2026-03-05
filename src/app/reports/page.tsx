"use client";

import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { mockTransactions } from "@/lib/data";
import SpendingChart from "@/components/dashboard/spending-chart";
import FinancialOverview from "@/components/dashboard/overview";
import AuthGate from "@/components/auth-gate";
import AppShell from "@/components/app-shell";
import { ThemeToggle } from "@/components/theme-toggle";

function Reports() {
  return (
    <AppShell>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Reports</h1>
        </div>
        <ThemeToggle />
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <FinancialOverview transactions={mockTransactions} />
          </div>
          <div className="grid gap-4">
              <SpendingChart transactions={mockTransactions} />
          </div>
      </main>
    </AppShell>
  );
}

export default function ReportsPage() {
  return (
    <AuthGate>
      <Reports />
    </AuthGate>
  );
}
