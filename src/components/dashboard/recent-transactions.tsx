"use client";

import {
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface RecentTransactionsProps {
  transactions: Transaction[];
  limit?: number;
}

export default function RecentTransactions({
  transactions,
  limit,
}: RecentTransactionsProps) {
  const transactionsToShow = limit ? transactions.slice(0, limit) : transactions;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{limit ? 'Recent Transactions' : 'All Transactions'}</CardTitle>
        <CardDescription>
          {limit
            ? "Here's a list of your most recent expenses and income."
            : "A complete list of your expenses and income."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Date</TableHead>
              <TableHead className="hidden md:table-cell text-right">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionsToShow.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {transaction.type === "income" ? (
                      <span className="p-1.5 bg-primary/10 rounded-full">
                        <ArrowUpCircle className="h-5 w-5 text-primary" />
                      </span>
                    ) : (
                      <span className="p-1.5 bg-destructive/10 rounded-full">
                        <ArrowDownCircle className="h-5 w-5 text-destructive" />
                      </span>
                    )}
                    <div className="font-medium">{transaction.description}</div>
                  </div>
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    transaction.type === "income"
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-right text-muted-foreground">
                  {format(transaction.date, "LLL dd, yyyy")}
                </TableCell>
                <TableCell className="hidden md:table-cell text-right">
                  <Badge variant="outline">{transaction.category}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
