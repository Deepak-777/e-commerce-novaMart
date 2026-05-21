import { Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/helpers'
import { motion } from 'framer-motion'

export default function CartItem({ item }) {
  const { removeItem, updateQuantity } = useCart()

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex gap-4 sm:gap-6 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      {/* Image */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col min-w-0 py-1">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
              {item.title}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.category}</p>
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white shrink-0">
            {formatCurrency(item.price)}
          </span>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          {/* Qty stepper */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-colors shadow-sm"
            >
              <Minus size={14} className="text-slate-600 dark:text-slate-300" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-slate-800 dark:text-slate-200">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Plus size={14} className="text-slate-600 dark:text-slate-300" />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
