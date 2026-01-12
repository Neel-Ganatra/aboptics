import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, ArrowLeft, CreditCard, ShieldCheck, Truck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useHomeTrial } from '../context/HomeTrialContext';
import { productAPI } from '../api';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { addToTrial, isInTrial } = useHomeTrial();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Fetch Product Data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (id) {
                    const response = await productAPI.getById(id);
                    setProduct(response.data);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const images = product?.images && product.images.length > 0
        ? product.images
        : [product?.imageUrl || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop"];

    // Auto-slide functionality
    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setActiveImageIndex((prev) => (prev + 1) % images.length);
        }, 5000); // 5 seconds default

        return () => clearInterval(interval);
    }, [images.length]);

    const nextImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            alert("Please login to add items.");
            navigate('/login');
            return;
        }
        if (!product) return;

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.imageUrl // Use main image for cart
        });
        alert("Added to cart!");
    };

    const handleDirectOrder = () => {
        if (!isAuthenticated) {
            alert("Please login to order.");
            navigate('/login');
            return;
        }
        if (!product) return;

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.imageUrl
        });
        navigate('/cart');
    };

    const handleAddToTrial = () => {
        if (!product) return;
        addToTrial({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.imageUrl, // Use main image for trial
            category: product.category
        });
        navigate('/home-store');
    };

    if (loading) return <div className="text-white text-center pt-24 font-serif text-2xl">Loading luxury eyewear...</div>;
    if (!product) return <div className="text-white text-center pt-24 font-serif text-2xl">Product not found</div>;

    return (
        <div className="pt-24 pb-12 px-4 min-h-screen relative overflow-hidden bg-brand-black">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-amber/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <Link to="/shop" className="inline-flex items-center text-gray-400 hover:text-brand-gold mb-10 transition-colors group">
                    <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Collection
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Simplified Image Gallery */}
                    <div className="flex flex-col gap-6">
                        <div className="relative aspect-[4/5] w-full rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 group">
                            <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />

                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImageIndex}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    src={images[activeImageIndex]}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-8 relative z-0"
                                />
                            </AnimatePresence>

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/60 rounded-full text-white hover:bg-brand-gold hover:text-black transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/60 rounded-full text-white hover:bg-brand-gold hover:text-black transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                    <div className="absolute bottom-6 right-6 z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10">
                                        {activeImageIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center px-4">
                                {images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${activeImageIndex === idx
                                            ? 'border-brand-gold scale-110 shadow-[0_0_15px_rgba(255,193,7,0.3)]'
                                            : 'border-white/10 opacity-60 hover:opacity-100 hover:scale-105'
                                            }`}
                                    >
                                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Story & Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="flex flex-col justify-center space-y-8 lg:sticky lg:top-24"
                    >
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-brand-gold font-bold tracking-[0.2em] uppercase text-sm mb-4"
                            >
                                {product.category || "Luxury Eyewear"}
                            </motion.h2>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="flex items-center text-brand-gold">
                                    <Star className="fill-current w-5 h-5" />
                                    <Star className="fill-current w-5 h-5" />
                                    <Star className="fill-current w-5 h-5" />
                                    <Star className="fill-current w-5 h-5" />
                                    <Star className="fill-current w-5 h-5 text-gray-600" />
                                </div>
                                <span className="text-sm font-light tracking-wide">(128 Verified Reviews)</span>
                            </div>
                        </div>

                        <p className="text-xl text-gray-400 leading-relaxed font-light border-l-2 border-brand-gold/30 pl-6">
                            {product.description}
                        </p>

                        <div className="flex items-baseline gap-4">
                            <span className="text-5xl font-bold text-white font-serif">${product.price}</span>
                            <span className="text-lg text-gray-500 line-through decoration-brand-gold/50">${Math.round(product.price * 1.2)}</span>
                            <span className="text-sm text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-full">In Stock</span>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleDirectOrder}
                                    className="col-span-1 bg-gradient-to-r from-brand-gold to-brand-amber text-black font-bold py-5 rounded-2xl hover:shadow-[0_0_30px_rgba(255,193,7,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 text-lg group"
                                >
                                    <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    Buy Now
                                </button>
                                <button
                                    onClick={handleAddToCart}
                                    className="col-span-1 bg-white/5 border border-white/10 text-white font-bold py-5 rounded-2xl hover:bg-white/10 hover:border-brand-gold/30 transition-all flex items-center justify-center gap-3 text-lg group"
                                >
                                    <ShoppingBag className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleAddToTrial}
                                    className="col-span-2 bg-white/5 border border-brand-gold/20 text-brand-gold font-bold py-4 rounded-2xl hover:bg-brand-gold hover:text-black transition-all flex items-center justify-center gap-3 text-lg group"
                                >
                                    <Truck className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    {isInTrial(product.id) ? "View in Home Trial Cart" : "Try at Home (Free)"}
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                            {[
                                { icon: ShieldCheck, label: "2 Year Warranty" },
                                { icon: Truck, label: "Free Shipping" },
                                { icon: RotateCcw, label: "30 Day Return" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-2 group cursor-default">
                                    <div className="p-3 bg-white/5 rounded-full text-brand-gold group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-black transition-all duration-300">
                                        <item.icon size={20} />
                                    </div>
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
