import { motion } from 'framer-motion';
import { Calendar, CheckCircle, ArrowRight, Trash2 } from 'lucide-react';
import { useHomeTrial } from '../context/HomeTrialContext';
import { appointmentAPI } from '../api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeStore() {
    const { trialItems, removeFromTrial, clearTrial } = useHomeTrial();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        date: '',
        time: '10:00'
    });

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            await appointmentAPI.create({
                ...formData,
                items: trialItems
            });

            alert('Appointment Booked Successfully! We will arrive with your selected frames.');
            clearTrial();
            navigate('/');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-20">
            {/* Header */}
            <section className="relative py-20 text-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-brand-gold/5 pointer-events-none" />
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-serif font-bold mb-6"
                >
                    We Bring the <span className="text-brand-gold">Store to You</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-gray-400 max-w-2xl mx-auto px-4"
                >
                    Selected {trialItems.length}/5 frames for your home trial.
                </motion.p>
            </section>

            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">

                {/* Selected Items Summary */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-8"
                >
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                        <h3 className="text-2xl font-bold mb-6 text-brand-gold">Selected for Try-On ({trialItems.length})</h3>

                        {trialItems.length === 0 ? (
                            <p className="text-gray-400">No frames selected. Browse our collection and click "Try at Home".</p>
                        ) : (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {trialItems.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-4 bg-black/30 p-3 rounded-xl border border-white/5">
                                        <img src={item.image || "https://via.placeholder.com/150"} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                                        <div className="flex-1">
                                            <h4 className="font-bold">{item.name}</h4>
                                            <p className="text-xs text-gray-400">{item.category}</p>
                                        </div>
                                        <button onClick={() => removeFromTrial(item.id)} className="text-gray-500 hover:text-red-500">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <h4 className="font-bold mb-2">Service Includes:</h4>
                            <ul className="text-sm text-gray-400 space-y-2">
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-gold" /> 100+ Additional Frames</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-gold" /> Comprehensive Eye Test</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-brand-gold" /> Expert Style Consultation</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Booking Form */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl"
                >
                    <h3 className="text-3xl font-serif font-bold mb-2">Book Appointment</h3>
                    <p className="text-gray-400 mb-8">Fill in your details to schedule a home visit.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Name</label>
                                <input required name="name" onChange={handleChange} value={formData.name} type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-gold focus:outline-none transition-colors" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Phone</label>
                                <input required name="phone" onChange={handleChange} value={formData.phone} type="tel" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-gold focus:outline-none transition-colors" placeholder="+91..." />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Address</label>
                            <textarea required name="address" onChange={handleChange} value={formData.address} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-gold focus:outline-none transition-colors h-24 resize-none" placeholder="Full address with landmark..." />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Date</label>
                                <div className="relative">
                                    <input required name="date" onChange={handleChange} value={formData.date} type="date" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-gold focus:outline-none transition-colors text-white [color-scheme:dark]" />
                                    <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Time</label>
                                <input required name="time" onChange={handleChange} value={formData.time} type="time" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-gold focus:outline-none transition-colors text-white [color-scheme:dark]" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-brand-gold text-black font-bold py-4 rounded-xl hover:bg-brand-amber transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-lg mt-4 disabled:opacity-50">
                            {loading ? 'Confirming...' : (
                                <>
                                    Confirm Appointment <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
