import { useState, useRef } from 'react'
import { CATEGORIES } from '../utils/categories'

function getToday() {
  return new Date().toISOString().split('T')[0]
}

const EMPTY_FORM = {
  type: 'expense',
  amount: '',
  category: '',
  description: '',
  date: getToday(),
}

export default function TransactionForm({ transaction, onSubmit, onClose }) {
  const [form, setForm] = useState(
    transaction
      ? { ...transaction, amount: String(transaction.amount) }
      : EMPTY_FORM
  )
  const [errors, setErrors] = useState({})
  const isFirstRender = useRef(true)

  const setField = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  const handleTypeChange = (newType) => {
    if (newType !== form.type) {
      setForm(f => ({ ...f, type: newType, category: '' }))
      setErrors(e => ({ ...e, category: '' }))
    }
  }

  const validate = () => {
    const errs = {}
    const amount = parseFloat(form.amount)
    if (!form.amount || isNaN(amount) || amount <= 0) {
      errs.amount = 'Informe um valor valido maior que zero'
    }
    if (!form.category) errs.category = 'Selecione uma categoria'
    if (!form.date) errs.date = 'Informe a data'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit({
      ...form,
      amount: parseFloat(form.amount),
      id: transaction?.id,
    })
  }

  const categories = CATEGORIES[form.type]
  const isIncome = form.type === 'income'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            {transaction ? 'Editar Transacao' : 'Nova Transacao'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xl"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !isIncome
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isIncome
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Receita
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Valor *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                R$
              </span>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                value={form.amount}
                onChange={e => setField('amount', e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.amount ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Categoria *
            </label>
            <select
              value={form.category}
              onChange={e => setField('category', e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white ${
                errors.category ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
            >
              <option value="">Selecione uma categoria...</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Descricao{' '}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Supermercado, conta de luz..."
              value={form.description}
              onChange={e => setField('description', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Data *
            </label>
            <input
              type="date"
              value={form.date}
              onChange={e => setField('date', e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                errors.date ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.date && (
              <p className="text-xs text-red-500 mt-1">{errors.date}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold text-white text-sm transition-colors mt-2 ${
              isIncome
                ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
            }`}
          >
            {transaction
              ? 'Salvar Alteracoes'
              : `Adicionar ${isIncome ? 'Receita' : 'Despesa'}`}
          </button>
        </form>
      </div>
    </div>
  )
}
