import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import TransactionList from './components/TransactionList'
import TransactionForm from './components/TransactionForm'
import { loadTransactions, saveTransactions } from './utils/storage'

const now = new Date()

export default function App() {
  const [transactions, setTransactions] = useState(loadTransactions)
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [filter, setFilter] = useState({
    type: 'all',
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  })

  useEffect(() => {
    saveTransactions(transactions)
  }, [transactions])

  const addTransaction = (data) => {
    setTransactions(prev => [...prev, { ...data, id: crypto.randomUUID() }])
    setShowForm(false)
  }

  const updateTransaction = (data) => {
    setTransactions(prev => prev.map(t => (t.id === data.id ? data : t)))
    setEditingTransaction(null)
    setShowForm(false)
  }

  const deleteTransaction = (id) => {
    if (!window.confirm('Deseja excluir esta transacao?')) return
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTransaction(null)
  }

  // Transactions for the selected month
  const monthTransactions = transactions.filter(t => {
    const [y, m] = t.date.split('-').map(Number)
    return m === filter.month && y === filter.year
  })

  // Apply type filter on top of month filter
  const filteredTransactions =
    filter.type === 'all'
      ? monthTransactions
      : monthTransactions.filter(t => t.type === filter.type)

  // Sort by date descending (ISO string comparison works for YYYY-MM-DD)
  const sortedTransactions = [...filteredTransactions].sort((a, b) =>
    b.date.localeCompare(a.date)
  )

  const monthIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const monthExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = transactions.reduce(
    (sum, t) => (t.type === 'income' ? sum + t.amount : sum - t.amount),
    0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 shadow-md sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">App Financas</h1>
            <p className="text-indigo-300 text-xs">Controle financeiro pessoal</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-indigo-600 font-semibold text-sm px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
          >
            + Nova Transacao
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5 pb-10">
        <Dashboard
          balance={balance}
          monthIncome={monthIncome}
          monthExpense={monthExpense}
          month={filter.month}
          year={filter.year}
        />
        <TransactionList
          transactions={sortedTransactions}
          filter={filter}
          setFilter={setFilter}
          onEdit={handleEdit}
          onDelete={deleteTransaction}
        />
      </main>

      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={editingTransaction ? updateTransaction : addTransaction}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}
