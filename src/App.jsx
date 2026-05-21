// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Providers
import { ThemeProvider }  from './context/ThemeContext'
import { AuthProvider }   from './context/AuthContext'
import { CartProvider }   from './context/CartContext'

// Layout
import Navbar  from './components/layout/Navbar'
import Footer  from './components/layout/Footer'

// Route guard
import ProtectedRoute from './components/common/ProtectedRoute'

// Pages
import HomePage    from './pages/HomePage'
import LoginPage   from './pages/LoginPage'
import SignupPage  from './pages/SignupPage'
import CartPage    from './pages/CartPage'
import OrdersPage  from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import SuccessPage from './pages/SuccessPage'

export default function App() {
  return (
    // ThemeProvider must be outermost so dark class is on <html> before any render
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>

            {/* Global toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '12px',
                  fontSize: '14px',
                  padding: '12px 16px',
                },
              }}
            />

            <div className="flex flex-col min-h-screen">
              <Navbar />

              <main className="flex-1 flex">
                <div className="flex-1 flex flex-col">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login"  element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected routes — require auth */}
                    <Route path="/"       element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                    <Route path="/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
                    <Route path="/cart"    element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                    <Route path="/orders"  element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </div>
              </main>

              <Footer />
            </div>

          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
