import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    alert('Anda telah keluar.');
    navigate('/');
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col pt-24">
      <div className="flex-grow pb-stack-xl px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full flex flex-col md:flex-row gap-gutter">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0 mb-stack-lg md:mb-0">
          <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-[0_2px_4px_#1a1a2e05,0_12px_20px_#1a1a2e10] sticky top-28 border border-outline-variant/20">
            <nav className="flex flex-col gap-stack-xs">
              <NavLink
                to="/user/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-label-md text-label-md ${
                    isActive
                      ? 'bg-primary-container/20 text-primary font-bold'
                      : 'text-secondary hover:bg-surface-container hover:text-primary'
                  }`
                }
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>dashboard</span>
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/user/profile"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-label-md text-label-md ${
                    isActive
                      ? 'bg-primary-container/20 text-primary font-bold'
                      : 'text-secondary hover:bg-surface-container hover:text-primary'
                  }`
                }
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>person</span>
                <span>Profil Saya</span>
              </NavLink>

              <NavLink
                to="/user/history"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-label-md text-label-md ${
                    isActive
                      ? 'bg-primary-container/20 text-primary font-bold'
                      : 'text-secondary hover:bg-surface-container hover:text-primary'
                  }`
                }
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>history</span>
                <span>Riwayat Pesanan</span>
              </NavLink>

              <hr className="border-outline-variant/30 my-stack-sm" />
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error-container hover:text-on-error-container transition-colors font-label-md text-label-md text-left"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>logout</span>
                <span>Keluar</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
