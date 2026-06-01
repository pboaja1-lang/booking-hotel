import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminBooking() {
  const { bookings, updateBookingStatus, deleteBooking } = useAdmin();
  const [activeTab, setActiveTab] = useState('All');

  // Summary counts
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const doneCount = bookings.filter(b => b.status === 'Done').length;

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'All') return true;
    return b.status === activeTab;
  });

  const tabs = ['All', 'Pending', 'Confirmed', 'Done', 'Cancelled'];

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-margin-desktop py-stack-lg bg-background">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-stack-lg">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Manajemen Booking</h1>
          <p className="font-body-md text-body-md text-secondary mt-1">Kelola semua reservasi kamar Anda di satu tempat.</p>
        </div>
        
        {/* Status Counters */}
        <div className="flex gap-4">
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-sm text-center min-w-[100px]">
            <div className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">Pending</div>
            <div className="font-headline-md text-headline-md text-primary">{pendingCount}</div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-sm text-center min-w-[100px]">
            <div className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">Confirmed</div>
            <div className="font-headline-md text-headline-md text-tertiary">{confirmedCount}</div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-sm text-center min-w-[100px]">
            <div className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-1">Done</div>
            <div className="font-headline-md text-headline-md text-on-surface">{doneCount}</div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.02)] border border-surface-variant/50 overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="px-6 border-b border-surface-variant/50 flex overflow-x-auto hide-scrollbar gap-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 font-label-md text-label-md relative whitespace-nowrap transition-colors
                ${activeTab === tab ? 'text-primary' : 'text-secondary hover:text-on-surface'}
              `}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-variant/50 bg-surface-container-lowest">
                <th className="py-4 pl-6 pr-4 font-label-sm text-label-sm text-secondary uppercase tracking-wider">Code</th>
                <th className="py-4 px-4 font-label-sm text-label-sm text-secondary uppercase tracking-wider">Tamu</th>
                <th className="py-4 px-4 font-label-sm text-label-sm text-secondary uppercase tracking-wider">Kamar</th>
                <th className="py-4 px-4 font-label-sm text-label-sm text-secondary uppercase tracking-wider">Tanggal</th>
                <th className="py-4 px-4 font-label-sm text-label-sm text-secondary uppercase tracking-wider text-center">Status</th>
                <th className="py-4 pr-6 pl-4 font-label-sm text-label-sm text-secondary uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/50 font-body-sm text-body-sm text-on-surface">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-secondary">
                    Tidak ada booking {activeTab !== 'All' ? `dengan status ${activeTab}` : ''} yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-4 pl-6 pr-4 font-label-md text-label-md">{booking.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-label-sm text-label-sm shrink-0">
                          {booking.guestName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-label-sm text-label-sm">{booking.guestName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-secondary">{booking.room?.name || "Kamar"}</td>
                    <td className="py-4 px-4 text-secondary">{new Date(booking.checkIn).toLocaleDateString('id-ID')}</td>
                    <td className="py-4 px-4 text-center">
                      <select 
                        className={`appearance-none font-label-sm text-label-sm rounded-lg px-3 py-1.5 border-none cursor-pointer text-center outline-none ring-1 ring-inset
                          ${booking.status === 'Pending' ? 'bg-primary-container/10 text-primary ring-primary-container/30' : ''}
                          ${booking.status === 'Confirmed' ? 'bg-tertiary-container/10 text-tertiary ring-tertiary-container/30' : ''}
                          ${booking.status === 'Done' ? 'bg-surface-variant text-on-surface ring-surface-variant' : ''}
                          ${booking.status === 'Cancelled' ? 'bg-error/5 text-error ring-error/20' : ''}
                        `}
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Done">Done</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 pr-6 pl-4 text-right">
                      <button 
                        className="font-label-sm text-label-sm text-primary hover:underline"
                        onClick={() => alert(`Membuka detail booking ${booking.id}`)}
                      >
                        Detil
                      </button>
                      <button 
                        className="font-label-sm text-label-sm text-error hover:underline ml-4"
                        onClick={() => {
                          if (window.confirm(`Yakin ingin menghapus booking ${booking.id}?`)) {
                            deleteBooking(booking.id);
                          }
                        }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Static for demo) */}
        <div className="px-6 py-4 border-t border-surface-variant/50 flex items-center justify-between">
          <div className="font-body-sm text-body-sm text-secondary">
            Menampilkan 1-{filteredBookings.length} dari {filteredBookings.length} booking
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-surface-variant font-label-sm text-label-sm text-secondary hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
              Prev
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-surface-variant font-label-sm text-label-sm text-secondary hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
