import { useAuth } from '../context/AuthContext'
import { useOrders } from '../hooks/useOrders'
import { useNavigate, Link } from 'react-router-dom'
import OrderCard from '../components/orders/OrderCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Skeleton } from '../components/ui/Skeleton'
import { formatCurrency } from '../utils/helpers'
import { LogOut, Mail, ShoppingBag, Package, Settings, CreditCard, Bell, ChevronRight, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { orders, loading } = useOrders()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out!')
    navigate('/')
  }

  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0)
  const initials   = (user?.displayName || user?.email || 'U')
    .split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
          My Account
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── Left Column: Profile Card & Settings ── */}
          <div className="lg:col-span-4 space-y-6">
            
            <Card className="p-6 text-center border-0 ring-1 ring-slate-900/5 dark:ring-0 shadow-lg dark:shadow-none dark:border dark:border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-brand-500 to-purple-600 opacity-20" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 p-1 mb-4 shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/50 dark:to-brand-800/50 flex items-center justify-center text-brand-700 dark:text-brand-300 text-3xl font-bold">
                    {initials}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {user?.displayName || 'Shopper'}
                </h2>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mt-1 mb-4">
                  <Mail size={14} />
                  <span>{user?.email}</span>
                </div>

                <Badge variant="success" className="mb-6">Verified Member</Badge>

                <Button variant="outline" className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/50" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" /> Sign Out
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden border-0 ring-1 ring-slate-900/5 dark:ring-0 shadow-md dark:shadow-none dark:border dark:border-slate-800">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                <Link to="/orders" className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <div className="p-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-lg"><Package size={16} /></div>
                    Order History
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>
                <a href="#" className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg"><CreditCard size={16} /></div>
                    Payment Methods
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg"><Bell size={16} /></div>
                    Notifications
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg"><Settings size={16} /></div>
                    Account Settings
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </a>
              </div>
            </Card>

          </div>

          {/* ── Right Column: Stats & Recent Orders ── */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-6 flex items-center gap-4 border-0 ring-1 ring-slate-900/5 dark:ring-0 shadow-md dark:shadow-none dark:border dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50">
                <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Orders</p>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{orders.length}</p>
                </div>
              </Card>
              <Card className="p-6 flex items-center gap-4 border-0 ring-1 ring-slate-900/5 dark:ring-0 shadow-md dark:shadow-none dark:border dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50">
                <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Spent</p>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(totalSpent)}</p>
                </div>
              </Card>
            </div>

            {/* Recent Orders */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Orders</h2>
                {orders.length > 0 && (
                  <Link to="/orders" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1">
                    View All <ArrowRight size={14} />
                  </Link>
                )}
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[1,2].map((i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
                </div>
              ) : orders.length === 0 ? (
                <Card className="text-center py-16 border-dashed border-2">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={24} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No orders yet</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">When you buy products, your orders will appear here for easy tracking.</p>
                  <Button asChild>
                    <Link to="/">Start Shopping</Link>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-5">
                  {orders.slice(0, 3).map((order, i) => (
                    <motion.div 
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <OrderCard order={order} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

function Badge({ children, variant, className }) {
  const variants = {
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    brand: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className || ''}`}>
      {children}
    </span>
  )
}
