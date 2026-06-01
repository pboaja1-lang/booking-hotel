import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Kamar', path: '/admin/kamar', icon: 'bed' },
    { name: 'Booking', path: '/admin/booking', icon: 'book_online' },
    { name: 'Tamu', path: '/admin/tamu', icon: 'group' },
    { name: 'Pengaturan', path: '/admin/pengaturan', icon: 'settings' },
  ];

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row antialiased font-body-md">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-30
        w-64 bg-surface-container-lowest border-r border-surface-variant 
        flex-shrink-0 flex flex-col h-screen shadow-[4px_0_24px_rgba(26,26,46,0.02)]
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-20 flex items-center px-6 border-b border-surface-variant/30 flex-shrink-0">
          <span className="font-headline-md text-headline-md text-primary tracking-tight material-symbols-outlined mr-2">hotel</span>
          <span className="font-headline-md text-headline-md text-primary tracking-tight">StayEase</span>
          <span className="ml-2 font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full mt-1 inline-block">Admin</span>
          
          <button 
            className="ml-auto md:hidden text-secondary p-1 rounded-md hover:bg-surface-container"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-label-md text-label-md relative
                ${isActive 
                  ? 'bg-primary-container/10 text-primary' 
                  : 'text-secondary hover:bg-surface-container hover:text-on-surface'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></div>
                  )}
                  <span className={`material-symbols-outlined ${isActive ? 'fill' : ''}`} style={isActive ? {fontVariationSettings: "'FILL' 1"} : {}}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-surface-variant/30">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-label-md">
              AD
            </div>
            <div>
              <div className="font-label-md text-label-md text-on-surface">Admin User</div>
              <div className="font-body-sm text-body-sm text-secondary">admin@stayease.com</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error-container/50 transition-colors font-label-md text-label-md"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-background relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden bg-surface-container-lowest h-16 flex items-center justify-between px-4 border-b border-surface-variant shadow-sm z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">hotel</span>
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight">StayEase</span>
            <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full mt-1">Admin</span>
          </div>
          <button 
            className="text-secondary p-2 rounded-md hover:bg-surface-container"
            onClick={() => setIsSidebarOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
