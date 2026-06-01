import { useAdmin } from '../../context/AdminContext';

export default function AdminDashboard() {
  const { rooms, bookings } = useAdmin();

  const totalRooms = rooms.length;
  const totalBookings = bookings.length;
  const revenue = '15.2 JT'; // Mock data for now
  const activeUsers = 24; // Mock data

  // Get recent 5 bookings
  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="p-margin-mobile md:p-margin-desktop bg-surface/50 min-h-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md mb-stack-lg">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Dashboard Overview</h2>
          <p className="font-body-sm text-body-sm text-secondary mt-1">Ringkasan aktivitas dan performa properti hari ini.</p>
        </div>
        <div className="flex items-center gap-stack-sm">
          <input 
            type="date" 
            defaultValue={new Date().toISOString().split('T')[0]}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
          />
        </div>
      </div>

      {/* Stats Overview (Bento-style Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-xl">
        {/* Stat Card 1 */}
        <div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-sm border border-outline-variant/30 hover:scale-[1.02] transition-transform duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-container/10 rounded-bl-full -z-0"></div>
          <div className="flex justify-between items-start mb-stack-sm relative z-10">
            <div className="p-2 bg-tertiary-container/20 text-tertiary rounded-lg">
              <span className="material-symbols-outlined">meeting_room</span>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +2%
            </span>
          </div>
          <div className="relative z-10">
            <p className="font-body-sm text-body-sm text-secondary mb-1">Total Kamar</p>
            <h3 className="font-headline-md text-headline-md text-on-surface">{totalRooms}</h3>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-sm border border-outline-variant/30 hover:scale-[1.02] transition-transform duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/10 rounded-bl-full -z-0"></div>
          <div className="flex justify-between items-start mb-stack-sm relative z-10">
            <div className="p-2 bg-primary-container/20 text-primary rounded-lg">
              <span className="material-symbols-outlined">book_online</span>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +15%
            </span>
          </div>
          <div className="relative z-10">
            <p className="font-body-sm text-body-sm text-secondary mb-1">Total Booking</p>
            <h3 className="font-headline-md text-headline-md text-on-surface">{totalBookings}</h3>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-sm border border-outline-variant/30 hover:scale-[1.02] transition-transform duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-fixed/20 rounded-bl-full -z-0"></div>
          <div className="flex justify-between items-start mb-stack-sm relative z-10">
            <div className="p-2 bg-tertiary-fixed/30 text-on-tertiary-fixed-variant rounded-lg">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +8%
            </span>
          </div>
          <div className="relative z-10">
            <p className="font-body-sm text-body-sm text-secondary mb-1">Revenue</p>
            <h3 className="font-headline-md text-headline-md text-on-surface">{revenue}</h3>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-surface-container-lowest p-stack-md rounded-xl shadow-sm border border-outline-variant/30 hover:scale-[1.02] transition-transform duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-container/30 rounded-bl-full -z-0"></div>
          <div className="flex justify-between items-start mb-stack-sm relative z-10">
            <div className="p-2 bg-secondary-container/50 text-on-secondary-container rounded-lg">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="font-label-sm text-label-sm text-error flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_down</span>
              -3%
            </span>
          </div>
          <div className="relative z-10">
            <p className="font-body-sm text-body-sm text-secondary mb-1">Active Users</p>
            <h3 className="font-headline-md text-headline-md text-on-surface">{activeUsers}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-xl">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-stack-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col">
          <div className="flex justify-between items-center mb-stack-lg">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Weekly Booking Trends</h3>
              <p className="font-body-sm text-body-sm text-secondary">Aktivitas pemesanan dalam 7 hari terakhir.</p>
            </div>
            <button className="p-2 rounded-full hover:bg-surface-container text-secondary transition-colors">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
          
          {/* CSS Bar Chart */}
          <div className="flex-1 flex items-end gap-2 sm:gap-4 h-64 mt-auto border-b border-outline-variant/50 pb-2 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-secondary font-label-sm text-label-sm pb-8 opacity-50 hidden sm:flex">
              <span>20</span>
              <span>15</span>
              <span>10</span>
              <span>5</span>
            </div>
            
            {/* Chart Bars */}
            <div className="flex-1 flex flex-col items-center gap-2 group sm:ml-8">
              <div className="w-full bg-primary-container/20 rounded-t-sm relative h-[40%] group-hover:bg-primary-container/40 transition-colors">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">8</div>
              </div>
              <span className="font-label-sm text-label-sm text-secondary">Sen</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-primary-container/20 rounded-t-sm relative h-[60%] group-hover:bg-primary-container/40 transition-colors">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">12</div>
              </div>
              <span className="font-label-sm text-label-sm text-secondary">Sel</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-primary rounded-t-sm relative h-[85%] shadow-[0_0_15px_rgba(148,74,0,0.2)]">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-100 pointer-events-none">17</div>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-bold">Rab</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-primary-container/20 rounded-t-sm relative h-[50%] group-hover:bg-primary-container/40 transition-colors">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">10</div>
              </div>
              <span className="font-label-sm text-label-sm text-secondary">Kam</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-primary-container/20 rounded-t-sm relative h-[75%] group-hover:bg-primary-container/40 transition-colors">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">15</div>
              </div>
              <span className="font-label-sm text-label-sm text-secondary">Jum</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-primary-container/20 rounded-t-sm relative h-[90%] group-hover:bg-primary-container/40 transition-colors">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">18</div>
              </div>
              <span className="font-label-sm text-label-sm text-secondary">Sab</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-primary-container/20 rounded-t-sm relative h-[65%] group-hover:bg-primary-container/40 transition-colors">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">13</div>
              </div>
              <span className="font-label-sm text-label-sm text-secondary">Min</span>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col overflow-hidden">
          <div className="p-stack-md border-b border-outline-variant/30 flex justify-between items-center bg-surface/50">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Bookings</h3>
            <a className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-1" href="/admin/booking">
              Lihat Semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant/50">
                  <th className="py-3 px-stack-md font-label-sm text-label-sm text-secondary font-medium">Code</th>
                  <th className="py-3 px-stack-md font-label-sm text-label-sm text-secondary font-medium">Tamu</th>
                  <th className="py-3 px-stack-md font-label-sm text-label-sm text-secondary font-medium hidden sm:table-cell">Kamar</th>
                  <th className="py-3 px-stack-md font-label-sm text-label-sm text-secondary font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="py-3 px-stack-md font-label-md text-label-md text-on-surface">{booking.id}</td>
                    <td className="py-3 px-stack-md">
                      <div className="font-label-md text-label-md text-on-surface">{booking.guestName}</div>
                      <div className="font-body-sm text-body-sm text-secondary hidden sm:block">{booking.guestEmail}</div>
                    </td>
                    <td className="py-3 px-stack-md font-body-sm text-body-sm text-secondary hidden sm:table-cell">{booking.room?.name || "Kamar"}</td>
                    <td className="py-3 px-stack-md text-right">
                      {booking.status === 'Confirmed' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-tertiary-container/20 text-tertiary">
                          Confirmed
                        </span>
                      )}
                      {booking.status === 'Pending' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-container/20 text-primary">
                          Pending
                        </span>
                      )}
                      {booking.status === 'Done' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-variant text-on-surface-variant">
                          Done
                        </span>
                      )}
                      {booking.status === 'Cancelled' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
                          Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
