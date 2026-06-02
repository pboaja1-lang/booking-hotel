import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu when route changes
  const closeMobileMenu = () => setMobileMenuOpen(false);

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

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-stack-md">
          {!user ? (
            <>
              <Link to="/login" className="font-label-md text-label-md text-secondary hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
                Daftar
              </Link>
            </>
          ) : (
            <Link to="/user/dashboard" className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 inline-block text-center">
              Profile
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-surface-container transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          id="mobileMenuToggle"
        >
          <span className={`block w-5 h-0.5 bg-on-surface transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-on-surface mt-1 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-on-surface mt-1 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-margin-mobile pb-4 pt-2 flex flex-col gap-3 bg-surface/95 dark:bg-surface-container/95 backdrop-blur-md border-t border-outline-variant/20">
          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `font-label-md text-label-md py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary dark:text-primary-fixed-dim bg-primary/10'
                  : 'text-secondary dark:text-secondary-fixed-dim hover:text-primary hover:bg-surface-container'
              }`
            }
          >
            🏠 Home
          </NavLink>
          <NavLink
            to="/search"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `font-label-md text-label-md py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary dark:text-primary-fixed-dim bg-primary/10'
                  : 'text-secondary dark:text-secondary-fixed-dim hover:text-primary hover:bg-surface-container'
              }`
            }
          >
            🔍 Cari Kamar
          </NavLink>
          
          <div className="h-px bg-outline-variant/30 my-1"></div>
          
          {!user ? (
            <>
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="font-label-md text-label-md py-2 px-3 rounded-lg text-secondary hover:text-primary hover:bg-surface-container transition-all duration-200"
              >
                🔑 Sign In
              </Link>
              <Link
                to="/register"
                onClick={closeMobileMenu}
                className="bg-primary text-on-primary py-3 px-4 rounded-lg font-label-md text-label-md text-center hover:opacity-90 transition-all duration-200 shadow-sm"
              >
                ✨ Daftar Sekarang
              </Link>
            </>
          ) : (
            <Link
              to="/user/dashboard"
              onClick={closeMobileMenu}
              className="bg-primary-container text-on-primary-container py-3 px-4 rounded-lg font-label-md text-label-md text-center hover:bg-primary hover:text-on-primary transition-all duration-200 shadow-sm"
            >
              👤 Profile
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
