import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Lock } from 'lucide-react';
import api, { authAPI } from '../api';
import emailjs from '@emailjs/browser';

// EMAILJS CONFIGURATION
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function Signup() {
    const [step, setStep] = useState(1); // 1 = Details, 2 = OTP
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (location.state?.email && location.state?.step) {
            setFormData(prev => ({ ...prev, email: location.state.email }));
            setStep(location.state.step);
        }
    }, [location.state]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendEmailOtp = async (email: string, otpCode: string, name: string) => {
        try {
            if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
                console.warn("EmailJS not configured. OTP:", otpCode);
                alert(`[DEV MODE / NO EMAILJS] OTP: ${otpCode}`);
                return;
            }

            const templateParams = {
                email: email,
                to_name: name,
                passcode: otpCode,
                time: "10 minutes"
            };

            console.log("Sending EmailJS with params:", templateParams);

            const result = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );
            console.log("EmailJS Result:", result.text);
            console.log("Email sent successfully!");
        } catch (err: any) {
            console.error("Failed to send email:", err);
            // Fallback to show OTP if email fails, so user isn't stuck
            alert(`[EMAIL FAILED] Error: ${err?.text || 'Unknown'}\n\nBackup OTP: ${otpCode}`);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await authAPI.register(formData);

            if (response.data.otp) {
                await sendEmailOtp(formData.email, response.data.otp, formData.name);
            }

            setStep(2); // Move to OTP step
        } catch (err: any) {
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await api.post('/auth/verify-otp', { email: formData.email, otp });
            const data = response.data;
            login(data.token, data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setIsLoading(true);
        try {
            const response = await api.post('/auth/resend-otp', { email: formData.email });

            if (response.data.otp) {
                await sendEmailOtp(formData.email, response.data.otp, formData.name || "User");
                alert('New OTP sent to your email!');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setIsLoading(false);
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={step}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10"
            >
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-gold to-brand-amber rounded-2xl flex items-center justify-center text-black shadow-lg">
                        {step === 1 ? <Eye size={32} strokeWidth={2.5} /> : <Lock size={32} strokeWidth={2.5} />}
                    </div>
                </div>

                <h2 className="text-3xl font-serif font-bold text-center mb-2">
                    {step === 1 ? 'Join AB Optician' : 'Verify Email'}
                </h2>
                <p className="text-gray-400 text-center mb-8">
                    {step === 1 ? 'Create an account to start your journey.' : `Enter the OTP sent to ${formData.email}`}
                </p>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 focus:outline-none transition-all placeholder:text-gray-600 disabled:opacity-50"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 focus:outline-none transition-all placeholder:text-gray-600 disabled:opacity-50"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 focus:outline-none transition-all placeholder:text-gray-600 disabled:opacity-50 pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-brand-gold to-brand-amber text-black font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(255,193,7,0.3)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Sending OTP...' : (
                                <>Continue <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">One-Time Password</label>
                            <input
                                type="text"
                                required
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                disabled={isLoading}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/50 focus:outline-none transition-all placeholder:text-gray-600 tracking-[0.5em] text-center font-bold text-xl disabled:opacity-50"
                                placeholder="000000"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-brand-gold to-brand-amber text-black font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(255,193,7,0.3)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Verifying...' : (
                                <>Verify & Login <ArrowRight size={20} /></>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isLoading}
                            className="w-full text-sm text-gray-400 hover:text-white transition-colors py-2"
                        >
                            Didn't receive code? <span className="text-brand-gold font-bold">Resend</span>
                        </button>
                    </form>
                )}

                {step === 1 && (
                    <div className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-gold font-bold hover:text-brand-amber transition-colors">
                            Sign In
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
