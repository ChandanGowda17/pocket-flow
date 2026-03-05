"use client";

import * as React from "react";
import { ArrowDownCircle, ArrowUpCircle, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Transaction } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

interface FinancialOverviewProps {
  transactions: Transaction[];
}

export default function FinancialOverview({
  transactions,
}: FinancialOverviewProps) {
  const { income, expenses, balance } = React.useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    return { income, expenses, balance };
  }, [transactions]);

  const overviewCards = [
    {
      title: "Balance",
      amount: balance,
      icon: DollarSign,
    },
    {
      title: "Income",
      amount: income,
      icon: ArrowUpCircle,
    },
    {
      title: "Expenses",
      amount: expenses,
      icon: ArrowDownCircle,
    },
  ];

  return (
    <>
      {overviewCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(card.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total this month
            </p>
          </CardContent>
        </Card>
      ))}
      {/* This is a placeholder for the 4th grid item */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">
                75%
            </div>
            <p className="text-xs text-muted-foreground">
                Reached of {formatCurrency(5000)} goal
            </p>
        </CardContent>
      </Card>
    </>
  );
}
