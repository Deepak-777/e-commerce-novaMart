// src/services/productService.js
// All Firestore reads/writes for the `products` collection.

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { sampleProducts, sampleCategories } from '../data/sampleProducts'

const PRODUCTS_COL = 'products'

const cache = {}

/** Fetch all products, optionally filtered by category */
export async function fetchProducts(category = 'all') {
  const fallback = () => {
    const data = sampleProducts.filter((p) => category === 'all' || p.category === category)
    cache[category] = data
    return data
  }

  if (cache[category]) return cache[category]

  try {
    const col = collection(db, PRODUCTS_COL)

    let q = query(col, orderBy('createdAt', 'desc'))
    if (category && category !== 'all') {
      q = query(col, where('category', '==', category), orderBy('createdAt', 'desc'))
    }

    const snapshot = await getDocs(q)
    if (snapshot.empty) return fallback()
    
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    cache[category] = data
    return data
  } catch {
    return fallback()
  }
}

/** Fetch a single product by ID */
export async function fetchProductById(id) {
  const ref = doc(db, PRODUCTS_COL, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

/** Fetch all unique category strings from the products collection */
export async function fetchCategories() {
  try {
    const snapshot = await getDocs(collection(db, PRODUCTS_COL))
    if (snapshot.empty) return sampleCategories

    const cats = new Set()
    snapshot.docs.forEach((d) => {
      if (d.data().category) cats.add(d.data().category)
    })
    const list = ['all', ...Array.from(cats).sort()]
    return list.length > 1 ? list : sampleCategories
  } catch {
    return sampleCategories
  }
}

// ─── Seed helper (run once from the browser console) ────────────
// import { seedProducts } from './productService'
// seedProducts()
export async function seedProducts() {
  const sample = [
    { title: 'Wireless Noise-Cancelling Headphones', price: 79.99, category: 'Electronics',  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', rating: 4.5, stock: 12 },
    { title: 'Mechanical Gaming Keyboard',           price: 49.99, category: 'Electronics',  image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', rating: 4.7, stock: 8  },
    { title: 'Ultra-Wide 4K Monitor',                price: 399.99,category: 'Electronics',  image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400', rating: 4.8, stock: 5  },
    { title: 'Slim Fit Chino Trousers',              price: 34.99, category: 'Clothing',     image: 'https://images.unsplash.com/photo-1593081891731-fda0877988da?w=400', rating: 4.2, stock: 20 },
    { title: 'Oversized Graphic Hoodie',             price: 44.99, category: 'Clothing',     image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400', rating: 4.6, stock: 15 },
    { title: 'Classic White Sneakers',               price: 59.99, category: 'Footwear',     image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', rating: 4.4, stock: 10 },
    { title: 'Leather Crossbody Bag',                price: 89.99, category: 'Accessories',  image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', rating: 4.3, stock: 7  },
    { title: 'Stainless Steel Water Bottle',         price: 24.99, category: 'Accessories',  image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', rating: 4.9, stock: 30 },
    { title: 'Portable Bluetooth Speaker',           price: 59.99, category: 'Electronics',  image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', rating: 4.5, stock: 9  },
    { title: 'Linen Button-Up Shirt',                price: 39.99, category: 'Clothing',     image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400', rating: 4.1, stock: 18 },
    { title: 'Running Trail Shoes',                  price: 94.99, category: 'Footwear',     image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400', rating: 4.6, stock: 6  },
    { title: 'Minimalist Desk Lamp',                 price: 29.99, category: 'Home',         image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', rating: 4.4, stock: 14 },
  ]

  const col = collection(db, PRODUCTS_COL)
  for (const p of sample) {
    await addDoc(col, { ...p, createdAt: serverTimestamp() })
  }
  console.log('✅ Seeded', sample.length, 'products')
}
