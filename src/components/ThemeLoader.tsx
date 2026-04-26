'use client';

import { useEffect } from 'react';

export default function ThemeLoader() {
    useEffect(() => {
        // Apply saved theme on mount
        const savedTheme = localStorage.getItem('app_theme');
        if (savedTheme === 'matrix') {
            document.documentElement.classList.add('theme-matrix');
        }
    }, []);

    return null;
}
