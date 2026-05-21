import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signIn } from '../services/authService'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'

  const [form,    setForm]    = useState({ email: '', password: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email)    e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await signIn(form.email, form.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : err.message
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
      {/* ── Left Side: Form ──────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[560px] bg-white dark:bg-slate-950">
        <div className="mx-auto w-full max-w-sm lg:w-[400px]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30 mb-6">
                <span className="text-2xl font-bold">N</span>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                  Sign up for free
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  icon={Mail}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500">Forgot password?</a>
                </div>
                <div className="relative">
                  <Input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    icon={Lock}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    error={errors.password}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" isLoading={loading} className="w-full mt-2" size="lg">
                Sign in
              </Button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white dark:bg-slate-950 px-6 text-slate-500">Demo Note</span>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Create an account on the Sign Up page. Firebase Auth works in real-time.
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right Side: Image/Gradient ───────────────── */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-brand-600 via-brand-700 to-purple-800 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl mix-blend-overlay"></div>
          
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glass-card max-w-lg p-10 rounded-3xl text-white"
              style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
            >
              <h2 className="text-3xl font-bold mb-4">Elevate your shopping experience.</h2>
              <p className="text-brand-100 mb-8 leading-relaxed">
                Join thousands of shoppers who have upgraded to NovaMart. Get exclusive access to limited drops, personalized recommendations, and faster checkout.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} className="w-10 h-10 rounded-full border-2 border-brand-700 object-cover" src={`https://i.pravatar.cc/100?img=${i+10}`} alt={`User ${i}`} />
                  ))}
                </div>
                <div className="text-sm font-medium text-white/80">
                  Joined by 10k+ users
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

