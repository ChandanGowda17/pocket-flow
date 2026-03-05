"use client";

import * as React from "react";
import Image from "next/image";
import {
  ArrowLeftRight,
  LayoutDashboard,
  PieChart,
  Settings,
  Target,
  Wallet,
} from "lucide-react";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { Transaction, Budget } from "@/lib/data";
import { mockTransactions, mockBudgets, mockUser } from "@/lib/data";
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import DashboardHeader from "@/components/dashboard/header";
import FinancialOverview from "@/components/dashboard/overview";
import BudgetProgress from "@/components/dashboard/budget-progress";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import SpendingChart from "@/components/dashboard/spending-chart";

export default function DashboardPage() {
  const [transactions, setTransactions] =
    React.useState<Transaction[]>(mockTransactions);
  const [budgets] = React.useState<Budget[]>(mockBudgets);
  const userAvatar = PlaceHolderImages.find(
    (img) => img.id === "user-avatar-1"
  );

  const handleAddTransaction = React.useCallback((newTransaction: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [
      { ...newTransaction, id: `tx_${Date.now()}` },
      ...prev,
    ]);
  }, []);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex items-center gap-2">
          <Wallet className="size-6 text-primary" />
          <h1 className="font-semibold text-xl">PocketFlow</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Dashboard" isActive>
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Budgets">
                <Target />
                Budgets
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Transactions">
                <ArrowLeftRight />
                Transactions
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Reports">
                <PieChart />
                Reports
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex items-center gap-3 px-2 py-4">
            <Avatar className="h-10 w-10">
              {userAvatar && (
                <AvatarImage
                  src={userAvatar.imageUrl}
                  alt={userAvatar.description}
                  width={40}
                  height={40}
                />
              )}
              <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{mockUser.name}</span>
              <span className="text-xs text-muted-foreground">
                {mockUser.email}
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
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
              <RecentTransactions transactions={transactions} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
