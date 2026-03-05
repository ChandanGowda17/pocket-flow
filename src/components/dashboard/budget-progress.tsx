"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Budget, Transaction } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BudgetProgressProps {
  budgets: Budget[];
  transactions: Transaction[];
}

export default function BudgetProgress({
  budgets,
  transactions,
}: BudgetProgressProps) {
  const getCategorySpending = (category: string) => {
    return transactions
      .filter(
        (t) => t.category === category && t.type === "expense"
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Progress</CardTitle>
        <CardDescription>Your spending vs. your monthly goals.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <div className="space-y-6 pr-4">
            {budgets.map((budget) => {
              const spent = getCategorySpending(budget.category);
              const progress = (spent / budget.amount) * 100;
              const isOverBudget = spent > budget.amount;

              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <p className="font-medium">{budget.category}</p>
                    <p className={`text-sm ${isOverBudget ? "text-destructive" : "text-muted-foreground"}`}>
                      {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                    </p>
                  </div>
                   <Progress value={Math.min(progress, 100)} className={isOverBudget ? "[&>div]:bg-destructive" : ""} />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
