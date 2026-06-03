import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

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

  const isTransparent = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent text-white py-2'
          : 'bg-surface/90 dark:bg-surface-container/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm py-0 text-on-surface'
      }`}
      id="mainNav"
    >
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex items-center gap-stack-lg">
          <Link
            className={`font-headline-md text-headline-md tracking-tight ${isTransparent ? 'text-white' : 'text-primary dark:text-primary-fixed-dim'}`}
            to="/"
          >
            Venellopy.io
          </Link>
          <div className="hidden md:flex gap-stack-md">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-label-md text-label-md pb-1 transition-all duration-200 hover:scale-105 active:scale-95 border-b-2 ${
                  isTransparent
                    ? isActive ? 'text-white border-white' : 'text-white/80 border-transparent hover:text-white'
                    : isActive
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
                  isTransparent
                    ? isActive ? 'text-white border-white' : 'text-white/80 border-transparent hover:text-white'
                    : isActive
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
              <Link to="/login" className={`font-label-md text-label-md transition-colors ${isTransparent ? 'text-white hover:text-white/80' : 'text-secondary hover:text-primary'}`}>
                Sign In
              </Link>
              <Link to="/register" className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${isTransparent ? 'bg-white text-primary hover:bg-white/90' : 'bg-primary text-on-primary hover:opacity-90'}`}>
                Daftar
              </Link>
            </>
          ) : (
            <Link to="/user/dashboard" className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 inline-block text-center ${isTransparent ? 'bg-white text-primary hover:bg-white/90' : 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'}`}>
              Profile
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className={`md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg transition-colors ${isTransparent ? 'hover:bg-white/10' : 'hover:bg-surface-container'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          id="mobileMenuToggle"
        >
          <span className={`block w-5 h-0.5 transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-on-surface'} ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-5 h-0.5 mt-1 transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-on-surface'} ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-0.5 mt-1 transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-on-surface'} ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
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
