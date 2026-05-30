"use client";

import { useState } from "react";
import {
  Calculator,
  Percent,
  TrendingUp,
  Building2,
  Receipt,
  Coins,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  calculateSimpleInterest,
  calculateCompoundInterest,
  calculateLoanAmortization,
  calculateTaxation,
  calculateSIP,
  type SimpleInterestResult,
  type CompoundInterestResult,
  type LoanAmortizationResult,
  type TaxationResult,
  type SIPResult,
} from "@/lib/api";

type CalculatorType = "simple" | "compound" | "loan" | "tax" | "sip";

const calculators = [
  { id: "simple" as const, name: "Simple Interest", icon: Percent },
  { id: "compound" as const, name: "Compound Interest", icon: TrendingUp },
  { id: "loan" as const, name: "Loan EMI", icon: Building2 },
  { id: "tax" as const, name: "Tax Calculator", icon: Receipt },
  { id: "sip" as const, name: "SIP Calculator", icon: Coins },
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

const calcVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export function FinanceCalculators() {
  const [activeCalc, setActiveCalc] = useState<CalculatorType>("simple");
  const [loading, setLoading] = useState(false);

  // Simple Interest
  const [siInputs, setSiInputs] = useState({ principal: "", rate: "", years: "" });
  const [siResult, setSiResult] = useState<SimpleInterestResult | null>(null);

  // Compound Interest
  const [ciInputs, setCiInputs] = useState({ principal: "", rate: "", years: "", frequency: "12" });
  const [ciResult, setCiResult] = useState<CompoundInterestResult | null>(null);

  // Loan
  const [loanInputs, setLoanInputs] = useState({ principal: "", rate: "", months: "" });
  const [loanResult, setLoanResult] = useState<LoanAmortizationResult | null>(null);

  // Tax
  const [taxInputs, setTaxInputs] = useState({ income: "" });
  const [taxResult, setTaxResult] = useState<TaxationResult | null>(null);

  // SIP
  const [sipInputs, setSipInputs] = useState({ monthly: "", rate: "", years: "" });
  const [sipResult, setSipResult] = useState<SIPResult | null>(null);

  const handleSimpleInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await calculateSimpleInterest(
        parseFloat(siInputs.principal),
        parseFloat(siInputs.rate),
        parseFloat(siInputs.years)
      );
      setSiResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompoundInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await calculateCompoundInterest(
        parseFloat(ciInputs.principal),
        parseFloat(ciInputs.rate),
        parseFloat(ciInputs.years),
        parseInt(ciInputs.frequency)
      );
      setCiResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoanCalc = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await calculateLoanAmortization(
        parseFloat(loanInputs.principal),
        parseFloat(loanInputs.rate),
        parseInt(loanInputs.months)
      );
      setLoanResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaxCalc = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await calculateTaxation(parseFloat(taxInputs.income));
      setTaxResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSipCalc = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await calculateSIP(
        parseFloat(sipInputs.monthly),
        parseFloat(sipInputs.rate),
        parseFloat(sipInputs.years)
      );
      setSipResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">Financial Calculators</h1>
        <p className="text-muted-foreground mt-1">
          Calculate interest, EMI, taxes, and investment returns
        </p>
      </motion.div>

      {/* Calculator Tabs */}
      <motion.div 
        className="flex flex-wrap gap-2"
        variants={itemVariants}
      >
        {calculators.map((calc, idx) => (
          <motion.button
            key={calc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCalc(calc.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
              activeCalc === calc.id
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border hover:bg-muted"
            }`}
          >
            <calc.icon className="w-4 h-4" />
            {calc.name}
            {activeCalc === calc.id && (
              <motion.div
                layoutId="activeCalcTab"
                className="absolute inset-0 bg-primary rounded-lg -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Calculator Content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeCalc}
          className="grid gap-6 lg:grid-cols-2"
          variants={calcVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {/* Simple Interest */}
          {activeCalc === "simple" && (
            <>
              <CalcCard
                icon={Percent}
                title="Simple Interest Calculator"
                onSubmit={handleSimpleInterest}
                loading={loading}
                buttonText="Calculate"
              >
                <InputField
                  label="Principal Amount (₹)"
                  value={siInputs.principal}
                  onChange={(v) => setSiInputs({ ...siInputs, principal: v })}
                  placeholder="100000"
                />
                <InputField
                  label="Interest Rate (% per annum)"
                  value={siInputs.rate}
                  onChange={(v) => setSiInputs({ ...siInputs, rate: v })}
                  placeholder="8"
                />
                <InputField
                  label="Time Period (years)"
                  value={siInputs.years}
                  onChange={(v) => setSiInputs({ ...siInputs, years: v })}
                  placeholder="5"
                />
              </CalcCard>
              <ResultCard
                title="Simple Interest Result"
                results={
                  siResult
                    ? [
                        { label: "Interest Earned", value: `₹${siResult.interest_earned.toLocaleString()}` },
                        { label: "Maturity Amount", value: `₹${siResult.total_maturity_amount.toLocaleString()}`, highlight: true },
                      ]
                    : null
                }
              />
            </>
          )}

          {/* Compound Interest */}
          {activeCalc === "compound" && (
            <>
              <CalcCard
                icon={TrendingUp}
                title="Compound Interest Calculator"
                onSubmit={handleCompoundInterest}
                loading={loading}
                buttonText="Calculate"
              >
                <InputField
                  label="Principal Amount (₹)"
                  value={ciInputs.principal}
                  onChange={(v) => setCiInputs({ ...ciInputs, principal: v })}
                  placeholder="100000"
                />
                <InputField
                  label="Interest Rate (% per annum)"
                  value={ciInputs.rate}
                  onChange={(v) => setCiInputs({ ...ciInputs, rate: v })}
                  placeholder="8"
                />
                <InputField
                  label="Time Period (years)"
                  value={ciInputs.years}
                  onChange={(v) => setCiInputs({ ...ciInputs, years: v })}
                  placeholder="5"
                />
                <div>
                  <label className="block text-sm font-medium mb-2">Compounding Frequency</label>
                  <select
                    value={ciInputs.frequency}
                    onChange={(e) => setCiInputs({ ...ciInputs, frequency: e.target.value })}
                    className="w-full px-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  >
                    <option value="1">Yearly</option>
                    <option value="2">Half-Yearly</option>
                    <option value="4">Quarterly</option>
                    <option value="12">Monthly</option>
                  </select>
                </div>
              </CalcCard>
              <ResultCard
                title="Compound Interest Result"
                results={
                  ciResult
                    ? [
                        { label: "Interest Earned", value: `₹${ciResult.interest_earned.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
                        { label: "Maturity Amount", value: `₹${ciResult.total_maturity_amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, highlight: true },
                      ]
                    : null
                }
              />
            </>
          )}

          {/* Loan EMI */}
          {activeCalc === "loan" && (
            <>
              <CalcCard
                icon={Building2}
                title="Loan EMI Calculator"
                onSubmit={handleLoanCalc}
                loading={loading}
                buttonText="Calculate EMI"
              >
                <InputField
                  label="Loan Amount (₹)"
                  value={loanInputs.principal}
                  onChange={(v) => setLoanInputs({ ...loanInputs, principal: v })}
                  placeholder="1000000"
                />
                <InputField
                  label="Interest Rate (% per annum)"
                  value={loanInputs.rate}
                  onChange={(v) => setLoanInputs({ ...loanInputs, rate: v })}
                  placeholder="8.5"
                />
                <InputField
                  label="Loan Tenure (months)"
                  value={loanInputs.months}
                  onChange={(v) => setLoanInputs({ ...loanInputs, months: v })}
                  placeholder="240"
                />
              </CalcCard>
              <motion.div 
                className="bg-card rounded-xl border border-border p-6 shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-semibold mb-4">Loan EMI Result</h3>
                {loanResult ? (
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        className="bg-primary/10 rounded-lg p-4"
                      >
                        <p className="text-sm text-muted-foreground">Monthly EMI</p>
                        <motion.p 
                          className="text-xl font-bold text-primary"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.3 }}
                        >
                          ₹{loanResult.monthly_emi.toLocaleString()}
                        </motion.p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        className="bg-muted/50 rounded-lg p-4"
                      >
                        <p className="text-sm text-muted-foreground">Total Interest</p>
                        <p className="text-xl font-bold">
                          ₹{loanResult.total_interest_payable.toLocaleString()}
                        </p>
                      </motion.div>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-muted/50 rounded-lg p-4"
                    >
                      <p className="text-sm text-muted-foreground">Total Amount Payable</p>
                      <p className="text-xl font-bold">
                        ₹{loanResult.total_amount_payable.toLocaleString()}
                      </p>
                    </motion.div>
                    {loanResult.schedule.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <p className="text-sm font-medium mb-2">First 6 Months Schedule</p>
                        <div className="max-h-48 overflow-y-auto border border-border rounded-lg">
                          <table className="w-full text-sm">
                            <thead className="bg-muted sticky top-0">
                              <tr>
                                <th className="p-2 text-left">Month</th>
                                <th className="p-2 text-right">Principal</th>
                                <th className="p-2 text-right">Interest</th>
                                <th className="p-2 text-right">Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {loanResult.schedule.slice(0, 6).map((row, idx) => (
                                <motion.tr 
                                  key={row.month} 
                                  className="border-t border-border"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.5 + idx * 0.05 }}
                                >
                                  <td className="p-2">{row.month}</td>
                                  <td className="p-2 text-right">₹{row.principal_paid.toLocaleString()}</td>
                                  <td className="p-2 text-right">₹{row.interest_paid.toLocaleString()}</td>
                                  <td className="p-2 text-right">₹{row.remaining_principal.toLocaleString()}</td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <EmptyResult />
                )}
              </motion.div>
            </>
          )}

          {/* Tax Calculator */}
          {activeCalc === "tax" && (
            <>
              <CalcCard
                icon={Receipt}
                title="Income Tax Calculator"
                onSubmit={handleTaxCalc}
                loading={loading}
                buttonText="Calculate Tax"
              >
                <InputField
                  label="Annual Income (₹)"
                  value={taxInputs.income}
                  onChange={(v) => setTaxInputs({ ...taxInputs, income: v })}
                  placeholder="1500000"
                />
                <p className="text-sm text-muted-foreground">
                  Based on Indian new tax regime slabs
                </p>
              </CalcCard>
              <motion.div 
                className="bg-card rounded-xl border border-border p-6 shadow-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-semibold mb-4">Tax Calculation Result</h3>
                {taxResult ? (
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-primary/10 rounded-lg p-4"
                    >
                      <p className="text-sm text-muted-foreground">Total Tax Payable</p>
                      <motion.p 
                        className="text-2xl font-bold text-primary"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                      >
                        ₹{taxResult.total_tax_payable.toLocaleString()}
                      </motion.p>
                    </motion.div>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        className="bg-muted/50 rounded-lg p-4"
                      >
                        <p className="text-sm text-muted-foreground">Base Tax</p>
                        <p className="text-lg font-bold">₹{taxResult.base_tax.toLocaleString()}</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        className="bg-muted/50 rounded-lg p-4"
                      >
                        <p className="text-sm text-muted-foreground">Surcharge</p>
                        <p className="text-lg font-bold">₹{taxResult.surcharge.toLocaleString()}</p>
                      </motion.div>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-muted/50 rounded-lg p-4"
                    >
                      <p className="text-sm text-muted-foreground">Health & Education Cess (4%)</p>
                      <p className="text-lg font-bold">₹{taxResult.cess_health_education.toLocaleString()}</p>
                    </motion.div>
                    {taxResult.breakdown_slabs.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="text-sm font-medium mb-2">Slab Breakdown</p>
                        <div className="space-y-2">
                          {taxResult.breakdown_slabs.map((slab, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + idx * 0.05 }}
                              whileHover={{ x: 4 }}
                              className="flex justify-between items-center p-2 bg-muted/50 rounded-lg text-sm"
                            >
                              <span>{slab.slab}</span>
                              <span className="font-medium">₹{slab.tax.toLocaleString()}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <EmptyResult />
                )}
              </motion.div>
            </>
          )}

          {/* SIP Calculator */}
          {activeCalc === "sip" && (
            <>
              <CalcCard
                icon={Coins}
                title="SIP Calculator"
                onSubmit={handleSipCalc}
                loading={loading}
                buttonText="Calculate Returns"
              >
                <InputField
                  label="Monthly Investment (₹)"
                  value={sipInputs.monthly}
                  onChange={(v) => setSipInputs({ ...sipInputs, monthly: v })}
                  placeholder="10000"
                />
                <InputField
                  label="Expected Return Rate (% per annum)"
                  value={sipInputs.rate}
                  onChange={(v) => setSipInputs({ ...sipInputs, rate: v })}
                  placeholder="12"
                />
                <InputField
                  label="Investment Period (years)"
                  value={sipInputs.years}
                  onChange={(v) => setSipInputs({ ...sipInputs, years: v })}
                  placeholder="10"
                />
              </CalcCard>
              <ResultCard
                title="SIP Returns"
                results={
                  sipResult
                    ? [
                        { label: "Total Invested", value: `₹${sipResult.total_invested.toLocaleString()}` },
                        { label: "Wealth Gained", value: `₹${sipResult.wealth_gained.toLocaleString()}`, highlight: true },
                        { label: "Maturity Value", value: `₹${sipResult.maturity_value.toLocaleString()}` },
                      ]
                    : null
                }
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function CalcCard({
  icon: Icon,
  title,
  onSubmit,
  loading,
  buttonText,
  children,
}: {
  icon: React.ElementType;
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  buttonText: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div 
      className="bg-card rounded-xl border border-border p-6 shadow-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
        >
          <Icon className="w-5 h-5 text-primary" />
        </motion.div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              Calculating...
            </motion.span>
          ) : (
            buttonText
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
      />
    </motion.div>
  );
}

function ResultCard({
  title,
  results,
}: {
  title: string;
  results: { label: string; value: string; highlight?: boolean }[] | null;
}) {
  return (
    <motion.div 
      className="bg-card rounded-xl border border-border p-6 shadow-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="font-semibold mb-4">{title}</h3>
      <AnimatePresence mode="wait">
        {results ? (
          <motion.div 
            key="results"
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {results.map((r, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className={`p-4 rounded-lg ${r.highlight ? "bg-primary/10" : "bg-muted/50"}`}
              >
                <p className="text-sm text-muted-foreground">{r.label}</p>
                <motion.p 
                  className={`text-xl font-bold ${r.highlight ? "text-primary" : ""}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: idx * 0.1 + 0.1 }}
                >
                  {r.value}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyResult key="empty" />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EmptyResult() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-48 flex flex-col items-center justify-center text-muted-foreground"
    >
      <motion.div
        animate={{ 
          y: [0, -5, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <Calculator className="w-12 h-12 mb-3 opacity-50" />
      </motion.div>
      <p>Enter values and click calculate</p>
    </motion.div>
  );
}
