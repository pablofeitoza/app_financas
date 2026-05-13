import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import TransactionList from './components/TransactionList'
import TransactionForm from './components/TransactionForm'
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from './utils/api'

const now = new Date()

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [filter, setFilter] = useState({
    type: 'all',
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  })

  useEffect(() => {
    fetchTransactions()
      .then(setTransactions)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (data) => {
    try {
      const { id, ...payload } = data
      const created = await createTransaction(payload)
      setTransactions(prev => [...prev, created])
      setShowForm(false)
    } catch (err) {
      alert('Erro ao salvar: ' + err.message)
    }
  }

  const handleUpdate = async (data) => {
    try {
      const { id, ...payload } = data
      const updated = await updateTransaction(id, payload)
      setTransactions(prev => prev.map(t => (t.id === id ? updated : t)))
      setEditingTransaction(null)
      setShowForm(false)
    } catch (err) {
      alert('Erro ao atualizar: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir esta transacao?')) return
    try {
      await deleteTransaction(id)
      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      alert('Erro ao excluir: ' + err.message)
    }
  }

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTransaction(null)
  }

  const monthTransactions = transactions.filter(t => {
    const [y, m] = t.date.split('-').map(Number)
    return m === filter.month && y === filter.year
  })

  const filteredTransactions =
    filter.type === 'all'
      ? monthTransactions
      : monthTransactions.filter(t => t.type === filter.type)

  const sortedTransactions = [...filteredTransactions].sort((a, b) =>
    b.date.localeCompare(a.date)
  )

  const monthIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const monthExpense = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = transactions.reduce(
    (sum, t) =>
      t.type === 'income' ? sum + Number(t.amount) : sum - Number(t.amount),
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
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <p className="font-semibold">Erro ao conectar com o banco de dados</p>
            <p className="mt-1 text-xs">{error}</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
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
              onDelete={handleDelete}
            />
          </>
        )}
      </main>

      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={editingTransaction ? handleUpdate : handleAdd}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}
