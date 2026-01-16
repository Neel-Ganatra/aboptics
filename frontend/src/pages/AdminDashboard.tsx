import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShoppingBag, Clock, CheckCircle, PlusCircle } from 'lucide-react';
import AdminProductUpload from '../components/AdminProductUpload';
import { adminAPI } from '../api';

interface Stats {
    totalUsers: number;
    totalOrders: number;
    pendingOrders: number;
    activeUsers: number;
}

interface Order {
    id: number;
    status: string;
    date: string;
    user: { name: string; email: string };
    items: any;
    address: string;
    phone: string;
    name?: string;
}

export default function AdminDashboard() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<Stats | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const statsRes = await adminAPI.getStats();
                const ordersRes = await adminAPI.getOrders();

                setStats(statsRes.data);
                setOrders(ordersRes.data);
            } catch (error) {
                console.error("Failed to fetch admin data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate, token]);

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await adminAPI.updateOrderStatus(id, newStatus);
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error("Failed to update status");
        }
    };

    const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-brand-gold">Loading Admin Panel...</div>;

    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans p-6 md:p-10 pt-24">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-amber/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-white mb-2">Admin Dashboard</h1>
                        <p className="text-gray-400">Welcome back, {user?.name}</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-black font-bold rounded-full hover:bg-white transition-all shadow-lg hover:shadow-brand-gold/20"
                        >
                            <PlusCircle size={20} />
                            Add Product
                        </button>
                        <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs text-brand-gold font-bold flex items-center">
                            {new Date().toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Users', value: stats?.totalUsers || 0, icon: <Users size={24} />, color: 'text-blue-400' },
                        { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <ShoppingBag size={24} />, color: 'text-brand-gold' },
                        { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: <Clock size={24} />, color: 'text-orange-400' },
                        { label: 'Completed Orders', value: (stats?.totalOrders || 0) - (stats?.pendingOrders || 0), icon: <CheckCircle size={24} />, color: 'text-green-400' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>{stat.icon}</div>
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Update</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Orders Section */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold text-white">Recent Home Visits</h2>
                        <div className="flex gap-2">
                            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${filter === f ? 'bg-brand-gold text-black' : 'bg-black/40 text-gray-400 hover:text-white'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-6 font-medium">Order ID</th>
                                    <th className="p-6 font-medium">Customer</th>
                                    <th className="p-6 font-medium">Items</th>
                                    <th className="p-6 font-medium">Date</th>
                                    <th className="p-6 font-medium">Status</th>
                                    <th className="p-6 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-6 font-mono text-sm text-brand-gold">#{order.id}</td>
                                        <td className="p-6">
                                            <div className="font-bold text-white">{order.name || order.user?.name}</div>
                                            <div className="text-xs text-gray-500">{order.user?.email}</div>
                                            <div className="text-xs text-gray-500">{order.phone}</div>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-xs text-brand-gold mt-1 block font-bold">{Array.isArray(order.items) ? order.items.length : 0} Items</span>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-[10px] underline text-gray-400 hover:text-white mt-1"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                        <td className="p-6 text-sm text-gray-400">
                                            {new Date(order.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'PENDING' ? 'bg-orange-500/20 text-orange-500' :
                                                order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' :
                                                    order.status === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-500' :
                                                        'bg-red-500/20 text-red-500'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <select
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                value={order.status}
                                                className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-xs text-gray-300 focus:outline-none focus:border-brand-gold"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="CONFIRMED">Confirm</option>
                                                <option value="COMPLETED">Complete</option>
                                                <option value="CANCELLED">Cancel</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredOrders.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                No orders found in this category.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <AdminProductUpload
                        onClose={() => setShowUploadModal(false)}
                        onSuccess={() => {
                            // Optionally refresh stats or product list
                            alert('Product Created Successfully!');
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedOrder(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111]/90 sticky top-0 z-10 backdrop-blur-md">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Order Details #{selectedOrder.id}</h2>
                                    <p className="text-sm text-gray-400">Customer: {selectedOrder.name || selectedOrder.user?.name}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-full">
                                    <Users size={20} className="rotate-45" /> {/* Using Users as close icon substitute if X not imported, wait X is not imported but PlusCircle is. Let's just use text 'Close' or try CheckCircle if needed, actually I can just add X to imports if not there. Inspecting imports: Users, ShoppingBag, Clock, CheckCircle, PlusCircle. X is not there. I will use 'Close' text or just click outside. actually X is standard. I'll add X to imports or just use a generic ascii X for speed or SVG. */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <p className="text-gray-500 font-bold uppercase text-xs mb-1">Contact Info</p>
                                        <p className="text-white">{selectedOrder.user?.email}</p>
                                        <p className="text-white">{selectedOrder.phone}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl">
                                        <p className="text-gray-500 font-bold uppercase text-xs mb-1">Shipping Address</p>
                                        <p className="text-white">{selectedOrder.address || "No address provided"}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                        <ShoppingBag size={16} className="text-brand-gold" />
                                        Ordered Items
                                    </h3>
                                    <div className="space-y-3">
                                        {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                                <img
                                                    src={item.product?.imageUrl || item.image || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop"}
                                                    alt={item.product?.name || "Product"}
                                                    className="w-16 h-16 object-cover rounded-lg bg-black"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-white">{item.product?.name || item.name || "Unknown Product"}</h4>
                                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-brand-gold">Rs. {item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
