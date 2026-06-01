import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminPengaturan() {
  const { user, changePassword, logout } = useAuth();
  const navigate = useNavigate();

  // Tab State: 'security', 'profile', 'notifications'
  const [activeTab, setActiveTab] = useState('security');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Mock Notification State
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Kata sandi baru dan konfirmasi tidak cocok!");
      return;
    }
    
    try {
      changePassword(user.email, oldPassword, newPassword);
      alert("Kata sandi berhasil diubah! Silakan login kembali.");
      logout();
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    alert("Profil admin berhasil diperbarui! (Simulasi)");
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-margin-desktop py-stack-lg bg-background">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-stack-lg">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Pengaturan Sistem</h1>
          <p className="font-body-md text-body-md text-secondary mt-1">Kelola preferensi akun dan keamanan admin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Sidebar Settings Menu */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md text-left transition-colors relative ${activeTab === 'security' ? 'bg-primary-container/10 text-primary' : 'text-secondary hover:bg-surface-container hover:text-on-surface'}`}
          >
            {activeTab === 'security' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></div>}
            <span className={`material-symbols-outlined ${activeTab === 'security' ? 'fill' : ''}`} style={{fontVariationSettings: activeTab === 'security' ? "'FILL' 1" : "'FILL' 0"}}>security</span>
            Keamanan Akun
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md text-left transition-colors relative ${activeTab === 'profile' ? 'bg-primary-container/10 text-primary' : 'text-secondary hover:bg-surface-container hover:text-on-surface'}`}
          >
            {activeTab === 'profile' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></div>}
            <span className={`material-symbols-outlined ${activeTab === 'profile' ? 'fill' : ''}`} style={{fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0"}}>manage_accounts</span>
            Profil Admin
          </button>
          
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md text-left transition-colors relative ${activeTab === 'notifications' ? 'bg-primary-container/10 text-primary' : 'text-secondary hover:bg-surface-container hover:text-on-surface'}`}
          >
            {activeTab === 'notifications' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></div>}
            <span className={`material-symbols-outlined ${activeTab === 'notifications' ? 'fill' : ''}`} style={{fontVariationSettings: activeTab === 'notifications' ? "'FILL' 1" : "'FILL' 0"}}>notifications</span>
            Notifikasi
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          
          {/* TAB: SECURITY */}
          {activeTab === 'security' && (
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.02),0_8px_16px_rgba(26,26,46,0.02)] border border-surface-variant/50 p-stack-lg">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-stack-xs">Ubah Kata Sandi</h2>
              <p className="font-body-sm text-body-sm text-secondary mb-stack-lg pb-stack-md border-b border-surface-variant/50">
                Pastikan akun Anda menggunakan kata sandi yang panjang dan acak untuk tetap aman.
              </p>

              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-stack-md max-w-md">
                {/* Old Password */}
                <div className="flex flex-col gap-stack-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="oldPassword">
                    Kata Sandi Saat Ini
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">lock</span>
                    <input
                      className="w-full bg-surface-container-low/50 pl-10 pr-10 py-3 rounded-lg border border-surface-variant focus:bg-surface-container-lowest focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors font-body-sm text-body-sm text-on-surface"
                      id="oldPassword"
                      type={showOldPassword ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors focus:outline-none"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showOldPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-stack-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="newPassword">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">lock_reset</span>
                    <input
                      className="w-full bg-surface-container-low/50 pl-10 pr-10 py-3 rounded-lg border border-surface-variant focus:bg-surface-container-lowest focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors font-body-sm text-body-sm text-on-surface"
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors focus:outline-none"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showNewPassword ? 'visibility' : 'visibility_off'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col gap-stack-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="confirmPassword">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">lock_reset</span>
                    <input
                      className="w-full bg-surface-container-low/50 pl-10 pr-4 py-3 rounded-lg border border-surface-variant focus:bg-surface-container-lowest focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors font-body-sm text-body-sm text-on-surface"
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mt-stack-sm flex justify-end">
                  <button
                    className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-sm transition-all duration-200 active:scale-95"
                    type="submit"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.02),0_8px_16px_rgba(26,26,46,0.02)] border border-surface-variant/50 p-stack-lg animate-[fadeIn_0.3s_ease-out]">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-stack-xs">Profil Administrator</h2>
              <p className="font-body-sm text-body-sm text-secondary mb-stack-lg pb-stack-md border-b border-surface-variant/50">
                Kelola informasi identitas publik yang digunakan dalam sistem Admin.
              </p>
              
              <div className="flex items-center gap-4 mb-stack-lg">
                <div className="w-20 h-20 rounded-full bg-primary-container text-primary font-headline-lg flex items-center justify-center">
                  A
                </div>
                <div>
                  <button className="px-4 py-2 border border-outline rounded-lg text-on-surface hover:bg-surface-variant font-label-sm text-label-sm transition-colors">
                    Ganti Foto
                  </button>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="flex flex-col gap-stack-md max-w-md">
                <div className="flex flex-col gap-stack-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="adminName">Nama Lengkap</label>
                  <input
                    className="w-full bg-surface-container-low/50 px-4 py-3 rounded-lg border border-surface-variant focus:bg-surface-container-lowest focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors font-body-sm text-body-sm text-on-surface"
                    id="adminName"
                    type="text"
                    defaultValue="Administrator Sistem"
                  />
                </div>
                <div className="flex flex-col gap-stack-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="adminEmail">Alamat Email</label>
                  <input
                    className="w-full bg-surface-container-low/50 px-4 py-3 rounded-lg border border-surface-variant focus:bg-surface-container-lowest focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-colors font-body-sm text-body-sm text-on-surface"
                    id="adminEmail"
                    type="email"
                    defaultValue={user?.email || "admin@gmail.com"}
                    disabled
                  />
                  <span className="text-xs text-secondary mt-1">*Email login tidak dapat diubah dari halaman ini.</span>
                </div>
                <div className="mt-stack-sm flex justify-end">
                  <button
                    className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-sm transition-all duration-200 active:scale-95"
                    type="submit"
                  >
                    Perbarui Profil
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.02),0_8px_16px_rgba(26,26,46,0.02)] border border-surface-variant/50 p-stack-lg animate-[fadeIn_0.3s_ease-out]">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-stack-xs">Preferensi Notifikasi</h2>
              <p className="font-body-sm text-body-sm text-secondary mb-stack-lg pb-stack-md border-b border-surface-variant/50">
                Atur bagaimana Anda menerima pembaruan tentang aktivitas pemesanan baru atau sistem.
              </p>
              
              <div className="flex flex-col gap-stack-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface">Notifikasi Email</h3>
                    <p className="font-body-sm text-body-sm text-secondary">Terima ringkasan via email setiap kali ada pemesanan baru.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
                    <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface">Notifikasi Push Browser</h3>
                    <p className="font-body-sm text-body-sm text-secondary">Terima peringatan pop-up saat dashboard admin terbuka.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={pushNotif} onChange={() => setPushNotif(!pushNotif)} />
                    <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
