// src/hooks/useOrders.js
import { useEffect, useState } from 'react'
import { fetchUserOrders } from '../services/orderService'
import { useAuth } from '../context/AuthContext'

export function useOrders() {
  const { user } = useAuth()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!user) { setOrders([]); setLoading(false); return }
    setLoading(true)
    fetchUserOrders(user.uid)
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [user])

  return { orders, loading, error }
}
