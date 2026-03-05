"use client";

import * as React from "react";
import {
  ArrowLeftRight,
  LayoutDashboard,
  PieChart,
  Settings,
  Target,
  Wallet,
} from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarProvider, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { mockUser, mockBudgets, mockTransactions } from "@/lib/data";
import { SettingsDialog } from "@/components/settings-dialog";
import BudgetProgress from "@/components/dashboard/budget-progress";

export default function BudgetsPage() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find(
    (img) => img.id === "user-avatar-1"
  );
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

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
              <Link href="/">
                <SidebarMenuButton tooltip="Dashboard" isActive={pathname === '/'}>
                  <LayoutDashboard />
                  Dashboard
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/budgets">
                <SidebarMenuButton tooltip="Budgets" isActive={pathname === '/budgets'}>
                  <Target />
                  Budgets
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/transactions">
                <SidebarMenuButton tooltip="Transactions" isActive={pathname === '/transactions'}>
                  <ArrowLeftRight />
                  Transactions
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/reports">
                <SidebarMenuButton tooltip="Reports" isActive={pathname === '/reports'}>
                  <PieChart />
                  Reports
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings" onClick={() => setIsSettingsOpen(true)}>
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
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-10">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Budgets</h1>
          </div>
        </header>
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <BudgetProgress budgets={mockBudgets} transactions={mockTransactions} />
        </main>
      </SidebarInset>
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </SidebarProvider>
  );
}
