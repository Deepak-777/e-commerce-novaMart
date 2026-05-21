// src/hooks/useProducts.js
import { useEffect, useState } from 'react'
import { fetchProducts, fetchCategories } from '../services/productService'

/**
 * Fetches products and categories.
 * Re-fetches whenever `category` changes.
 */
export function useProducts(category = 'all') {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState(['all'])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  // Fetch categories once
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((e) => console.warn('Could not fetch categories', e))
  }, [])

  // Fetch products when category changes
  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchProducts(category)
      .then(setProducts)
      .catch((e) => { setError(e.message); setProducts([]) })
      .finally(() => setLoading(false))
  }, [category])

  return { products, categories, loading, error }
}
