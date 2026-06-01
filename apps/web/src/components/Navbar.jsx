import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`bg-surface/80 dark:bg-surface-container/80 backdrop-blur-md fixed top-0 w-full border-b border-outline-variant/30 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
      id="mainNav"
    >
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex items-center gap-stack-lg">
          <Link
            className="font-headline-md text-headline-md text-primary dark:text-primary-fixed-dim tracking-tight"
            to="/"
          >
            Venellopy.io
          </Link>
          <div className="hidden md:flex gap-stack-md">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-label-md text-label-md pb-1 transition-all duration-200 hover:scale-105 active:scale-95 border-b-2 ${
                  isActive
                    ? 'text-primary dark:text-primary-fixed-dim border-primary dark:border-primary-fixed-dim'
                    : 'text-secondary dark:text-secondary-fixed-dim border-transparent hover:text-primary dark:hover:text-primary-fixed-dim'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `font-label-md text-label-md pb-1 transition-all duration-200 hover:scale-105 active:scale-95 border-b-2 ${
                  isActive
                    ? 'text-primary dark:text-primary-fixed-dim border-primary dark:border-primary-fixed-dim'
                    : 'text-secondary dark:text-secondary-fixed-dim border-transparent hover:text-primary dark:hover:text-primary-fixed-dim'
                }`
              }
            >
              Cari
            </NavLink>
          </div>
        </div>
        <div className="flex items-center gap-stack-md">
          {!user ? (
            <>
              <Link to="/login" className="hidden md:block font-label-md text-label-md text-secondary hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="hidden md:block font-label-md text-label-md text-secondary hover:text-primary transition-colors">
                Daftar
              </Link>
            </>
          ) : (
            <Link to="/user/dashboard" className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 inline-block text-center">
              Profile
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
