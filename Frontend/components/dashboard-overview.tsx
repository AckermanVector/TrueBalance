"use client";

import { useEffect, useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { getAllExpenses, checkBudget, MONTHS, type Expense } from "@/lib/api";

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

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  index?: number;
}

function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue, index = 0 }: StatCardProps) {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 10px 40px -15px rgba(0, 0, 0, 0.1)" 
      }}
      transition={{ type: "spring", stiffness: 400 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm cursor-default"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <motion.p 
            className="text-2xl font-bold mt-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
        >
          <Icon className="w-5 h-5 text-primary" />
        </motion.div>
      </div>
      {trend && trendValue && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-1 mt-3"
        >
          {trend === "up" ? (
            <ArrowUpRight className="w-4 h-4 text-primary" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-destructive" />
          )}
          <span
            className={`text-sm font-medium ${
              trend === "up" ? "text-primary" : "text-destructive"
            }`}
          >
            {trendValue}
          </span>
          <span className="text-sm text-muted-foreground">vs last month</span>
        </motion.div>
      )}
    </motion.div>
  );
}

function AnimatedCounter({ value, duration = 1 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}

export function DashboardOverview() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetStatus, setBudgetStatus] = useState<{
    budget: number;
    spent: number;
    remaining: number;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const currentMonth = MONTHS[new Date().getMonth()];

  useEffect(() => {
    async function fetchData() {
      try {
        const [expenseData, budgetData] = await Promise.all([
          getAllExpenses(),
          checkBudget(currentMonth),
        ]);
        setExpenses(expenseData);
        setBudgetStatus({
          budget: budgetData.budget_limit,
          spent: budgetData.actual_expense,
          remaining: budgetData.remaining_balance,
          status: budgetData.status_code,
        });
      } catch {
        setExpenses([]);
        setBudgetStatus(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentMonth]);

  const { totalExpenses, categoryData, monthlyData } = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + e.Amount, 0);
    
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.Category] = (acc[e.Category] || 0) + e.Amount;
      return acc;
    }, {} as Record<string, number>);

    const categoryChartData = Object.entries(byCategory).map(([name, value]) => ({
      name,
      value,
    }));

    const byMonth = expenses.reduce((acc, e) => {
      acc[e.Month] = (acc[e.Month] || 0) + e.Amount;
      return acc;
    }, {} as Record<string, number>);

    const monthlyChartData = MONTHS.map((month) => ({
      name: month,
      amount: byMonth[month] || 0,
    }));

    return {
      totalExpenses: total,
      categoryData: categoryChartData,
      monthlyData: monthlyChartData,
    };
  }, [expenses]);

  const currentMonthExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.Month === currentMonth)
      .reduce((sum, e) => sum + e.Amount, 0);
  }, [expenses, currentMonth]);

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
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-balance">Welcome Back</h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your financial overview for {currentMonth}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        <StatCard
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString()}`}
          subtitle="All time"
          icon={Wallet}
          index={0}
        />
        <StatCard
          title="This Month"
          value={`₹${currentMonthExpenses.toLocaleString()}`}
          subtitle={currentMonth}
          icon={TrendingUp}
          index={1}
        />
        <StatCard
          title="Budget Set"
          value={budgetStatus ? `₹${budgetStatus.budget.toLocaleString()}` : "Not Set"}
          subtitle={currentMonth}
          icon={Target}
          index={2}
        />
        <StatCard
          title="Remaining"
          value={
            budgetStatus
              ? `₹${Math.abs(budgetStatus.remaining).toLocaleString()}`
              : "-"
          }
          subtitle={budgetStatus?.status === "over" ? "Over budget" : "Within budget"}
          icon={budgetStatus?.status === "over" ? TrendingDown : TrendingUp}
          index={3}
        />
      </motion.div>

      {/* Charts */}
      <motion.div 
        className="grid gap-6 lg:grid-cols-2"
        variants={containerVariants}
      >
        {/* Category Breakdown */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="bg-card rounded-xl border border-border p-6 shadow-sm"
        >
          <h3 className="font-semibold mb-4">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                    animationBegin={200}
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
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No expense data yet
            </div>
          )}
        </motion.div>

        {/* Monthly Trend */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="bg-card rounded-xl border border-border p-6 shadow-sm"
        >
          <h3 className="font-semibold mb-4">Monthly Spending Trend</h3>
          {monthlyData.some((d) => d.amount > 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, "Spent"]}
                  />
                  <Bar
                    dataKey="amount"
                    fill="oklch(0.55 0.18 155)"
                    radius={[4, 4, 0, 0]}
                    animationBegin={400}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No expense data yet
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Recent Expenses */}
      <motion.div 
        variants={itemVariants}
        className="bg-card rounded-xl border border-border p-6 shadow-sm"
      >
        <h3 className="font-semibold mb-4">Recent Expenses</h3>
        {expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.slice(-5).reverse().map((expense, idx) => (
              <motion.div
                key={expense.Id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ 
                  x: 4, 
                  backgroundColor: "rgba(0,0,0,0.02)",
                  transition: { duration: 0.2 }
                }}
                className="flex items-center justify-between py-3 px-2 rounded-lg border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium">{expense.Category}</p>
                  <p className="text-sm text-muted-foreground">{expense.Date}</p>
                </div>
                <motion.p 
                  className="font-semibold text-destructive"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 + 0.2, type: "spring" }}
                >
                  -₹{expense.Amount.toLocaleString()}
                </motion.p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No expenses recorded yet. Add your first expense!
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
