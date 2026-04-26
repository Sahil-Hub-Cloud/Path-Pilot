'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'modern' | 'cybernetic' | 'academic';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'cybernetic',
    setTheme: () => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('cybernetic');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('app_theme') as Theme;
        if (saved && (saved === 'cybernetic' || saved === 'modern' || saved === 'academic')) {
            setTheme(saved);
        } else {
            setTheme('cybernetic');
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Safety check: Avoid light mode persistent failure by defaulting 'modern' back to 'cybernetic'
        // for users who transition from older versions.
        if (theme === 'modern' && !localStorage.getItem('theme_choice_stable')) {
            setTheme('cybernetic');
            localStorage.setItem('theme_choice_stable', 'true');
        }

        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app_theme', theme);
    }, [theme, mounted]);

    // Prevent hydration mismatch by rendering cleanup
    if (!mounted) return <>{children}</>;

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
