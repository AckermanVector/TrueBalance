"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Filter, Receipt, X } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  addExpense,
  getAllExpenses,
  CATEGORIES,
  type Expense,
  type Category,
} from "@/lib/api";

const COLORS = [
  "oklch(0.55 0.18 155)",
  "oklch(0.60 0.12 200)",
  "oklch(0.65 0.15 280)",
  "oklch(0.70 0.12 45)",
  "oklch(0.55 0.15 330)",
  "oklch(0.60 0.10 100)",
  "oklch(0.50 0.12 240)",
];

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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: { duration: 0.2 }
  },
};

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  
  const [formData, setFormData] = useState({
    category: "Food" as Category,
    amount: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    try {
      const data = await getAllExpenses();
      setExpenses(data);
    } catch {
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) return;

    setSubmitting(true);
    try {
      await addExpense(formData.category, parseFloat(formData.amount));
      setFormData({ category: "Food", amount: "" });
      setShowForm(false);
      await fetchExpenses();
    } catch (error) {
      console.error("Failed to add expense:", error);
    } finally {
      setSubmitting(false);
    }
  }

  const filteredExpenses = useMemo(() => {
    if (filterCategory === "All") return expenses;
    return expenses.filter((e) => e.Category === filterCategory);
  }, [expenses, filterCategory]);

  const categoryData = useMemo(() => {
    const byCategory = filteredExpenses.reduce((acc, e) => {
      acc[e.Category] = (acc[e.Category] || 0) + e.Amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(byCategory).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredExpenses]);

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.Amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Track and categorize your spending
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </motion.button>
      </motion.div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-xl border border-border shadow-lg w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Add New Expense</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowForm(false)}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as Category })
                    }
                    className="w-full px-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="Enter amount"
                    className="w-full px-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  />
                </motion.div>
                <motion.div 
                  className="flex gap-3 pt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={submitting || !formData.amount}
                    className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        Adding...
                      </motion.span>
                    ) : (
                      "Add Expense"
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter & Stats */}
      <motion.div 
        className="grid gap-4 md:grid-cols-3"
        variants={containerVariants}
      >
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-card rounded-xl border border-border p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter by Category</span>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm transition-shadow"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-card rounded-xl border border-border p-4 shadow-sm"
        >
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <motion.p 
            className="text-2xl font-bold mt-1"
            key={totalFiltered}
            initial={{ scale: 1.2, color: "oklch(0.55 0.18 155)" }}
            animate={{ scale: 1, color: "inherit" }}
            transition={{ type: "spring" }}
          >
            ₹{totalFiltered.toLocaleString()}
          </motion.p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          className="bg-card rounded-xl border border-border p-4 shadow-sm"
        >
          <p className="text-sm text-muted-foreground">Transactions</p>
          <motion.p 
            className="text-2xl font-bold mt-1"
            key={filteredExpenses.length}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            {filteredExpenses.length}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Chart & List */}
      <motion.div 
        className="grid gap-6 lg:grid-cols-2"
        variants={containerVariants}
      >
        {/* Pie Chart */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="bg-card rounded-xl border border-border p-6 shadow-sm"
        >
          <h3 className="font-semibold mb-4">Category Breakdown</h3>
          {categoryData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, "Amount"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <motion.div 
                className="flex flex-wrap justify-center gap-3 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {categoryData.map((item, index) => (
                  <motion.div 
                    key={item.name} 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-muted-foreground">
              No data to display
            </div>
          )}
        </motion.div>

        {/* Expense List */}
        <motion.div 
          variants={itemVariants}
          className="bg-card rounded-xl border border-border p-6 shadow-sm"
        >
          <h3 className="font-semibold mb-4">Expense History</h3>
          {filteredExpenses.length > 0 ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              <AnimatePresence>
                {filteredExpenses
                  .slice()
                  .reverse()
                  .map((expense, idx) => (
                    <motion.div
                      key={expense.Id || idx}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.03 }}
                      whileHover={{ 
                        scale: 1.02, 
                        backgroundColor: "rgba(0,0,0,0.02)",
                      }}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-default"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div 
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
                        >
                          <Receipt className="w-5 h-5 text-primary" />
                        </motion.div>
                        <div>
                          <p className="font-medium">{expense.Category}</p>
                          <p className="text-xs text-muted-foreground">
                            {expense.Date} • {expense.Month}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">₹{expense.Amount.toLocaleString()}</p>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-72 flex flex-col items-center justify-center text-muted-foreground"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Receipt className="w-12 h-12 mb-3 opacity-50" />
              </motion.div>
              <p>No expenses recorded</p>
              <p className="text-sm">Add your first expense to get started</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
