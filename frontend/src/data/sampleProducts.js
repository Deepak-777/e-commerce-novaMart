import headphonesImg from '../assets/products/headphones.svg'
import keyboardImg from '../assets/products/keyboard.svg'
import sneakersImg from '../assets/products/sneakers.svg'
import hoodieImg from '../assets/products/hoodie.svg'
import bagImg from '../assets/products/bag.svg'
import lampImg from '../assets/products/lamp.svg'

/**
 * Local fallback products so the app works without Firestore setup.
 * Shape matches what the UI expects: { id, title, price, category, image, rating, stock }.
 */
export const sampleProducts = [
  {
    id: 'p_headphones',
    title: 'Wireless Noise-Cancelling Headphones',
    price: 79.99,
    category: 'Electronics',
    image: headphonesImg,
    rating: 4.5,
    stock: 12,
  },
  {
    id: 'p_keyboard',
    title: 'Mechanical Gaming Keyboard',
    price: 49.99,
    category: 'Electronics',
    image: keyboardImg,
    rating: 4.7,
    stock: 8,
  },
  {
    id: 'p_hoodie',
    title: 'Oversized Graphic Hoodie',
    price: 44.99,
    category: 'Clothing',
    image: hoodieImg,
    rating: 4.6,
    stock: 15,
  },
  {
    id: 'p_sneakers',
    title: 'Classic White Sneakers',
    price: 59.99,
    category: 'Footwear',
    image: sneakersImg,
    rating: 4.4,
    stock: 10,
  },
  {
    id: 'p_bag',
    title: 'Leather Crossbody Bag',
    price: 89.99,
    category: 'Accessories',
    image: bagImg,
    rating: 4.3,
    stock: 7,
  },
  {
    id: 'p_lamp',
    title: 'Minimalist Desk Lamp',
    price: 29.99,
    category: 'Home',
    image: lampImg,
    rating: 4.4,
    stock: 14,
  },
]

export const sampleCategories = [
  'all',
  ...Array.from(new Set(sampleProducts.map((p) => p.category))).sort(),
]

