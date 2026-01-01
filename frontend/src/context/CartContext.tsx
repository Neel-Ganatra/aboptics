import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Product {
    id: number | string;
    name: string;
    price: number;
    image: string;
    category?: string;
    quantity?: number;
    imageUrl?: string;
}

interface CartContextType {
    items: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number | string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Product[]>([]);

    const addToCart = (product: Product) => {
        setItems(prev => [...prev, product]);
    };

    const removeFromCart = (id: number | string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
