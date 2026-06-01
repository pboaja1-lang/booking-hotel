import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

export default function AdminTamu() {
  const { getAllUsers } = useAuth();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const users = await getAllUsers();
        // Exclude admin from the guest list for display
        setGuests(users.filter(u => u.role !== 'admin'));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuests();
  }, [getAllUsers]);

  if (loading) {
    return <div className="p-8 text-center text-secondary">Memuat data tamu...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-margin-desktop py-stack-lg bg-background">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-stack-lg">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Manajemen Tamu</h1>
          <p className="font-body-md text-body-md text-secondary mt-1">Daftar pengguna yang telah mendaftar di sistem.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_2px_4px_rgba(26,26,46,0.02),0_8px_16px_rgba(26,26,46,0.02)] border border-surface-variant/50 mb-stack-lg">
         <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary">search</span>
            <input 
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-surface-variant bg-surface-container-low/50 focus:bg-surface-container-lowest focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-body-md text-body-md text-on-surface placeholder:text-secondary" 
              placeholder="Cari nama atau email tamu..." 
              type="text"
            />
          </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.02),0_12px_24px_rgba(26,26,46,0.04)] border border-surface-variant/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-variant bg-surface-container-lowest">
                <th className="p-4 pl-6 font-label-md text-label-md text-secondary uppercase tracking-wider">Profil</th>
                <th className="p-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Nama Lengkap</th>
                <th className="p-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Email</th>
                <th className="p-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Tanggal Daftar</th>
                <th className="p-4 pr-6 font-label-md text-label-md text-secondary uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-on-surface divide-y divide-surface-container-low">
              {guests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-secondary">
                    Belum ada tamu yang mendaftar.
                  </td>
                </tr>
              ) : (
                guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 pl-6">
                      <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-label-md text-label-md shrink-0 overflow-hidden">
                        {guest.avatar ? (
                           <img src={guest.avatar} alt={guest.name} className="w-full h-full object-cover" />
                        ) : (
                           guest.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium">{guest.name}</td>
                    <td className="p-4 text-secondary">{guest.email}</td>
                    <td className="p-4 text-secondary">{new Date(guest.createdAt).toLocaleDateString('id-ID')}</td>
                    <td className="p-4 pr-6 text-right whitespace-nowrap">
                      <button className="p-2 text-secondary hover:text-primary transition-colors rounded-lg hover:bg-surface-container-low" title="Lihat Profil">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-surface-variant/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest">
          <div className="font-body-sm text-body-sm text-secondary">
            Menampilkan <span className="font-medium text-on-surface">{guests.length > 0 ? 1 : 0}</span> - <span className="font-medium text-on-surface">{guests.length}</span> dari <span className="font-medium text-on-surface">{guests.length}</span> tamu
          </div>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded text-secondary hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm">
                1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-secondary hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
