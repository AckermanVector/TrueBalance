"use client";

import { useState, useEffect } from "react";
import { PiggyBank, AlertTriangle, CheckCircle, TrendingUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { setBudget, checkBudget, MONTHS, type Month } from "@/lib/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export function BudgetManager() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [budgetStatus, setBudgetStatus] = useState<{
    month: string;
    budget_limit: number;
    actual_expense: number;
    remaining_balance: number;
    status_code: "under" | "over" | "exact";
    message: string;
  } | null>(null);

  const currentMonthName = MONTHS[selectedMonth - 1] as Month;

  useEffect(() => {
    fetchBudgetStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  async function fetchBudgetStatus() {
    setLoading(true);
    try {
      const data = await checkBudget(currentMonthName);
      setBudgetStatus(data);
      if (data.budget_limit > 0) {
        setBudgetAmount(data.budget_limit.toString());
      }
    } catch {
      setBudgetStatus(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSetBudget(e: React.FormEvent) {
    e.preventDefault();
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) return;

    setSubmitting(true);
    try {
      await setBudget(selectedMonth, parseFloat(budgetAmount));
      await fetchBudgetStatus();
    } catch (error) {
      console.error("Failed to set budget:", error);
    } finally {
      setSubmitting(false);
    }
  }

  const progressPercentage = budgetStatus
    ? Math.min((budgetStatus.actual_expense / budgetStatus.budget_limit) * 100, 100)
    : 0;

  const getStatusColor = () => {
    if (!budgetStatus) return "bg-muted";
    if (budgetStatus.status_code === "over") return "bg-destructive";
    if (budgetStatus.status_code === "exact") return "bg-chart-4";
    if (progressPercentage > 80) return "bg-chart-4";
    return "bg-primary";
  };

  const getStatusIcon = () => {
    if (!budgetStatus) return TrendingUp;
    if (budgetStatus.status_code === "over") return AlertTriangle;
    return CheckCircle;
  };

  const StatusIcon = getStatusIcon();

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Budget Manager</h1>
        <p className="text-muted-foreground mt-1">
          Set monthly budgets and track your spending limits
        </p>
      </motion.div>

      {/* Month Selector & Budget Form */}
      <motion.div 
        className="grid gap-6 lg:grid-cols-2"
        variants={containerVariants}
      >
        {/* Set Budget */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="bg-card rounded-xl border border-border p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
            >
              <PiggyBank className="w-5 h-5 text-primary" />
            </motion.div>
            <h2 className="text-lg font-semibold">Set Monthly Budget</h2>
          </div>

          <form onSubmit={handleSetBudget} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium mb-2">Select Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              >
                {MONTHS.map((month, idx) => (
                  <option key={month} value={idx + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium mb-2">Budget Amount (₹)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="Enter budget amount"
                className="w-full px-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitting || !budgetAmount}
              className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  Saving...
                </motion.span>
              ) : (
                "Set Budget"
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Budget Status */}
        <motion.div 
          variants={itemVariants}
          className="bg-card rounded-xl border border-border p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={budgetStatus?.status_code === "over" ? { 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              } : {}}
              transition={{ repeat: budgetStatus?.status_code === "over" ? Infinity : 0, duration: 2 }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                budgetStatus?.status_code === "over"
                  ? "bg-destructive/10"
                  : "bg-primary/10"
              }`}
            >
              <StatusIcon
                className={`w-5 h-5 ${
                  budgetStatus?.status_code === "over"
                    ? "text-destructive"
                    : "text-primary"
                }`}
              />
            </motion.div>
            <h2 className="text-lg font-semibold">Budget Status for {currentMonthName}</h2>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-48"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                />
              </motion.div>
            ) : budgetStatus && budgetStatus.budget_limit > 0 ? (
              <motion.div 
                key="status"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Spent</span>
                    <motion.span 
                      className="font-medium"
                      key={budgetStatus.actual_expense}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      ₹{budgetStatus.actual_expense.toLocaleString()} / ₹
                      {budgetStatus.budget_limit.toLocaleString()}
                    </motion.span>
                  </div>
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${getStatusColor()}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <motion.p 
                    className="text-sm text-muted-foreground mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {progressPercentage.toFixed(1)}% of budget used
                  </motion.p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    className="bg-muted/50 rounded-lg p-4"
                  >
                    <p className="text-sm text-muted-foreground">Budget Set</p>
                    <p className="text-xl font-bold">
                      ₹{budgetStatus.budget_limit.toLocaleString()}
                    </p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.03 }}
                    className="bg-muted/50 rounded-lg p-4"
                  >
                    <p className="text-sm text-muted-foreground">Actual Spent</p>
                    <p className="text-xl font-bold">
                      ₹{budgetStatus.actual_expense.toLocaleString()}
                    </p>
                  </motion.div>
                </div>

                {/* Status Message */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`p-4 rounded-lg ${
                    budgetStatus.status_code === "over"
                      ? "bg-destructive/10 border border-destructive/20"
                      : budgetStatus.status_code === "exact"
                      ? "bg-chart-4/10 border border-chart-4/20"
                      : "bg-primary/10 border border-primary/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={budgetStatus.status_code === "under" ? {
                        scale: [1, 1.2, 1],
                      } : {}}
                      transition={{ repeat: budgetStatus.status_code === "under" ? 3 : 0, duration: 0.5 }}
                    >
                      <StatusIcon
                        className={`w-5 h-5 mt-0.5 ${
                          budgetStatus.status_code === "over"
                            ? "text-destructive"
                            : budgetStatus.status_code === "exact"
                            ? "text-chart-4"
                            : "text-primary"
                        }`}
                      />
                    </motion.div>
                    <div>
                      <p className="font-medium">
                        {budgetStatus.status_code === "over"
                          ? "Over Budget!"
                          : budgetStatus.status_code === "exact"
                          ? "Exactly on Budget"
                          : "Within Budget"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {budgetStatus.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-48 flex flex-col items-center justify-center text-muted-foreground"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <PiggyBank className="w-12 h-12 mb-3 opacity-50" />
                </motion.div>
                <p>No budget set for {currentMonthName}</p>
                <p className="text-sm">Set a budget to start tracking</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Quick Tips */}
      <motion.div 
        variants={itemVariants}
        className="bg-card rounded-xl border border-border p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Budgeting Tips</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "50/30/20 Rule", desc: "Allocate 50% for needs, 30% for wants, and 20% for savings" },
            { title: "Track Daily", desc: "Record expenses daily to avoid missing any transactions" },
            { title: "Review Weekly", desc: "Check your budget status weekly to stay on track" },
          ].map((tip, idx) => (
            <motion.div 
              key={tip.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="p-4 bg-muted/50 rounded-lg cursor-default"
            >
              <p className="font-medium">{tip.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {tip.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
