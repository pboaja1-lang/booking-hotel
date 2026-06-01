import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardOverview() {
  const { user, history } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Tamu';
  
  const activeBookings = history?.filter(b => b.status === 'Aktif') || [];
  const completedBookings = history?.filter(b => b.status === 'Selesai') || [];
  const upcomingBooking = activeBookings.length > 0 ? activeBookings[0] : null;
  return (
    <main className="flex flex-col gap-stack-xl">
      {/* Welcome Header */}
      <section>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-xs">Selamat Datang, {firstName}! 👋</h1>
        <p className="font-body-lg text-body-lg text-secondary">Kelola pemesanan dan akun Anda di sini.</p>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant/30 shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.02)] flex flex-col gap-stack-sm hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-secondary">Total Booking</span>
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">book_online</span>
            </div>
          </div>
          <span className="font-headline-xl text-headline-xl text-on-surface">{history?.length || 0}</span>
        </div>
        
        <div className="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant/30 shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.02)] flex flex-col gap-stack-sm hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-secondary">Akan Datang</span>
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">event_upcoming</span>
            </div>
          </div>
          <span className="font-headline-xl text-headline-xl text-primary">{activeBookings.length}</span>
        </div>
        
        <div className="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant/30 shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.02)] flex flex-col gap-stack-sm hover:scale-[1.02] transition-transform duration-200">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-secondary">Selesai</span>
            <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          </div>
          <span className="font-headline-xl text-headline-xl text-on-surface">{completedBookings.length}</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Upcoming Booking */}
        <section className="lg:col-span-2 flex flex-col gap-stack-md">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">BOOKING AKAN DATANG</h2>
          {upcomingBooking ? (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.02)] overflow-hidden hover:scale-[1.01] transition-transform duration-200 flex flex-col md:flex-row">
              <div className="w-full md:w-48 h-48 md:h-auto bg-surface-variant relative">
                <img alt="Hotel room" className="w-full h-full object-cover" src={upcomingBooking.image} />
              </div>
              <div className="p-stack-md flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-stack-xs">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{upcomingBooking.hotel}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm">
                      Confirmed
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary mb-stack-sm">{upcomingBooking.roomType}</p>
                  <div className="flex items-center gap-2 text-secondary font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    <span>{upcomingBooking.dates}</span>
                  </div>
                </div>
                <div className="mt-stack-md flex justify-end">
                  <Link to={`/user/booking/${upcomingBooking.id.replace('#','')}`} className="font-label-md text-label-md text-primary hover:underline">Lihat Detail</Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant/30 text-center text-secondary font-body-md">
              Belum ada pesanan yang akan datang. <Link to="/search" className="text-primary hover:underline">Cari hotel sekarang!</Link>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="flex flex-col gap-stack-md">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">AKSI CEPAT</h2>
          <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant/30 shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.02)] flex flex-col gap-stack-md">
            <Link to="/search" className="w-full bg-primary-container text-on-primary-container font-label-md text-label-md py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200 shadow-sm">
              <span className="material-symbols-outlined">search</span>
              Cari Hotel Baru
            </Link>
            <Link to="/user/history" className="w-full border border-outline text-on-surface font-label-md text-label-md py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container hover:scale-[1.02] transition-all duration-200">
              <span className="material-symbols-outlined">history</span>
              Lihat Semua Riwayat
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
