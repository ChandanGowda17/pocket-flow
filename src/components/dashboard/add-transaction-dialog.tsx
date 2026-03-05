"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDebounce } from "@/hooks/use-debounce";
import { aiCategorizeTransaction } from "@/ai/flows/ai-categorize-transaction";
import { categories, Transaction } from "@/lib/data";

const formSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters."),
  amount: z.coerce
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be positive."),
  type: z.enum(["expense", "income"], {
    required_error: "You need to select a transaction type.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTransactionDialogProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  transactions: Transaction[];
}

export default function AddTransactionDialog({
  onAddTransaction,
  transactions,
}: AddTransactionDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isCategorizing, setIsCategorizing] = React.useState(false);
  const [suggestedCategory, setSuggestedCategory] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      date: new Date(),
    },
  });

  const descriptionWatch = form.watch("description");
  const debouncedDescription = useDebounce(descriptionWatch, 500);

  const pastTransactionsForAI = React.useMemo(() => 
    transactions.map(({ description, category }) => ({ description, category })),
    [transactions]
  );
  
  React.useEffect(() => {
    async function getCategorySuggestion() {
      if (debouncedDescription && debouncedDescription.length > 5) {
        setIsCategorizing(true);
        setSuggestedCategory(null);
        try {
          const result = await aiCategorizeTransaction({
            description: debouncedDescription,
            pastTransactions: pastTransactionsForAI,
          });
          if (result.suggestedCategory) {
            setSuggestedCategory(result.suggestedCategory);
            form.setValue("category", result.suggestedCategory, {
              shouldValidate: true,
            });
          }
        } catch (error) {
          console.error("AI categorization failed:", error);
        } finally {
          setIsCategorizing(false);
        }
      }
    }
    getCategorySuggestion();
  }, [debouncedDescription, form, pastTransactionsForAI]);

  const allCategories = React.useMemo(() => {
    const combined = new Set(categories);
    if(suggestedCategory) combined.add(suggestedCategory);
    return Array.from(combined);
  }, [suggestedCategory]);

  function onSubmit(data: FormValues) {
    onAddTransaction(data);
    form.reset();
    setSuggestedCategory(null);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Enter the details of your expense or income.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expense" />
                        </FormControl>
                        <FormLabel className="font-normal">Expense</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="income" />
                        </FormControl>
                        <FormLabel className="font-normal">Income</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Weekly groceries" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel className="flex items-center">
                      Category
                      {isCategorizing && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                      {suggestedCategory && !isCategorizing && <Sparkles className="ml-2 h-4 w-4 text-primary" />}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                             <div className="flex items-center">
                              {category}
                              {category === suggestedCategory && (
                                <span className="text-xs text-primary ml-2">(AI)</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="submit">Add Transaction</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
