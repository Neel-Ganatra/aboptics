import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { items } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${scrolled
                ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-3 shadow-sm dark:shadow-none'
                : 'bg-transparent border-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">

                    {/* Logo Area */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className={`flex flex-col transition-all duration-300 ${scrolled ? 'scale-95' : 'scale-100'}`}>
                                <span className="text-2xl font-serif font-bold text-gold-gradient-dark bg-300% animate-shine tracking-widest group-hover:scale-105 transition-all">
                                    AB OPTICIAN
                                </span>
                                <span className={`text-[10px] tracking-[0.3em] text-yellow-700 dark:text-brand-gold/60 uppercase text-center ${scrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
                                    EST. 2024
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Center Desktop Menu */}
                    <div className="hidden md:flex items-center justify-center flex-1 mx-8">
                        <div className={`flex items-center space-x-8 px-8 py-2 rounded-full transition-all duration-300 ${scrolled ? 'bg-white/5 border border-white/5' : ''}`}>
                            {['Frames', 'Sunglasses', 'Lenses'].map((item) => (
                                <Link
                                    key={item}
                                    to={`/${item.toLowerCase()}`}
                                    className="text-sm font-medium text-black dark:text-gray-300 hover:text-brand-gold dark:hover:text-white transition-colors tracking-wide uppercase"
                                >
                                    {item}
                                </Link>
                            ))}
                            <div className="w-px h-4 bg-white/20 mx-2"></div>
                            <Link
                                to="/home-store"
                                className="text-sm font-medium text-brand-gold hover:text-white transition-colors tracking-wide uppercase flex items-center gap-2"
                            >
                                Home Trial
                            </Link>
                        </div>
                    </div>

                    {/* Right Icons Area */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button className="text-black dark:text-gray-300 hover:text-brand-gold dark:hover:text-white transition-colors">
                            <Search className="w-5 h-5" strokeWidth={1.5} />
                        </button>

                        <Link to="/cart" className="relative group">
                            <ShoppingBag className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" strokeWidth={1.5} />
                            <AnimatePresence>
                                {items.length > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 w-3 h-3 bg-brand-gold rounded-full"
                                    />
                                )}
                            </AnimatePresence>
                        </Link>

                        {/* Auth */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-6 pl-6 border-l border-white/10">
                                <Link to="/profile" className="text-sm font-medium text-gray-300 hover:text-white tracking-wide">
                                    ACCOUNT
                                </Link>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="text-sm font-medium text-white hover:text-brand-gold transition-colors tracking-wide pl-6 border-l border-white/10"
                            >
                                LOGIN
                            </Link>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-black dark:text-gray-300 hover:text-brand-gold dark:hover:text-white transition-colors"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                            {isOpen ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100vh' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black fixed inset-0 z-50 pt-24 px-6"
                    >
                        <div className="flex flex-col space-y-6">
                            {['Frames', 'Sunglasses', 'Lenses'].map((item) => (
                                <Link
                                    key={item}
                                    to={`/${item.toLowerCase()}`}
                                    className="text-2xl font-serif text-white hover:text-brand-gold transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                            <Link
                                to="/home-store"
                                className="text-2xl font-serif text-brand-gold"
                                onClick={() => setIsOpen(false)}
                            >
                                Home Trial
                            </Link>

                            <div className="pt-8 mt-8 border-t border-white/10 grid grid-cols-2 gap-4">
                                <Link to={isAuthenticated ? "/profile" : "/login"} onClick={() => setIsOpen(false)} className="py-3 text-center border border-white/20 rounded-lg text-sm uppercase tracking-widest text-gray-400">
                                    {isAuthenticated ? "Account" : "Login"}
                                </Link>
                                <Link to="/cart" onClick={() => setIsOpen(false)} className="py-3 text-center border border-white/20 rounded-lg text-sm uppercase tracking-widest text-gray-400">
                                    Cart ({items.length})
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
