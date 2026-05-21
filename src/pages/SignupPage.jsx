import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../services/authService'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, User as UserIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignupPage() {
  const navigate = useNavigate()

  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name    = 'Name is required'
    if (!form.email)        e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password)     e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await signUp(form.email, form.password, form.name)
      toast.success('Account created! Welcome to NovaMart 🎉')
      navigate('/')
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists'
        : err.message
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
      
      {/* ── Left Side: Image/Gradient ───────────────── */}
      <div className="relative hidden w-0 flex-1 lg:block order-2 lg:order-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-tr from-purple-800 via-brand-700 to-brand-600 overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-1/4 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute -bottom-24 right-1/4 w-72 h-72 bg-brand-400/30 rounded-full blur-3xl mix-blend-overlay"></div>
          
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white max-w-lg"
            >
              <h2 className="text-4xl font-extrabold mb-6 leading-tight">Start your journey with us.</h2>
              <ul className="space-y-4 mb-8">
                {[
                  'Access to exclusive premium products',
                  'Fast, free shipping on orders over $50',
                  'Earn rewards and unlock special discounts',
                  'Secure and seamless checkout process'
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="flex items-center gap-3 text-brand-50"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Right Side: Form ──────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[560px] bg-white dark:bg-slate-950 order-1 lg:order-2">
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
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create an account</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                  Sign in instead
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full name</label>
                <Input
                  type="text"
                  placeholder="Jane Doe"
                  icon={UserIcon}
                  value={form.name}
                  onChange={set('name')}
                  error={errors.name}
                  autoComplete="name"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  icon={Mail}
                  value={form.email}
                  onChange={set('email')}
                  error={errors.email}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <Input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    icon={Lock}
                    value={form.password}
                    onChange={set('password')}
                    error={errors.password}
                    autoComplete="new-password"
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

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm password</label>
                <Input
                  type="password"
                  placeholder="Re-enter password"
                  icon={Lock}
                  value={form.confirm}
                  onChange={set('confirm')}
                  error={errors.confirm}
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" isLoading={loading} className="w-full mt-4" size="lg">
                Create Account
              </Button>
            </form>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
              By signing up, you agree to our{' '}
              <a href="#" className="font-medium text-brand-600 hover:text-brand-500">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="font-medium text-brand-600 hover:text-brand-500">Privacy Policy</a>.
            </p>
          </motion.div>
        </div>
      </div>

    </div>
  )
}

