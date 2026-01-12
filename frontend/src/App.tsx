import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import GlassesLoader from './components/GlassesLoader';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { HomeTrialProvider } from './context/HomeTrialContext';

// Lazy loading components
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const HomeStore = lazy(() => import('./pages/HomeStore'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <HomeTrialProvider>
            <Router>
              <div className="min-h-screen font-sans transition-colors duration-300">
                <Navbar />
                <main>
                  <Suspense fallback={<GlassesLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/frames" element={<Shop category="Frames" />} />
                      <Route path="/sunglasses" element={<Shop category="Sunglasses" />} />
                      <Route path="/lenses" element={<Shop category="Lenses" />} />
                      <Route path="/home-store" element={<HomeStore />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                  </Suspense>
                </main>
              </div>
            </Router>
          </HomeTrialProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
