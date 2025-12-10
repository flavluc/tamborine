import { TransactionForm } from './components/TransactionForm'
import { TransactionsTable } from './components/TransactionsTable'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight mb-4">Transações</h1>

        <p className="text-sm text-muted-foreground mb-6">
          Envie uma nova transação para autorização e acompanhe o resultado.
        </p>

        <TransactionForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Histórico de transações</h2>

        <TransactionsTable />
      </section>
    </div>
  )
}
