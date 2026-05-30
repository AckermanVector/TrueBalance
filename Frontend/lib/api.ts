export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const CATEGORIES = ["Food", "Transport", "Household", "Education", "Health", "Utilities", "Other"] as const;
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

export type Category = typeof CATEGORIES[number];
export type Month = typeof MONTHS[number];

export interface Expense {
  Date: string;
  Month: string;
  Category: string;
  Amount: number;
  Id: string;
}

export interface BudgetCheck {
  month: string;
  budget_limit: number;
  actual_expense: number;
  remaining_balance: number;
  status_code: 'under' | 'over' | 'exact';
  message: string;
}

export interface SimpleInterestResult {
  interest_earned: number;
  total_maturity_amount: number;
}

export interface CompoundInterestResult {
  interest_earned: number;
  total_maturity_amount: number;
}

export interface AmortizationScheduleItem {
  month: number;
  emi: number;
  principal_paid: number;
  interest_paid: number;
  remaining_principal: number;
}

export interface LoanAmortizationResult {
  monthly_emi: number;
  total_amount_payable: number;
  total_interest_payable: number;
  schedule: AmortizationScheduleItem[];
}

export interface TaxationResult {
  base_tax: number;
  surcharge: number;
  cess_health_education: number;
  total_tax_payable: number;
  breakdown_slabs: { slab: string; tax: number }[];
}

export interface SIPResult {
  total_invested: number;
  maturity_value: number;
  wealth_gained: number;
}

// Expense APIs
export async function addExpense(category: Category, amount: number) {
  const formData = new FormData();
  formData.append('category_name', category);
  formData.append('amount', amount.toString());
  
  const res = await fetch(`${API_BASE_URL}/api/expenses`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to add expense');
  return res.json();
}

export async function getAllExpenses(): Promise<Expense[]> {
  const res = await fetch(`${API_BASE_URL}/api/expenses`);
  if (!res.ok) throw new Error('Failed to fetch expenses');
  return res.json();
}

export async function getExpensesByCategory(category: Category) {
  const res = await fetch(`${API_BASE_URL}/api/expenses/category/${category}`);
  if (!res.ok) throw new Error('Failed to fetch category expenses');
  return res.json();
}

// Budget APIs
export async function setBudget(monthIndex: number, budget: number) {
  const formData = new FormData();
  formData.append('month_idx', monthIndex.toString());
  formData.append('budget', budget.toString());
  
  const res = await fetch(`${API_BASE_URL}/api/budgets`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to set budget');
  return res.json();
}

export async function checkBudget(month: Month): Promise<BudgetCheck> {
  const res = await fetch(`${API_BASE_URL}/api/budgets/check/${month}`);
  if (!res.ok) throw new Error('Failed to check budget');
  return res.json();
}

// Calculator APIs
export async function calculateSimpleInterest(principal: number, rate: number, years: number): Promise<SimpleInterestResult> {
  const formData = new FormData();
  formData.append('principal', principal.toString());
  formData.append('rate', rate.toString());
  formData.append('years', years.toString());
  
  const res = await fetch(`${API_BASE_URL}/api/calculator/simple-interest`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to calculate');
  return res.json();
}

export async function calculateCompoundInterest(principal: number, rate: number, years: number, frequency: number): Promise<CompoundInterestResult> {
  const formData = new FormData();
  formData.append('principal', principal.toString());
  formData.append('rate', rate.toString());
  formData.append('years', years.toString());
  formData.append('frequency', frequency.toString());
  
  const res = await fetch(`${API_BASE_URL}/api/calculator/compound-interest`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to calculate');
  return res.json();
}

export async function calculateLoanAmortization(principal: number, rate: number, months: number): Promise<LoanAmortizationResult> {
  const formData = new FormData();
  formData.append('principal', principal.toString());
  formData.append('rate', rate.toString());
  formData.append('months_len', months.toString());
  
  const res = await fetch(`${API_BASE_URL}/api/calculator/loan-amortization`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to calculate');
  return res.json();
}

export async function calculateTaxation(income: number): Promise<TaxationResult> {
  const formData = new FormData();
  formData.append('income', income.toString());
  
  const res = await fetch(`${API_BASE_URL}/api/calculator/taxation`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to calculate');
  return res.json();
}

export async function calculateSIP(monthlyAmount: number, annualRate: number, years: number): Promise<SIPResult> {
  const formData = new FormData();
  formData.append('principal_monthly', monthlyAmount.toString());
  formData.append('annual_rate', annualRate.toString());
  formData.append('years', years.toString());
  
  const res = await fetch(`${API_BASE_URL}/api/calculator/sip`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to calculate');
  return res.json();
}
