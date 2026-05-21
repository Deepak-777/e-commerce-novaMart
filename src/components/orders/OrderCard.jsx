import { Package, ChevronDown, ChevronUp, MapPin, CreditCard, Clock } from 'lucide-react'
import { useState } from 'react'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { motion, AnimatePresence } from 'framer-motion'

export default function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)

  const statusColor = {
    paid: 'success',
    pending: 'warning',
    failed: 'danger',
    shipped: 'primary'
  }[order.status?.toLowerCase()] || 'default'

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:border-brand-300 dark:hover:border-brand-700">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-5 sm:p-6 cursor-pointer bg-white dark:bg-slate-900 group"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Package size={24} className="text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Order #{order.id.slice(-8).toUpperCase()}
              </h3>
              <Badge variant={statusColor} className="hidden sm:inline-flex capitalize">
                {order.status || 'paid'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <span className="hidden sm:inline-block border-l border-slate-300 dark:border-slate-700 h-3"></span>
              <span className="hidden sm:inline-block font-medium text-slate-700 dark:text-slate-300">
                {order.items?.length || 0} items
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Total Amount</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(order.total)}
            </p>
          </div>
          <div className={`p-2 rounded-full transition-colors ${expanded ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
              <ChevronDown size={20} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile status/total */}
      <div className="sm:hidden px-5 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <Badge variant={statusColor} className="capitalize">{order.status || 'paid'}</Badge>
        <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(order.total)}</p>
      </div>

      {/* Expanded items */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50 dark:bg-slate-900/50"
          >
            <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <MapPin size={16} className="text-brand-500" /> Shipping Details
                  </h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="font-medium text-slate-900 dark:text-white">{order.shippingAddress?.name || 'Customer'}</p>
                    <p className="mt-1">{order.shippingAddress?.line1 || '123 Main St'}</p>
                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postal_code}</p>
                    <p>{order.shippingAddress?.country || 'US'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <CreditCard size={16} className="text-brand-500" /> Payment Info
                  </h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p>Paid via Stripe</p>
                    <p className="mt-1">Subtotal: {formatCurrency(order.total - (order.shipping || 0) - (order.tax || 0))}</p>
                    <p>Shipping: {order.shipping === 0 ? 'Free' : formatCurrency(order.shipping || 0)}</p>
                    <p>Tax: {formatCurrency(order.tax || 0)}</p>
                    <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2 font-bold text-slate-900 dark:text-white flex justify-between">
                      <span>Total Paid</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Order Items</h4>
              <div className="space-y-3">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                        onError={(e) => { e.target.style.display = 'none' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.category} &middot; Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
