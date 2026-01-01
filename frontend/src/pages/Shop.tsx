import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../api';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    brand?: string;
    category: string;
    imageUrl?: string;
    stock: number;
}

const TiltCard = ({ product, handleAddToCart }: { product: Product; handleAddToCart: (e: React.MouseEvent, product: any) => void }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

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

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-full"
        >
            <Link to={`/product/${product.id}`} className="block h-full">
                <div
                    style={{
                        transform: "translateZ(75px)",
                        transformStyle: "preserve-3d",
                    }}
                    className="bg-white/5 backdrop-blur-md rounded-[2.5rem] overflow-hidden group border border-white/5 hover:border-brand-gold/40 transition-all duration-500 h-full shadow-2xl"
                >
                    <div className="relative aspect-[4/5] overflow-hidden">
                        {/* Image Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 z-10" />

                        <div
                            style={{
                                transform: "translateZ(50px)",
                            }}
                            className="w-full h-full"
                        >
                            <img
                                src={product.imageUrl || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop"}
                                alt={product.name}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000 ease-out grayscale-[20%] group-hover:grayscale-0"
                            />
                        </div>

                        {/* Floating Actions */}
                        <div
                            style={{
                                transform: "translateZ(80px)",
                            }}
                            className="absolute bottom-6 left-0 w-full px-6 flex items-center justify-between translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 delay-100"
                        >
                            <button
                                onClick={(e) => handleAddToCart(e, product)}
                                className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-brand-gold transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                title="Add to Cart"
                            >
                                <ShoppingBag size={20} className="ml-[-2px]" />
                            </button>
                            <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/10 uppercase tracking-wider">
                                View Details
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            transform: "translateZ(60px)",
                        }}
                        className="p-8"
                    >
                        <div className="mb-2">
                            <p className="text-xs text-brand-gold/80 mb-2 font-bold uppercase tracking-widest">{product.category}</p>
                            <h3 className="text-2xl font-bold font-serif text-white group-hover:text-brand-gold transition-colors duration-300">{product.name}</h3>
                        </div>
                        <div className="flex items-end justify-between mt-4">
                            <p className="text-3xl font-bold text-white tracking-tight">${product.price}</p>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default function Shop({ category = 'All' }: { category?: string }) {
    const [filter, setFilter] = useState(category);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [filter]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (filter !== 'All') {
                params.category = filter;
            }
            const response = await productAPI.getAll(params);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            alert("Please login to add items to cart.");
            navigate('/login');
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.imageUrl // Ensure cart expects 'image' or 'imageUrl'
        });
        alert(`Added ${product.name} to cart!`);
    };

    return (
        <div className="pt-24 pb-12 px-4 min-h-screen relative overflow-hidden bg-brand-black">
            {/* Rich Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-brand-gold/5 via-brand-dark to-transparent" />
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-brand-amber/10 rounded-full blur-[140px] opacity-40" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 w-full perspective-1000">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block mb-4 px-6 py-2 rounded-full border border-brand-gold/20 bg-brand-gold/5 backdrop-blur-md"
                    >
                        <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs">
                            Premium Collection
                        </span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-gold/80 to-brand-amber drop-shadow-sm leading-tight">
                        Discover Your Look
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed font-light">
                        Meticulously crafted eyewear that blends timeless elegance with modern comfort.
                    </p>
                </motion.div>

                {/* Filters */}
                <div className="flex justify-center flex-wrap gap-4 mb-16">
                    {['All', 'Frames', 'Sunglasses', 'Lenses'].map((item) => (
                        <button
                            key={item}
                            onClick={() => setFilter(item)}
                            className={`px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 transform hover:scale-105 ${filter === item
                                ? 'bg-gradient-to-r from-brand-gold to-brand-amber text-black shadow-[0_0_25px_rgba(255,193,7,0.3)]'
                                : 'bg-white/5 backdrop-blur-md text-gray-400 hover:bg-white/10 border border-white/5 hover:border-brand-gold/30 hover:text-white'
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="text-center text-white">Loading products...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 perspective-1000">
                        {products.map((product) => (
                            <TiltCard key={product.id} product={product} handleAddToCart={handleAddToCart} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
