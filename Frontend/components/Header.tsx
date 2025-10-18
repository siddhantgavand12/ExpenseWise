import React, { useState, useEffect } from 'react';
import { Link } from './Router';
import { MenuIcon, XIcon, SunIcon, MoonIcon } from './icons';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

    useEffect(() => {
        const root = window.document.documentElement;
        const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (theme === 'dark' || (theme === 'system' && systemIsDark)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const navLinks = [
        { path: '/', label: 'Dashboard' },
        { path: '/budgets', label: 'Budgets' },
        { path: '/charts', label: 'Charts' },
        { path: '/reports', label: 'Reports' },
        { path: '/ai-advisor', label: 'AI Advisor' },
    ];

    const getLinkClass = (isActive: boolean) => 
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive 
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' 
            : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700'
        }`;

    const getMobileLinkClass = (isActive: boolean) => 
        `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
            isActive 
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-white' 
            : 'text-gray-500 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
        }`;

    return (
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm no-print">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary-600 dark:bg-primary-500">
                                <span className="font-bold text-lg text-white">EW</span>
                            </div>
                            <span className="font-bold text-xl text-gray-800 dark:text-gray-200">ExpenseWise</span>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navLinks.map(link => (
                                    <Link key={link.path} to={link.path} className={getLinkClass}>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-primary-500"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                        </button>
                        <div className="md:hidden ml-2">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {isMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                            <Link key={link.path} to={link.path} className={getMobileLinkClass} onClick={() => setIsMenuOpen(false)}>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;