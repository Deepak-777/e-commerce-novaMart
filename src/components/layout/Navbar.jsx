import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Sun, Moon, Menu, X, Package, Home, LogOut, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'

const navLinks = [
  { to: '/',        label: 'Home',   icon: Home    },
  { to: '/orders',  label: 'Orders', icon: Package },
]

export default function Navbar() {
  const { user, logout }       = useAuth()
  const { totalItems }         = useCart()
  const { dark, toggle }       = useTheme()
  const navigate               = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-800/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* ── Logo ─────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30 transition-transform group-hover:scale-105">
              <span className="text-xl font-bold">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Nova<span className="text-brand-600 dark:text-brand-400">Mart</span>
            </span>
          </Link>

          {/* ── Desktop nav links ─────────────────────── */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ to, label }) => (
              <NavLink 
                key={to} 
                to={to} 
                end={to === '/'}
                className={({ isActive }) => cn(
                  "relative text-sm font-medium transition-colors hover:text-brand-600 dark:hover:text-brand-400",
                  isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-600 dark:text-slate-300"
                )}
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-brand-600 dark:bg-brand-400"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop right actions ─────────────────── */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggle}
                className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {dark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Link
                to="/cart"
                className="relative p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors group"
                aria-label="Cart"
              >
                <ShoppingCart size={20} className="transition-transform group-hover:scale-110" />
                {totalItems > 0 && (
                  <span className="absolute 1 top-0 right-0">
                    <Badge variant="primary" className="h-5 min-w-[20px] px-1.5 flex items-center justify-center">
                      {totalItems > 99 ? '99+' : totalItems}
                    </Badge>
                  </span>
                )}
              </Link>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 group"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-700 dark:text-brand-300 text-sm font-bold border border-brand-200 dark:border-brand-800 transition-transform group-hover:scale-105">
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button variant="primary" asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* ── Mobile: cart + burger ─────────────────── */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggle} className="p-2 text-slate-500 dark:text-slate-400">
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/cart" className="relative p-2 text-slate-500 dark:text-slate-400">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0">
                  <Badge variant="primary" className="h-[18px] min-w-[18px] px-1 text-[10px] flex items-center justify-center">
                    {totalItems}
                  </Badge>
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 ml-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ─────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    isActive 
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <User size={18} /> Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                      <LogOut size={18} /> Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 pt-2">
                    <Button variant="outline" className="w-full justify-center h-12 text-base" asChild onClick={() => setMenuOpen(false)}>
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button variant="primary" className="w-full justify-center h-12 text-base" asChild onClick={() => setMenuOpen(false)}>
                      <Link to="/signup">Sign up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
