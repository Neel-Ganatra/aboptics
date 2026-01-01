import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package } from 'lucide-react';
import { orderAPI } from '../api';

export default function Profile() {
    const { user, token } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            Promise.all([
                fetch('http://localhost:3000/api/appointments/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(res => res.json()),
                orderAPI.getMyOrders()
            ])
                .then(([apptData, orderRes]) => {
                    setAppointments(apptData);
                    setOrders(orderRes.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [token]);

    if (!user) return <div className="text-center pt-40">Please login.</div>;

    return (
        <div className="pt-24 pb-12 px-4 min-h-screen bg-brand-black">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-6 mb-12 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-brand-gold to-brand-amber rounded-full flex items-center justify-center text-black font-bold text-3xl shadow-[0_0_20px_rgba(255,193,7,0.4)]">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white">{user.name}</h1>
                        <p className="text-gray-400">{user.email}</p>
                        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold border border-brand-gold/20">
                            {user.role} Member
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-brand-gold/20 transition-colors">
                        <h3 className="text-gray-400 font-bold mb-2 flex items-center gap-2">
                            <Calendar className="text-brand-gold" size={18} /> Total Home Visits
                        </h3>
                        <p className="text-4xl font-serif font-bold text-white">{appointments.length}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-brand-gold/20 transition-colors">
                        <h3 className="text-gray-400 font-bold mb-2 flex items-center gap-2">
                            <Package className="text-brand-gold" size={18} /> Active Orders
                        </h3>
                        <p className="text-4xl font-serif font-bold text-white">{orders.length}</p>
                    </div>
                </div>

                {/* Orders Section */}
                <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3 mt-12">
                    <span className="w-1 h-8 bg-brand-gold rounded-full"></span>
                    Order History
                </h2>
                {loading ? (
                    <p className="text-gray-500">Loading orders...</p>
                ) : orders.length === 0 ? (
                    <div className="text-center py-10 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                        <p className="text-gray-500">No orders placed yet.</p>
                        <Link to="/shop" className="text-brand-gold underline mt-2 inline-block">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-4 mb-12">
                        {orders.map((order: any) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={order.id}
                                className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-white mb-1 flex items-center gap-3">
                                            Order #{order.id}
                                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-500/20 text-blue-500">
                                                {order.status}
                                            </span>
                                        </h4>
                                        <p className="text-sm text-gray-400">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-brand-gold">${order.total}</p>
                                        <p className="text-xs text-gray-400">{order.items?.length} items</p>
                                    </div>
                                </div>
                                {/* Order Items Preview */}
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {order.items?.map((item: any) => (
                                        <div key={item.id} className="min-w-[60px]">
                                            <img
                                                src={item.product?.imageUrl || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop"}
                                                className="w-12 h-12 rounded-lg object-cover border border-white/10"
                                                title={item.product?.name}
                                            />
                                            <p className="text-[10px] text-gray-400 mt-1 truncate w-14">{item.product?.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Home Visits Section */}
                <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-brand-gold rounded-full"></span>
                    Home Visit History
                </h2>

                {loading ? (
                    <p className="text-gray-500">Loading history...</p>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-10 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                        <p className="text-gray-500">No home visits scheduled yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((appt: any) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={appt.id}
                                className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4"
                            >
                                <div>
                                    <h4 className="font-bold text-lg text-white mb-1 flex items-center gap-3">
                                        Appointment #{appt.id}
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${appt.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'
                                            }`}>
                                            {appt.status}
                                        </span>
                                    </h4>
                                    <p className="text-sm text-gray-400">Date: {new Date(appt.date).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-400 mt-1 max-w-md truncate">{appt.address}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400 mb-1">Items for Trial</p>
                                        <div className="flex -space-x-2">
                                            {appt.items && Array.isArray(appt.items) && appt.items.slice(0, 3).map((item: any, i: number) => (
                                                <img key={i} src={item.image} className="w-8 h-8 rounded-full border border-black object-cover" title={item.name} />
                                            ))}
                                            {appt.items && appt.items.length > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-gray-800 border border-black flex items-center justify-center text-[10px] text-white font-bold">
                                                    +{appt.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
