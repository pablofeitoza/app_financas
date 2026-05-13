import { formatCurrency } from '../utils/format'
import { MONTHS } from '../utils/format'

export default function Dashboard({ balance, monthIncome, monthExpense, month, year }) {
  const monthBalance = monthIncome - monthExpense

  return (
    <div className="space-y-4">
      <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-indigo-200 text-sm font-medium">Saldo Total</p>
        <p className={`text-4xl font-bold mt-1 tracking-tight ${balance < 0 ? 'text-red-300' : 'text-white'}`}>
          {formatCurrency(balance)}
        </p>
        <p className="text-indigo-300 text-xs mt-3">Todas as transacoes registradas</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
            <p className="text-xs text-gray-500 font-medium">Receitas</p>
          </div>
          <p className="text-xl font-bold text-green-600">{formatCurrency(monthIncome)}</p>
          <p className="text-xs text-gray-400 mt-1">{MONTHS[month - 1]} {year}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
            <p className="text-xs text-gray-500 font-medium">Despesas</p>
          </div>
          <p className="text-xl font-bold text-red-600">{formatCurrency(monthExpense)}</p>
          <p className="text-xs text-gray-400 mt-1">{MONTHS[month - 1]} {year}</p>
        </div>
      </div>

      {(monthIncome > 0 || monthExpense > 0) && (
        <div className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Resultado do mes</p>
          <p className={`text-sm font-semibold ${monthBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {monthBalance >= 0 ? '+' : ''}{formatCurrency(monthBalance)}
          </p>
        </div>
      )}
    </div>
  )
}
