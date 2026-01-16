import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { Trash2, Home, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Cart() {
    const { items, removeFromCart, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            alert("Please login to checkout.");
            navigate('/login');
            return;
        }

        if (items.length === 0) return;

        setLoading(true);
        try {
            // Group items by ID or assume they are already distinct? 
            // Current CartContext appends, so we might need to aggregate if we want clean data, 
            // but for now let's send them as is or simple map. 
            // Backend expects { productId, quantity, price }

            const orderItems = items.map(item => ({
                productId: Number(item.id),
                quantity: item.quantity || 1,
                price: item.price
            }));

            await orderAPI.create({
                items: orderItems,
                total
            });

            alert("Order placed successfully!");
            clearCart();
            navigate('/profile'); // Redirect to profile to see orders
        } catch (error) {
            console.error('Checkout error:', error);
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 min-h-screen">
            <h1 className="text-4xl font-bold mb-8">Your Cart ({items.length})</h1>

            {items.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-gray-400 text-xl mb-6">Your cart is empty.</p>
                    <Link to="/shop" className="px-8 py-3 bg-brand-gold text-black font-bold rounded-full">
                        Browse Collection
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => (
                            <motion.div
                                key={`${item.id}-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-6 bg-white/5 p-4 rounded-2xl border border-white/5 items-center"
                            >
                                <img src={item.imageUrl || item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold">{item.name}</h3>
                                    <p className="text-sm text-gray-400">{item.category}</p>
                                    <p className="text-lg font-bold text-brand-gold mt-1">Rs. {item.price}</p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-3 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </motion.div>
                        ))}
                        <button onClick={clearCart} className="text-gray-500 underline text-sm hover:text-white">
                            Clear Cart
                        </button>
                    </div>

                    {/* Checkout Options */}
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 h-fit sticky top-24">
                        <div className="flex justify-between text-xl font-bold mb-8 pb-8 border-b border-white/10">
                            <span>Total</span>
                            <span>Rs. {total.toFixed(2)}</span>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-2">Choose Checkout Method</p>

                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-brand-gold to-brand-amber text-black font-bold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <CreditCard size={20} />
                                {loading ? 'Processing...' : 'Direct Order'}
                            </button>

                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-white/10"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs">OR</span>
                                <div className="flex-grow border-t border-white/10"></div>
                            </div>

                            <Link to="/home-store" className="w-full bg-white/10 text-white border border-white/10 font-bold py-4 rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                                <Home size={20} />
                                Try at Home (Max 10)
                            </Link>

                            <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                                <strong>Direct Order:</strong> Standard shipping.<br />
                                <strong>Try at Home:</strong> We bring these frames to you.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
