from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
import csv
import os
import math
import time

app = FastAPI(title="TrueBalance API Backend")

# Enable CORS so your frontend tool can securely connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CATEGORIES = ["Food", "Transport", "Household", "Education", "Health", "Utilities", "Other"]
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

# ═══════════════════════════════════════════════════════════════
# 1. EXPENSE TRACKER MODULE (Preserving your exact CSV structures)
# ═══════════════════════════════════════════════════════════════

def get_monthly_expense_logic(month_name: str) -> float:
    """Preserves your exact logic from ExpenseTracker.get_monthly_expense"""
    total_expense = 0
    if os.path.isfile("Expenses.csv"):
        with open("Expenses.csv", 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['Month'] == month_name:
                    total_expense += float(row['Amount'])
    return total_expense

@app.post("/api/expenses")
async def add_expense_endpoint(category_name: str = Form(...), amount: float = Form(...)):
    """Replaces your interactive select_category() command line input"""
    if category_name not in CATEGORIES:
        raise HTTPException(status_code=400, detail=f"Invalid category. Must be one of {CATEGORIES}")
    
    date_today = date.today()
    month_today = date_today.month
    month_string = MONTHS[month_today - 1].capitalize() # Preserves your .capitalize() logic

    file_exists = os.path.isfile("Expenses.csv")
    
    with open("Expenses.csv", "a", newline="") as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(["Date", "Month", "Category", "Amount", "Id"])
        # Adding a unique ID so the frontend can easily list and map rows
        writer.writerow([date_today, month_string, category_name, amount, int(time.time() * 1000)])
        
    return {
        "status": "success", 
        "message": f"Expense Spent on {category_name} : {amount}",
        "data": {"date": str(date_today), "month": month_string, "category": category_name, "amount": amount}
    }

@app.get("/api/expenses")
async def get_all_expenses():
    """Reads your Expenses.csv structure and converts it into JSON for charts/tables"""
    if not os.path.isfile("Expenses.csv"):
        return []
    expenses = []
    with open("Expenses.csv", 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            row['Amount'] = float(row['Amount'])
            expenses.append(row)
    return expenses

@app.get("/api/expenses/category/{cat_name}")
async def see_desired_expense_endpoint(cat_name: str):
    """Replaces see_desired_expense() filtering logic"""
    if cat_name not in CATEGORIES:
        raise HTTPException(status_code=400, detail="Category not found")
        
    filtered = []
    total_category = 0.0
    if os.path.isfile("Expenses.csv"):
        with open("Expenses.csv", 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['Category'] == cat_name:
                    amt = float(row['Amount'])
                    total_category += amt
                    filtered.append(row)
    return {"category": cat_name, "total_spent": total_category, "records": filtered}


# ═══════════════════════════════════════════════════════════════
# 2. BUDGET TRACKER MODULE
# ═══════════════════════════════════════════════════════════════

@app.post("/api/budgets")
async def set_budget_endpoint(month_idx: int = Form(...), budget: float = Form(...)):
    """Replaces your interactive terminal set_budget() function"""
    if month_idx < 1 or month_idx > 12:
        raise HTTPException(status_code=400, detail="Month index must be between 1 and 12")
        
    month_name = MONTHS[month_idx - 1]
    rows = []
    file_exists = os.path.isfile("Budget.csv")
    
    if file_exists:
        with open("Budget.csv", 'r') as file:
            reader = csv.DictReader(file)
            rows = list(reader)

    updated = False
    for row in rows:
        if row['Month'] == month_name:
            row['Budget'] = str(budget)
            updated = True
            break

    if not updated:
        rows.append({'Month': month_name, 'Budget': str(budget)})
        
    with open("Budget.csv", 'w', newline="") as file:
        writer = csv.DictWriter(file, fieldnames=["Month", "Budget"])
        writer.writeheader()
        writer.writerows(rows)

    return {
        "status": "success",
        "message": f"Budget for {month_name} updated successfully!" if updated else f"Budget for {month_name} added successfully!"
    }

@app.get("/api/budgets/check/{month_name}")
async def check_budget_endpoint(month_name: str):
    """Replaces check_budget_vs_actual() command line print outs with a state comparison"""
    if month_name not in MONTHS:
        raise HTTPException(status_code=400, detail="Invalid month name acronym")
        
    actual_expense = get_monthly_expense_logic(month_name)
    setted_budget = 0.0
    
    if os.path.isfile("Budget.csv"):
        with open("Budget.csv", 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row['Month'] == month_name:
                    setted_budget = float(row['Budget'])
                    
    remaining = setted_budget - actual_expense
    
    if actual_expense < setted_budget:
        status = "under"
        msg = f"Hushhh!! You still have {remaining} to spend. Use them wisely."
    elif actual_expense > setted_budget:
        status = "over"
        msg = f"Warning!! You have exceeded your budget by {abs(remaining)}."
    else:
        status = "exact"
        msg = "You are exactly on budget! Be careful."
        
    return {
        "month": month_name,
        "budget_limit": setted_budget,
        "actual_expense": actual_expense,
        "remaining_balance": remaining,
        "status_code": status,
        "message": msg
    }


# ═══════════════════════════════════════════════════════════════
# 3. INTEREST CALCULATOR MODULE (Pure Math Conversions)
# ═══════════════════════════════════════════════════════════════

@app.post("/api/calculator/simple-interest")
async def simple_interest_api(principal: float = Form(...), rate: float = Form(...), years: float = Form(...)):
    interest = (principal * rate * years) / 100
    return {"interest_earned": interest, "total_maturity_amount": principal + interest}

@app.post("/api/calculator/compound-interest")
async def compound_interest_api(principal: float = Form(...), rate: float = Form(...), years: float = Form(...), frequency: int = Form(...)):
    # frequency maps to your terminal instructions (1=Yearly, 2=Half-Yearly, 4=Quarterly, 12=Monthly)
    rate_fraction = rate / 100
    total_return = principal * pow((1 + (rate_fraction / frequency)), (frequency * years))
    return {"interest_earned": total_return - principal, "total_maturity_amount": total_return}

@app.post("/api/calculator/loan-amortization")
async def loan_amortization_api(principal: float = Form(...), rate: float = Form(...), months_len: int = Form(...)):
    monthly_rate = rate / (12 * 100)
    emi = (principal * monthly_rate * pow(1 + monthly_rate, months_len)) / (pow(1 + monthly_rate, months_len) - 1)
    
    schedule = []
    remaining_p = principal
    total_int = 0
    
    for i in range(1, months_len + 1):
        interest_d = remaining_p * monthly_rate
        principal_d = emi - interest_d
        remaining_p -= principal_d
        total_int += interest_d
        schedule.append({
            "month": i,
            "emi": round(emi, 2),
            "principal_paid": round(principal_d, 2),
            "interest_paid": round(interest_d, 2),
            "remaining_principal": round(max(0, remaining_p), 2)
        })
        
    return {
        "monthly_emi": round(emi, 2),
        "total_amount_payable": round(emi * months_len, 2),
        "total_interest_payable": round(total_int, 2),
        "schedule": schedule
    }

@app.post("/api/calculator/taxation")
async def taxation_api(income: float = Form(...)):
    tax = 0
    slabs = []
    # Preserves your exact slab tracking logic conditions
    if income <= 400000:
        tax = 0
        slabs.append({"slab": "Up to 4L", "tax": 0})
    elif income <= 800000:
        tax = (income - 400000) * 0.05
        slabs.append({"slab": "4L - 8L (5%)", "tax": tax})
    elif income <= 1200000:
        tax = (400000 * 0.05) + (income - 800000) * 0.10
        slabs.append({"slab": "4L - 8L (5%)", "tax": 400000 * 0.05})
        slabs.append({"slab": "8L - 12L (10%)", "tax": (income - 800000) * 0.10})
    elif income <= 1600000:
        tax = (400000 * 0.05) + (400000 * 0.10) + (income - 1200000) * 0.15
        slabs.append({"slab": "4L - 8L (5%)", "tax": 400000 * 0.05})
        slabs.append({"slab": "8L - 12L (10%)", "tax": 400000 * 0.10})
        slabs.append({"slab": "12L - 16L (15%)", "tax": (income - 1200000) * 0.15})
    elif income <= 2000000:
        tax = (400000 * 0.05) + (400000 * 0.10) + (400000 * 0.15) + (income - 1600000) * 0.20
        slabs.append({"slab": "4L - 8L (5%)", "tax": 400000 * 0.05})
        slabs.append({"slab": "8L - 12L (10%)", "tax": 400000 * 0.10})
        slabs.append({"slab": "12L - 16L (15%)", "tax": 400000 * 0.15})
        slabs.append({"slab": "16L - 20L (20%)", "tax": (income - 1600000) * 0.20})
    else:
        tax = (400000 * 0.05) + (400000 * 0.10) + (400000 * 0.15) + (400000 * 0.20) + (income - 2000000) * 0.30
        slabs.append({"slab": "4L - 8L (5%)", "tax": 400000 * 0.05})
        slabs.append({"slab": "8L - 12L (10%)", "tax": 400000 * 0.10})
        slabs.append({"slab": "12L - 16L (15%)", "tax": 400000 * 0.15})
        slabs.append({"slab": "16L - 20L (20%)", "tax": 400000 * 0.20})
        slabs.append({"slab": "Above 20L (30%)", "tax": (income - 2000000) * 0.30})
        
    surcharge = 0
    if income > 5000000:
        surcharge = tax * 0.10
        
    cess = (tax + surcharge) * 0.04
    total_tax = tax + surcharge + cess
    
    return {
        "base_tax": round(tax, 2),
        "surcharge": round(surcharge, 2),
        "cess_health_education": round(cess, 2),
        "total_tax_payable": round(total_tax, 2),
        "breakdown_slabs": slabs
    }

@app.post("/api/calculator/sip")
async def sip_api(principal_monthly: float = Form(...), annual_rate: float = Form(...), years: float = Form(...)):
    compound_frequency = annual_rate / (100 * 12)
    time_frequency = years * 12
    
    growth_factor = (pow((1 + compound_frequency), time_frequency) - 1) / compound_frequency
    maturity_amount = (principal_monthly) * (growth_factor) * (1 + compound_frequency)
    invested_amount = principal_monthly * time_frequency
    profit_gained = maturity_amount - invested_amount
    
    return {
        "total_invested": round(invested_amount, 2),
        "maturity_value": round(maturity_amount, 2),
        "wealth_gained": round(profit_gained, 2)
    }