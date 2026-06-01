import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BookingHistory() {
  const { history, fetchBookings } = useAuth();
  const [filter, setFilter] = useState('Semua');
  const [ticketModal, setTicketModal] = useState(null);

  // Selalu pastikan mengambil data terbaru dari database saat halaman riwayat dibuka
  React.useEffect(() => {
    if (fetchBookings) {
      fetchBookings();
    }
  }, []);

  const filteredHistory = (history || []).filter((item) => {
    if (filter === 'Semua') return true;
    return item.status === filter;
  });

  const formatIDR = (amount) => {
    if (typeof amount === 'number') {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount).replace('Rp', 'Rp ');
    }
    return amount;
  };

  return (
    <main className="flex-grow flex flex-col gap-stack-lg">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md border-b border-outline-variant/30 pb-stack-md">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Riwayat Pemesanan</h1>
          <p className="font-body-md text-body-md text-secondary mt-1">Lacak dan kelola semua reservasi hotel Anda.</p>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-stack-sm hide-scrollbar">
        {['Semua', 'Aktif', 'Selesai', 'Dibatalkan'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors ${
              filter === tab
                ? 'border-2 border-primary bg-primary/10 text-primary'
                : 'border border-outline-variant text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* History List */}
      <div className="flex flex-col gap-stack-md">
        {filteredHistory.length === 0 ? (
          <div className="bg-surface-container-lowest p-stack-xl rounded-xl border border-outline-variant/30 text-center">
            <span className="material-symbols-outlined text-[48px] text-secondary/50 mb-stack-sm block">hotel</span>
            <p className="text-secondary font-body-md">
              {filter === 'Semua' 
                ? 'Belum ada riwayat pemesanan.' 
                : `Tidak ada riwayat pemesanan untuk status "${filter}".`
              }
            </p>
            <Link to="/search" className="inline-block mt-stack-md text-primary font-label-md text-label-md hover:underline">
              Cari Hotel Sekarang →
            </Link>
          </div>
        ) : (
          filteredHistory.map((item, index) => (
            <div key={item.id || index} className="bg-surface-container-lowest rounded-xl p-stack-md border border-outline-variant/50 shadow-[0_2px_4px_#1a1a2e05,0_8px_16px_#1a1a2e08] hover:shadow-[0_4px_8px_#1a1a2e0a,0_16px_32px_#1a1a2e15] transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex flex-col md:flex-row gap-stack-md">
                {/* Image */}
                <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container relative">
                  <img alt="Hotel room" className="w-full h-full object-cover" src={item.image} />
                </div>
                
                {/* Details */}
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-1 ${
                          item.status === 'Aktif' ? 'bg-tertiary-container/20 text-tertiary' : 
                          item.status === 'Selesai' ? 'bg-surface-variant text-secondary' : 
                          'bg-error-container/20 text-error'
                        }`}>
                          {item.status === 'Aktif' ? 'Confirmed' : item.status === 'Selesai' ? 'Completed' : 'Cancelled'}
                        </span>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{item.hotel}</h3>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary bg-surface-container px-2 py-1 rounded">{item.id}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-2 mt-3">
                      <div className="flex items-center gap-2 text-secondary">
                        <span className="material-symbols-outlined text-[18px]">bed</span>
                        <span className="font-body-sm text-body-sm">{item.roomType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-secondary">
                        <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                        <span className="font-body-sm text-body-sm">{item.dates}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between mt-4 md:mt-0">
                    <div>
                      <p className="font-label-sm text-label-sm text-secondary">Total Harga</p>
                      <p className="font-headline-sm text-headline-sm text-primary">{typeof item.total === 'number' ? formatIDR(item.total) : item.price}</p>
                    </div>
                    {item.status === 'Aktif' ? (
                      <button 
                        onClick={() => setTicketModal(item)}
                        className="bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-md text-label-md py-2 px-6 rounded-lg transition-colors"
                      >
                        Lihat E-Ticket
                      </button>
                    ) : (
                      <Link to="/search" className="border border-outline text-on-surface hover:bg-surface-container font-label-md text-label-md py-2 px-6 rounded-lg transition-colors">
                        Pesan Lagi
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* E-Ticket Modal */}
      {ticketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setTicketModal(null)}>
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[fadeIn_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
            {/* Ticket Header */}
            <div className="bg-primary-container text-on-primary-container p-stack-lg text-center">
              <span className="material-symbols-outlined text-[40px] mb-2">confirmation_number</span>
              <h2 className="font-headline-md text-headline-md">E-Ticket</h2>
              <p className="font-body-sm text-body-sm opacity-80">Kode Booking: {ticketModal.id}</p>
            </div>
            
            {/* Ticket Body */}
            <div className="p-stack-lg space-y-stack-md">
              <div className="flex gap-stack-md items-center">
                <img src={ticketModal.image} alt="" className="w-20 h-20 rounded-lg object-cover" />
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{ticketModal.hotel}</h3>
                  <p className="font-body-sm text-body-sm text-secondary">{ticketModal.location || 'Jakarta'}</p>
                </div>
              </div>
              
              <div className="border-t border-dashed border-outline-variant/50 pt-stack-md grid grid-cols-2 gap-y-stack-md">
                <div>
                  <p className="font-label-sm text-label-sm text-secondary">Tipe Kamar</p>
                  <p className="font-body-md text-body-md text-on-surface">{ticketModal.roomType}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-secondary">Tamu</p>
                  <p className="font-body-md text-body-md text-on-surface">{ticketModal.guests || '2 Dewasa'}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-secondary">Tanggal</p>
                  <p className="font-body-md text-body-md text-on-surface">{ticketModal.dates}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-secondary">Durasi</p>
                  <p className="font-body-md text-body-md text-on-surface">{ticketModal.nights || 2} Malam</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-secondary">Pembayaran</p>
                  <p className="font-body-md text-body-md text-on-surface">{ticketModal.paymentMethod || 'Transfer Bank'}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-secondary">Status</p>
                  <p className="font-body-md text-body-md text-tertiary font-semibold">Confirmed ✓</p>
                </div>
              </div>

              <div className="border-t border-dashed border-outline-variant/50 pt-stack-md flex justify-between items-center">
                <span className="font-label-md text-label-md text-on-surface">Total</span>
                <span className="font-headline-md text-headline-md text-primary font-bold">{typeof ticketModal.total === 'number' ? formatIDR(ticketModal.total) : ticketModal.price}</span>
              </div>
            </div>

            {/* Close Button */}
            <div className="p-stack-md border-t border-outline-variant/30">
              <button 
                onClick={() => setTicketModal(null)}
                className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-label-md text-label-md hover:scale-[1.02] transition-transform"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
