import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { items } = useCart();
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="fixed w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300 hover:bg-black/80 hover:border-brand-gold/20">
            {/* Ambient Gold Mesh Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 via-transparent to-brand-gold/5 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-brand-amber rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-[0_0_20px_rgba(255,193,7,0.4)] group-hover:scale-105 transition-transform duration-300">
                            AB
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-white group-hover:text-brand-gold transition-colors font-serif">
                                AB OPTICIAN
                            </span>
                            <span className="text-[10px] tracking-widest text-gray-400 uppercase group-hover:text-brand-gold/80 transition-colors">
                                Eyewear Studio
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        {['Frames', 'Sunglasses', 'Lenses'].map((item) => (
                            <Link
                                key={item}
                                to={`/${item.toLowerCase()}`}
                                className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-white/10"
                            >
                                {item}
                            </Link>
                        ))}
                        <Link
                            to="/home-store"
                            className="ml-4 px-6 py-2.5 bg-gradient-to-r from-brand-gold to-brand-amber text-black text-sm font-bold rounded-full hover:shadow-[0_0_20px_rgba(255,193,7,0.4)] transition-all flex items-center gap-2 transform hover:scale-105"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                            </span>
                            Home Store
                        </Link>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-gray-300 hover:text-brand-gold transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        <Link to="/cart" className="relative group">
                            <div className="p-2 rounded-full hover:bg-white/5 transition-colors">
                                <ShoppingBag className="w-5 h-5 text-gray-300 group-hover:text-brand-gold transition-colors" />
                            </div>
                            <AnimatePresence>
                                {items.length > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute top-0 right-0 w-4 h-4 bg-brand-gold text-black text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg"
                                    >
                                        {items.length}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        {/* Auth Status */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold to-brand-amber text-black font-bold flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="hidden lg:block text-sm font-medium text-gray-300 group-hover:text-brand-gold">{user?.name}</span>
                                </Link>
                                {user?.role === 'ADMIN' && (
                                    <Link to="/admin" className="hidden md:block px-4 py-2 bg-white/10 rounded-full text-xs font-bold text-brand-gold border border-brand-gold/20 hover:bg-brand-gold hover:text-black transition-all">
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-5 py-2 rounded-full border border-brand-gold/30 text-brand-gold text-sm font-bold hover:bg-brand-gold hover:text-black transition-all"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-brand-gold transition-colors p-2">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {['Frames', 'Sunglasses', 'Lenses'].map((item) => (
                                <Link
                                    key={item}
                                    to={`/${item.toLowerCase()}`}
                                    className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-brand-gold hover:bg-white/5 rounded-xl transition-all"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                            <div className="pt-4 mt-4 border-t border-white/10">
                                <Link
                                    to="/home-store"
                                    className="block w-full text-center px-4 py-3 bg-brand-gold text-black font-bold rounded-xl"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Book Home Visit
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
