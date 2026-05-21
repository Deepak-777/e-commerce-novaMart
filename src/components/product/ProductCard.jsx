import { useState } from 'react'
import { ShoppingCart, Star, Check, Heart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { motion } from 'framer-motion'

export default function ProductCard({ product }) {
  const { addItem }  = useCart()
  const { user }     = useAuth()
  const navigate     = useNavigate()
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please log in to add items to your cart')
      navigate('/login')
      return
    }
    addItem(product)
    setAdded(true)
    toast.success(`${product.title} added to cart!`)
    setTimeout(() => setAdded(false), 2000)
  }

  const categoryVariant = {
    Electronics: 'primary',
    Clothing:    'success',
    Footwear:    'warning',
    Accessories: 'danger',
    Home:        'default',
  }[product.category] || 'default'

  return (
    <Card animated className="group overflow-hidden h-full flex flex-col border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-xl transition-all duration-300">
      {/* ── Product image ───────────────────────────── */}
      <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-800/50 aspect-[4/3] sm:aspect-square">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300 bg-slate-100 dark:bg-slate-800">
            🖼️
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        
        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant={categoryVariant}>{product.category}</Badge>
        </div>

        {/* Low stock warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="warning">Only {product.stock} left</Badge>
          </div>
        )}

        {/* Wishlist Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-sm"
        >
          <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-slate-600 dark:text-slate-300"} />
        </motion.button>
      </div>

      {/* ── Product info ────────────────────────────── */}
      <div className="p-5 flex flex-col gap-3 flex-1 bg-white dark:bg-slate-900">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1.5 mt-auto">
            <div className="flex text-amber-400">
              <Star size={14} className="fill-current" />
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {product.rating.toFixed(1)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-1">
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(product.price)}
          </span>

          <Button
            onClick={handleAddToCart}
            disabled={added}
            variant={added ? "success" : "primary"}
            size="sm"
            className={`rounded-full px-4 ${added ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
          >
            {added ? (
              <><Check size={16} className="mr-1" /> Added</>
            ) : (
              <><ShoppingCart size={16} className="mr-1" /> Add</>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}
