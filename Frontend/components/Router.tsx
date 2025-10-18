import React, { useState, useEffect, useContext, createContext } from 'react';

// 1. Create a context to hold the current path.
interface RouterContextType {
  path: string;
}
const RouterContext = createContext<RouterContextType | null>(null);

/**
 * The Router component is a provider that wraps the application.
 * It listens for hash changes and provides the current path to all
 * descendant components via context.
 */
export const Router: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to '/' if the hash is empty or just '#'
  const [path, setPath] = useState(window.location.hash.substring(1) || '/');

  useEffect(() => {
    const onHashChange = () => {
      setPath(window.location.hash.substring(1) || '/');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <RouterContext.Provider value={{ path }}>
      {children}
    </RouterContext.Provider>
  );
};

/**
 * The Route component conditionally renders its children if its path
 * prop matches the current path from the Router context.
 */
interface RouteProps {
  path: string;
  children: React.ReactNode;
}
export const Route: React.FC<RouteProps> = ({ path, children }) => {
  const router = useContext(RouterContext);
  if (!router) {
    throw new Error('Route component must be rendered within a Router component');
  }
  return router.path === path ? <>{children}</> : null;
};

/**
 * The Link component is a wrapper around the `<a>` tag that handles
 * hash-based navigation and can determine if it is the "active" link.
 */
interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string | ((isActive: boolean) => string);
  // FIX: Added an optional onClick handler to support custom click actions, like closing the mobile menu.
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}
export const Link: React.FC<LinkProps> = ({ to, children, className, onClick }) => {
    const router = useContext(RouterContext);
    if (!router) {
        throw new Error('Link component must be rendered within a Router component');
    }
    // A link is active if its 'to' prop matches the current path in the router context.
    const isActive = router.path === to;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Allow default behavior for new tabs (ctrl/cmd click)
        if (e.ctrlKey || e.metaKey) {
            return;
        }
        e.preventDefault();
        window.location.hash = to;
        // FIX: Call the provided onClick handler if it exists.
        if (onClick) {
            onClick(e);
        }
    };
    
    // Resolve className, supporting a function to apply active styles.
    const resolvedClassName = typeof className === 'function' ? className(isActive) : className;

    return (
        <a href={`#${to}`} onClick={handleClick} className={resolvedClassName}>
            {children}
        </a>
    );
};
