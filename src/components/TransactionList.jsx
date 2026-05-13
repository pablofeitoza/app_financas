import { MONTHS, formatCurrency, formatDate } from '../utils/format'

export default function TransactionList({ transactions, filter, setFilter, onEdit, onDelete }) {
  const prevMonth = () => {
    setFilter(f =>
      f.month === 1
        ? { ...f, month: 12, year: f.year - 1 }
        : { ...f, month: f.month - 1 }
    )
  }

  const nextMonth = () => {
    setFilter(f =>
      f.month === 12
        ? { ...f, month: 1, year: f.year + 1 }
        : { ...f, month: f.month + 1 }
    )
  }

  const tabs = [
    { value: 'all', label: 'Todos' },
    { value: 'income', label: 'Receitas' },
    { value: 'expense', label: 'Despesas' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Transacoes</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors text-sm"
            >
              {'<'}
            </button>
            <span className="text-sm font-medium text-gray-700 w-32 text-center">
              {MONTHS[filter.month - 1]} {filter.year}
            </span>
            <button
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors text-sm"
            >
              {'>'}
            </button>
          </div>
        </div>

        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(f => ({ ...f, type: tab.value }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter.type === tab.value
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
          {transactions.length > 0 && (
            <span className="ml-auto text-xs text-gray-400 self-center">
              {transactions.length} {transactions.length === 1 ? 'registro' : 'registros'}
            </span>
          )}
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="py-14 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-gray-400 text-xl">$</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Nenhuma transacao encontrada</p>
          <p className="text-xs text-gray-400 mt-1">
            Adicione uma receita ou despesa para comecar
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {transactions.map(t => (
            <TransactionItem
              key={t.id}
              transaction={t}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

function TransactionItem({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income'

  return (
    <li className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 group transition-colors">
      <div
        className={`w-1 self-stretch rounded-full flex-shrink-0 ${
          isIncome ? 'bg-green-500' : 'bg-red-500'
        }`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {transaction.category}
          </span>
        </div>
        {transaction.description && (
          <p className="text-sm text-gray-600 mt-0.5 truncate">{transaction.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(transaction.date)}</p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className={`font-semibold text-sm ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </p>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onEdit(transaction)}
          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs"
          title="Editar"
        >
          Ed
        </button>
        <button
          onClick={() => onDelete(transaction.id)}
          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs"
          title="Excluir"
        >
          X
        </button>
      </div>
    </li>
  )
}
