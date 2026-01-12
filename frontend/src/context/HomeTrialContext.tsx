import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';

export interface TrialProduct {
    id: number | string;
    name: string;
    price: number;
    image: string;
    category?: string;
}

interface HomeTrialContextType {
    trialItems: TrialProduct[];
    addToTrial: (product: TrialProduct) => void;
    removeFromTrial: (id: number | string) => void;
    clearTrial: () => void;
    isInTrial: (id: number | string) => boolean;
}

const HomeTrialContext = createContext<HomeTrialContextType | undefined>(undefined);

export function HomeTrialProvider({ children }: { children: ReactNode }) {
    const [trialItems, setTrialItems] = useState<TrialProduct[]>(() => {
        const stored = localStorage.getItem('homeTrialItems');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('homeTrialItems', JSON.stringify(trialItems));
    }, [trialItems]);

    const addToTrial = (product: TrialProduct) => {
        if (trialItems.length >= 5) {
            alert("You can select up to 5 frames for Home Trial.");
            return;
        }
        if (trialItems.some(item => item.id === product.id)) {
            alert("Item already in Home Trial cart.");
            return;
        }
        setTrialItems(prev => [...prev, product]);
    };

    const removeFromTrial = (id: number | string) => {
        setTrialItems(prev => prev.filter(item => item.id !== id));
    };

    const clearTrial = () => {
        setTrialItems([]);
    };

    const isInTrial = (id: number | string) => {
        return trialItems.some(item => item.id === id);
    };

    return (
        <HomeTrialContext.Provider value={{ trialItems, addToTrial, removeFromTrial, clearTrial, isInTrial }}>
            {children}
        </HomeTrialContext.Provider>
    );
}

export function useHomeTrial() {
    const context = useContext(HomeTrialContext);
    if (context === undefined) {
        throw new Error('useHomeTrial must be used within a HomeTrialProvider');
    }
    return context;
}
