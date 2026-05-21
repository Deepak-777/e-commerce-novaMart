import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { motion } from 'framer-motion'
import { Search, Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-24">
      <div className="text-center space-y-8 max-w-lg">
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-20 dark:opacity-10 blur-xl">
            <div className="w-64 h-64 bg-brand-500 rounded-full" />
          </div>
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-500 to-purple-600 relative z-10">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Page not found</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">
            Oops! The page you're looking for seems to have vanished into the digital void. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto rounded-full">
              <Link to="/">
                <Home size={18} className="mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="w-full sm:w-auto rounded-full">
              <Link to="/">
                <Search size={18} className="mr-2" />
                Browse Products
              </Link>
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
