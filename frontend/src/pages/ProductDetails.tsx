import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, ArrowLeft, CreditCard, ShieldCheck, Truck, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../api';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // 3D Tilt Effect State
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

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
        }, 3000); // Change image every 3 seconds

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

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

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
            image: product.imageUrl
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
                    {/* Immersive 3D Image Gallery */}
                    <div className="flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                                rotateX,
                                rotateY,
                                transformStyle: "preserve-3d",
                            }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className="relative perspective-1000 group cursor-pointer aspect-[4/5] w-full"
                        >
                            <div
                                style={{ transform: "translateZ(20px)" }}
                                className="relative w-full h-full bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm rounded-[3rem] border border-white/10 p-2 shadow-2xl"
                            >
                                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-brand-dark/50 shadow-inner group/image">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />

                                    {/* Active Image */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                                        <AnimatePresence mode="wait">
                                            <motion.img
                                                key={activeImageIndex}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.4 }}
                                                src={images[activeImageIndex]}
                                                alt={product.name}
                                                className="max-w-full max-h-full object-contain p-4"
                                                style={{
                                                    transform: "translateZ(50px)",
                                                    filter: "contrast(1.1) brightness(1.1)" // Slight enhance for all images
                                                }}
                                            />
                                        </AnimatePresence>

                                        {/* Cinematic Vagnette to hide dirty backgrounds */}
                                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)] mix-blend-multiply z-10" />
                                    </div>

                                    {/* Navigation Arrows (Flipkart/Amazon Style) */}
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-110 opacity-0 group-hover/image:opacity-100 border border-white/10"
                                                style={{ transform: "translateZ(80px)" }}
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all transform hover:scale-110 opacity-0 group-hover/image:opacity-100 border border-white/10"
                                                style={{ transform: "translateZ(80px)" }}
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </>
                                    )}

                                    {/* 3D Floating Badges */}
                                    <div className="absolute top-6 left-6 z-20 pointer-events-none" style={{ transform: "translateZ(80px)" }}>
                                        <span className="px-4 py-2 bg-brand-gold/90 text-black text-xs font-bold uppercase tracking-widest rounded-full shadow-lg backdrop-blur-sm">
                                            Premium
                                        </span>
                                    </div>

                                    {/* Image Counter Badge */}
                                    {images.length > 1 && (
                                        <div className="absolute bottom-6 right-6 z-20 pointer-events-none" style={{ transform: "translateZ(80px)" }}>
                                            <span className="px-3 py-1 bg-black/50 text-white text-xs font-bold rounded-full backdrop-blur-sm border border-white/10">
                                                {activeImageIndex + 1} / {images.length}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Reflections/Glow */}
                            <div className="absolute -inset-4 bg-brand-gold/20 blur-3xl rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none" />
                        </motion.div>

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
