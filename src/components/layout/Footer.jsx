import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Mail, Github, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-auto bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/60 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/5 dark:bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 group mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md transition-transform group-hover:scale-105">
                <span className="text-lg font-bold">N</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Nova<span className="text-brand-600 dark:text-brand-400">Mart</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Your premium destination for modern lifestyle products. Quality guaranteed, delivered fast.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-6 uppercase tracking-wider text-sm">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">New Arrivals</Link></li>
              <li><Link to="/" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">All Products</Link></li>
              <li><Link to="/cart" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Your Cart</Link></li>
              <li><Link to="/orders" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Order Tracking</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-6 uppercase tracking-wider text-sm">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/profile" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">My Account</Link></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Return Policy</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-6 uppercase tracking-wider text-sm">Newsletter</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                icon={Mail} 
                className="bg-slate-50 dark:bg-slate-900/50"
              />
              <Button type="submit" variant="primary">
                Subscribe
              </Button>
            </form>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} NovaMart Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

