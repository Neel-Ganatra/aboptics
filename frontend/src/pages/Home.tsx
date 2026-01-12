import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail, MapPin, Clock, Home as HomeIcon, Calendar, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function Home() {
    return (
        <div className="min-h-screen font-sans">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Background Effects */}
                {/* Background Effects */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black opacity-40" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.8 }}
                        className="inline-block mb-4 md:mb-6 px-4 py-2 md:px-6 rounded-full border border-brand-gold/30 bg-brand-gold/5 backdrop-blur-md"
                    >
                        <span className="text-gold-dark font-bold tracking-widest uppercase text-xs md:text-sm">
                            ★ Premium Optical Service
                        </span>
                    </motion.div>

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-6 md:mb-8 leading-tight text-black dark:text-white"
                    >
                        Store at Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-yellow to-brand-gold relative">
                            Doorstep
                            <span className="absolute -bottom-2 left-0 w-full h-1 bg-brand-gold/60"></span>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-2xl text-gray-800 dark:text-gray-300 mb-8 md:mb-12 max-w-2xl mx-auto font-light leading-relaxed px-4"
                    >
                        Why travel to an optical store when the store can come to you?
                        Our portable showroom brings hundreds of premium frames right to your living room.
                    </motion.p>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full px-4 sm:px-0"
                    >
                        <Link to="/home-store" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-sm tracking-widest uppercase rounded-full hover:bg-brand-gold transition-colors flex items-center justify-center">
                            Book Home Visit <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                        <Link to="/shop" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-sm tracking-widest uppercase rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center">
                            Explore Collection
                        </Link>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto px-2"
                    >
                        {[
                            { label: 'Premium Frames', value: '500+', icon: '👓' },
                            { label: 'Global Brands', value: '50+', icon: '🌟' },
                            { label: 'Home Delivery', value: 'Fast', icon: '🚚' },
                            { label: 'Happy Customers', value: '5000+', icon: '😊' },
                        ].map((stat, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 hover:bg-white/10 hover:border-brand-gold/20 transition-all group hover:-translate-y-1">
                                <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">{stat.icon}</span>
                                <div className="text-center md:text-left">
                                    <h4 className="text-xl md:text-2xl font-bold text-white font-serif">{stat.value}</h4>
                                    <p className="text-[10px] md:text-xs text-brand-gold uppercase tracking-wider font-bold">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Brand Marquee Section */}
            <section id="brands" className="py-12 border-y border-white/5 bg-black/50 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
                <motion.div
                    className="flex space-x-8 w-max"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 30,
                        ease: "linear"
                    }}
                >
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex space-x-12">
                            {['Gucci', 'Prada', 'Versace', 'Tom Ford', 'Burberry', 'Ray-Ban', 'Oakley', 'Carrera'].map((brand) => (
                                <div key={brand} className="px-8 py-4 bg-white/5 rounded-xl border border-white/10 min-w-[150px] flex items-center justify-center">
                                    <span className="text-xl md:text-2xl font-serif font-bold text-gray-500 dark:text-gray-400 opacity-70 hover:opacity-100 hover:text-yellow-700 dark:hover:text-brand-gold transition-all cursor-default">
                                        {brand}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* Service Cards Section */}
            <section id="services" className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            className="bg-brand-dark/50 border border-white/5 rounded-3xl p-8 hover:border-brand-gold/30 transition-colors group"
                        >
                            <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center mb-6 text-yellow-700 dark:text-brand-gold text-3xl">#</div>
                            <h3 className="text-3xl font-bold mb-4 font-serif text-gray-900 dark:text-white">Premium Frames</h3>
                            <p className="text-gray-700 dark:text-gray-400 mb-6 leading-relaxed">
                                Curated collection of designer frames from world-renowned brands. Fast delivery with a seamless selection experience.
                            </p>
                            <div className="flex gap-3 mb-8">
                                <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-brand-gold/80">500+ Styles</span>
                                <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-brand-gold/80">Fast Delivery</span>
                            </div>
                            <Link to="/shop" className="text-yellow-700 dark:text-brand-gold font-bold flex items-center hover:translate-x-2 transition-transform">
                                Learn More <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </motion.div>

                        {/* Card 2 (Highlighted) */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            transition={{ delay: 0.2 }}
                            className="relative bg-gradient-to-b from-brand-gold/10 to-transparent border border-brand-gold/30 rounded-3xl p-8 transform md:-translate-y-4"
                        >
                            <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-brand-gold to-brand-amber text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                                Most Popular
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-brand-gold to-brand-amber rounded-xl flex items-center justify-center mb-6 text-black text-3xl shadow-lg">☀</div>
                            <h3 className="text-3xl font-bold mb-4 font-serif text-gray-900">Sunglasses & Power Specs</h3>
                            <p className="text-gray-800 mb-6 leading-relaxed">
                                Protect your eyes in style. We bring our portable store to your doorstep for the ultimate convenience.
                            </p>
                            <div className="flex gap-3 mb-8">
                                <span className="px-3 py-1 bg-black/30 rounded-full text-xs text-brand-gold">UV Protection</span>
                                <span className="px-3 py-1 bg-black/30 rounded-full text-xs text-brand-gold">Home Try-On</span>
                            </div>
                            <Link to="/sunglasses" className="text-brand-gold font-bold flex items-center hover:translate-x-2 transition-transform">
                                Learn More <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            transition={{ delay: 0.4 }}
                            className="bg-brand-dark/50 border border-white/5 rounded-3xl p-8 hover:border-brand-gold/30 transition-colors group"
                        >
                            <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-xl flex items-center justify-center mb-6 text-yellow-700 dark:text-brand-gold text-3xl">👓</div>
                            <h3 className="text-3xl font-bold mb-4 font-serif text-gray-900 dark:text-white">All Brand Lenses</h3>
                            <p className="text-gray-700 dark:text-gray-400 mb-6 leading-relaxed">
                                From single vision to progressive, we offer premium lenses from all major brands with precise customization.
                            </p>
                            <div className="flex gap-3 mb-8">
                                <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-brand-gold/80">Custom Lenses</span>
                                <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-brand-gold/80">Warranty</span>
                            </div>
                            <Link to="/lenses" className="text-brand-gold font-bold flex items-center hover:translate-x-2 transition-transform">
                                Learn More <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* "We Bring the Store to You" Section */}
            <section id="why-us" className="py-24 bg-brand-dark/30">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="mb-16">
                        <h4 className="text-yellow-700 dark:text-brand-gold font-bold tracking-widest uppercase mb-2">OUR UNIQUE SERVICE</h4>
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
                            We Bring the <br />
                            <span className="text-yellow-700 dark:text-brand-gold">Store to You</span>
                        </h2>
                        <p className="text-gray-700 dark:text-gray-400 text-lg max-w-2xl">
                            Why travel to an optical store when the store can come to you? Our portable showroom brings hundreds of premium frames, expert eye testing, and personalized consultation right to your doorstep.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: "Shop from the comfort of your home", icon: <HomeIcon className="w-6 h-6" /> },
                            { title: "Portable store with 200+ frames", icon: <CheckCircle className="w-6 h-6" /> },
                            { title: "Flexible scheduling, 7 days a week", icon: <Clock className="w-6 h-6" /> },
                            { title: "Expert eye testing & consultation", icon: <Calendar className="w-6 h-6" /> }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center gap-6 hover:bg-white/10 transition-colors"
                            >
                                <div className="w-12 h-12 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center flex-shrink-0">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact / CTA Section */}
            <section id="contact" className="py-24">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-gradient-to-br from-white/10 to-black border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 relative overflow-hidden">
                        {/* Glow Effect */}
                        <div className="absolute top-0 left-0 w-full h-full bg-brand-gold/5 blur-3xl pointer-events-none" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 md:mb-6">
                                    Ready for a Perfect <br />
                                    <span className="text-brand-gold">Vision Experience?</span>
                                </h2>
                                <p className="text-gray-700 dark:text-gray-400 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
                                    Book your free home consultation today. Our experts will bring premium frames, conduct eye tests, and help you find your perfect pair.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/home-store" className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-brand-gold to-brand-amber text-black font-bold rounded-full hover:shadow-lg transition-all flex items-center justify-center">
                                        Book Home Visit <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                    <a href="tel:+918320134629" className="px-6 py-3 md:px-8 md:py-4 border border-white/20 rounded-full hover:bg-white/10 transition-all flex items-center justify-center font-bold text-white">
                                        <Phone className="mr-2 w-5 h-5" /> Call Now
                                    </a>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-black/40 p-6 rounded-2xl flex items-center gap-4 border border-white/5">
                                    <div className="w-12 h-12 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-brand-gold uppercase tracking-wider font-bold">Phone</p>
                                        <p className="text-lg font-bold">+91 8320134629</p>
                                    </div>
                                </div>
                                <div className="bg-black/40 p-6 rounded-2xl flex items-center gap-4 border border-white/5">
                                    <div className="w-12 h-12 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-brand-gold uppercase tracking-wider font-bold">Email</p>
                                        <p className="text-lg font-bold">aboptical.work@gmail.com</p>
                                    </div>
                                </div>
                                <div className="bg-black/40 p-6 rounded-2xl flex items-center gap-4 border border-white/5">
                                    <div className="w-12 h-12 bg-brand-gold/20 text-brand-gold rounded-full flex items-center justify-center">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-brand-gold uppercase tracking-wider font-bold">Location</p>
                                        <p className="text-lg font-bold">Ahmedabad, Gujarat</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 bg-black">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center text-black font-bold text-xl">
                            👓
                        </div>
                        <span className="text-xl font-bold font-serif">AB Optician</span>
                    </div>
                    <div className="flex gap-8 text-gray-400 text-sm">
                        <a href="#services" className="hover:text-brand-gold transition-colors">Services</a>
                        <a href="#why-us" className="hover:text-brand-gold transition-colors">Why Us</a>
                        <a href="#brands" className="hover:text-brand-gold transition-colors">Brands</a>
                        <a href="#contact" className="hover:text-brand-gold transition-colors">Contact</a>
                    </div>
                    <p className="text-gray-600 text-sm">© 2024 AB Optician. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
