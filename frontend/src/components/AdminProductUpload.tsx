import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Wand2, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import { productAPI } from '../api';

interface AdminProductUploadProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AdminProductUpload({ onClose, onSuccess }: AdminProductUploadProps) {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [aiEnhanced, setAiEnhanced] = useState(false);
    const [processingAi, setProcessingAi] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        brand: '',
        category: 'Frames',
        stock: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setImages(prev => [...prev, ...newFiles]);

            // Create previews
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleAiEnhance = async () => {
        if (images.length === 0) return;

        setProcessingAi(true);
        try {
            const formData = new FormData();
            formData.append('image', images[0]);

            const response = await productAPI.enhance(formData);

            if (response.data.success) {
                const enhancedUrl = response.data.url;

                // 1. Update Preview
                const newPreviews = [...previewUrls];
                newPreviews[0] = enhancedUrl;
                setPreviewUrls(newPreviews);

                // 2. Convert URL to File to replace the original upload
                // This ensures the enhanced image is what gets submitted
                const imageResponse = await fetch(enhancedUrl);
                const blob = await imageResponse.blob();
                const enhancedFile = new File([blob], "enhanced_image.png", { type: "image/png" });

                const newImages = [...images];
                newImages[0] = enhancedFile;
                setImages(newImages);

                setAiEnhanced(true);
            }
        } catch (error) {
            console.error("AI Enhancement failed", error);
            alert("Failed to process image. Please try again.");
        } finally {
            setProcessingAi(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('brand', formData.brand);
            data.append('category', formData.category);
            data.append('stock', formData.stock);

            images.forEach((image) => {
                data.append('images', image);
            });

            await productAPI.create(data);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Upload failed:', error);
            alert(error.response?.data?.message || 'Failed to upload product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex justify-between items-center p-6 bg-[#111]/80 backdrop-blur-md border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-gold rounded-lg text-black">
                            <Upload size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white font-serif">Upload New Product</h2>
                            <p className="text-xs text-gray-400">Add styled frames to your collection</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Column - Image Studio */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Product Studio</h3>
                            {images.length > 0 && (
                                <button
                                    onClick={handleAiEnhance}
                                    disabled={processingAi || aiEnhanced}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${aiEnhanced
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                        : 'bg-brand-gold text-black hover:bg-white'
                                        }`}
                                >
                                    {processingAi ? <Loader2 className="animate-spin w-3 h-3" /> : <Wand2 className="w-3 h-3" />}
                                    {aiEnhanced ? 'AI Enhanced' : 'AI Enhance Images'}
                                </button>
                            )}
                        </div>

                        {/* Main Upload Area */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-3xl aspect-square flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden ${images.length > 0 ? 'border-brand-gold/50 bg-black' : 'border-white/10 hover:border-brand-gold/50 hover:bg-white/5'
                                }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                multiple
                                accept="image/*"
                                className="hidden"
                            />

                            {images.length > 0 ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={previewUrls[0]}
                                        alt="Main Preview"
                                        className={`w-full h-full object-contain p-8 transition-all duration-700`}
                                    />
                                    {aiEnhanced && (
                                        <>
                                            {/* White Studio Background */}
                                            <div className="absolute inset-0 bg-white -z-10" />
                                            {/* Subtle White Vignette */}
                                            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(255,255,255,1)_100%)] z-10 mix-blend-multiply" />
                                            <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg z-20">
                                                Enhanced
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="text-gray-500 group-hover:text-brand-gold transition-colors" size={32} />
                                    </div>
                                    <p className="text-gray-400 font-medium">Click to upload photos</p>
                                    <p className="text-xs text-gray-600 mt-2">Supports JPG, PNG (Max 5MB)</p>
                                </>
                            )}

                            {/* AI Processing Overlay */}
                            <AnimatePresence>
                                {processingAi && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                                    >
                                        <div className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mb-4" />
                                        <p className="text-brand-gold font-bold animate-pulse">Removing Background...</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {previewUrls.map((url, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                        <img src={url} className="w-full h-full object-cover" />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx); }}
                                            className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {aiEnhanced && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start gap-3">
                                <Check className="text-green-500 w-5 h-5 mt-0.5" />
                                <div>
                                    <p className="text-green-400 text-sm font-bold">Studio Enhancement Applied</p>
                                    <p className="text-green-500/60 text-xs mt-1">Backgrounds removed, lighting corrected, and centered.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Details */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                                    placeholder="e.g. Classic Aviator Gold"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Brand</label>
                                    <input
                                        required
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                                        placeholder="e.g. Ray-Ban"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors appearance-none"
                                    >
                                        <option value="Frames">Frames</option>
                                        <option value="Sunglasses">Sunglasses</option>
                                        <option value="Lenses">Lenses</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price (Rs.)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Stock</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold transition-colors resize-none"
                                    placeholder="Describe the product features..."
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 rounded-xl font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-brand-gold to-brand-amber text-black py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(255,193,7,0.4)] transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
}
