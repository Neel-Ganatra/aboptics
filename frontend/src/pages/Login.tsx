import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, ArrowRight } from 'lucide-react';
import { authAPI } from '../api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await authAPI.login({ email, password });
            const data = response.data;
            login(data.token, data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-brand-black px-4 pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-amber/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10"
            >
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-gold to-brand-amber rounded-2xl flex items-center justify-center text-black shadow-lg">
                        <Eye size={32} strokeWidth={2.5} />
                    </div>
                </div>

                <h2 className="text-3xl font-serif font-bold text-center mb-2">Welcome Back</h2>
                <p className="text-gray-400 text-center mb-8">Sign in to access your premium account.</p>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 focus:outline-none transition-all placeholder:text-gray-600"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <a href="#" className="text-xs text-brand-gold hover:text-brand-amber transition-colors">Forgot?</a>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 focus:outline-none transition-all placeholder:text-gray-600"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-brand-gold to-brand-amber text-black font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(255,193,7,0.3)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-lg mt-4"
                    >
                        Sign In <ArrowRight size={20} />
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-brand-gold font-bold hover:text-brand-amber transition-colors">
                        Create Account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
