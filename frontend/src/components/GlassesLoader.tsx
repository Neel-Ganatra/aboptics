import { motion } from 'framer-motion';

export default function OpticianLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950">
            <div className="relative">
                {/* Main Glasses Icon */}
                <svg width="180" height="80" viewBox="0 0 120 60" className="drop-shadow-[0_0_15px_rgba(255,193,7,0.3)]">
                    <g fill="none" stroke="#FFC107" strokeWidth="4" strokeLinecap="round">
                        {/* Lenses with a "Glass" shimmer effect */}
                        <circle cx="30" cy="30" r="20" />
                        <circle cx="90" cy="30" r="20" />
                        <path d="M50 30 Q60 20 70 30" /> {/* Bridge */}

                        {/* Scanning Light Beam */}
                        <motion.rect
                            width="5"
                            height="40"
                            fill="#FFC107"
                            initial={{ x: 0, opacity: 0 }}
                            animate={{ x: 120, opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="blur-[2px]"
                        />
                    </g>
                </svg>

                {/* Loading Text with Blur-to-Focus Effect */}
                <motion.div
                    className="mt-8 text-center"
                    initial={{ filter: "blur(8px)", opacity: 0 }}
                    animate={{ filter: "blur(0px)", opacity: 1 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                    }}
                >
                    <p className="text-[#FFC107] font-bold tracking-[0.4em] uppercase text-sm">
                        Perfecting Vision
                    </p>
                    <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-[#FFC107]"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, repeat: Infinity, ease: "circIn" }}
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}