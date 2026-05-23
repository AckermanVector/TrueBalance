import { DashboardLayout } from "@/components/dashboard-layout"
import { ExpenseTracker } from "@/components/expense-tracker"

export default function ExpensesPage() {
  return (
    <DashboardLayout>
      <ExpenseTracker />
    </DashboardLayout>
  )
}
