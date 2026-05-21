import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/product/ProductCard'
import CategoryFilter from '../components/product/CategoryFilter'
import { Skeleton } from '../components/ui/Skeleton'
import { Search, AlertCircle, ArrowRight, Zap, Shield, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

const HERO_PHRASES = ['Electronics', 'Clothing', 'Footwear', 'Accessories']

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function HomePage() {
  const [category,    setCategory]    = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { products, categories, loading, error } = useProducts(category)

  const filtered = products.filter((p) => {
    const search = searchQuery.toLowerCase()
    return (
      p.title?.toLowerCase().includes(search) ||
      p.category?.toLowerCase().includes(search)
    )
  })

  return (
    <div className="flex-1">

      {/* ── Hero banner ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-400/20 rounded-full blur-[128px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-[128px] pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Discover the <span className="gradient-text">Extraordinary</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300">
              Curated collections of premium {HERO_PHRASES.join(', ').toLowerCase()} and more. Elevate your everyday with NovaMart.
            </p>
            
            {/* Search bar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="max-w-xl mx-auto relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-xl ring-1 ring-slate-900/5 dark:ring-white/10">
                <Search size={20} className="absolute left-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-0 text-base"
                />
                <Button className="rounded-lg px-6 hidden sm:flex" variant="primary">
                  Search
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────── */}
      <section className="border-y border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
            <div className="flex flex-col items-center gap-3 p-4">
              <div className="p-3 bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 rounded-full">
                <Truck size={24} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Free & Fast Delivery</h3>
              <p className="text-sm text-slate-500">On all orders over $50</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-4">
              <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                <Shield size={24} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Secure Payments</h3>
              <p className="text-sm text-slate-500">100% protected transactions</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-4">
              <div className="p-3 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                <Zap size={24} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">24/7 Support</h3>
              <p className="text-sm text-slate-500">Dedicated help when you need</p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* ── Category filter ──────────────────────── */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trending Now</h2>
          <CategoryFilter
            categories={categories}
            active={category}
            onChange={(cat) => { setCategory(cat); setSearchQuery('') }}
          />
        </div>

        {/* ── Error state ──────────────────────────── */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-2xl text-red-600 dark:text-red-400 mb-8">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* ── Product grid ─────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 space-y-4"
          >
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No products found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              {searchQuery
                ? `We couldn't find anything matching "${searchQuery}". Try adjusting your search.`
                : 'No products are currently available in this category.'}
            </p>
            {searchQuery && (
              <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
                Clear search
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filtered.map((product) => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  )
}

