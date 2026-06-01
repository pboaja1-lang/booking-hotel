import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+62 812 3456 7890');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setAvatar(dataUrl);
        updateProfile({ avatar: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('Harap isi semua kolom password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Password baru dan konfirmasi tidak cocok!');
      return;
    }
    setPasswordSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="flex-grow space-y-stack-xl">
      {/* Profile Header Bento */}
      <section className="bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.02),0_12px_20px_rgba(26,26,46,0.04)] p-stack-lg flex items-center space-x-stack-lg border border-outline-variant/20 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-primary/5 to-transparent opacity-50"></div>
        <div className="relative">
          <img
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-surface-container-lowest shadow-sm"
            src={avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgoVUB4W9H1VKyxLVRm9O-yq-dvMo41DCpDsQo-_N38Q3g6Oiqq1fdl6Is984iC9D-y_Lodpvket_I3BYHaUe9PE7E2SGXTA2eZif4VHncBAcWXVIwcVsmAL94oSZGEfiA6b6EHSOAZkDlaB31JyFS6GthGKc_C4x4VQPqCu6KLcU3Y_YzQUWT6V1aixRlU_tCBtl3JNtMKxnF9fv_Xj9lljyWxrIqaeUvWS3643156qugr4azWHTv-LLcxFpr2wpc7VHEQI6exJ2i'}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <button
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full p-1 shadow-sm hover:scale-110 transition-transform"
            title="Ganti foto profil"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
        </div>
        <div className="z-10">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-xs">{name}</h1>
          <p className="font-body-md text-body-md text-secondary mb-stack-xs">{email}</p>
          <div className="inline-flex items-center space-x-2 bg-tertiary-container/10 text-tertiary-container px-3 py-1 rounded-full border border-tertiary-container/20">
            <span className="material-symbols-outlined text-[14px]">stars</span>
            <span className="font-label-sm text-label-sm">Member sejak Mei 2026</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
        {/* Personal Info Form */}
        <section className="bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.02),0_12px_20px_rgba(26,26,46,0.04)] p-stack-lg border border-outline-variant/20 flex flex-col">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-stack-lg border-b border-outline-variant/30 pb-stack-sm flex items-center space-x-2">
            <span className="material-symbols-outlined text-primary">badge</span>
            <span>Informasi Pribadi</span>
          </h2>
          <form className="space-y-stack-md flex-grow flex flex-col" onSubmit={handleSaveProfile}>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1" htmlFor="nama">Nama Lengkap</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">person_outline</span>
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-outline-variant/50 focus:border-primary focus:ring focus:ring-primary/20 bg-background text-on-surface font-body-md transition-shadow"
                  id="nama"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1" htmlFor="email">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">mail</span>
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-outline-variant/50 focus:border-primary focus:ring focus:ring-primary/20 bg-background text-on-surface font-body-md transition-shadow"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-stack-lg">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1" htmlFor="telepon">Nomor Telepon</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">phone</span>
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-outline-variant/50 focus:border-primary focus:ring focus:ring-primary/20 bg-background text-on-surface font-body-md transition-shadow"
                  id="telepon"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-auto pt-stack-md flex justify-end items-center gap-stack-md">
              {saveSuccess && (
                <span className="text-tertiary font-label-md text-label-md flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Tersimpan!
                </span>
              )}
              <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:scale-[1.02] hover:shadow-md transition-all active:scale-95 flex items-center space-x-2" type="submit">
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>SIMPAN PERUBAHAN</span>
              </button>
            </div>
          </form>
        </section>

        {/* Security / Password Form */}
        <section className="bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.02),0_12px_20px_rgba(26,26,46,0.04)] p-stack-lg border border-outline-variant/20 flex flex-col">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-stack-lg border-b border-outline-variant/30 pb-stack-sm flex items-center space-x-2">
            <span className="material-symbols-outlined text-primary">lock</span>
            <span>Keamanan Akun</span>
          </h2>
          <form className="space-y-stack-md flex-grow flex flex-col" onSubmit={handleChangePassword}>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1" htmlFor="password_lama">Password Lama</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">key</span>
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-outline-variant/50 focus:border-primary focus:ring focus:ring-primary/20 bg-background text-on-surface font-body-md transition-shadow"
                  id="password_lama"
                  placeholder="••••••••"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1" htmlFor="password_baru">Password Baru</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">password</span>
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-outline-variant/50 focus:border-primary focus:ring focus:ring-primary/20 bg-background text-on-surface font-body-md transition-shadow"
                  id="password_baru"
                  placeholder="Masukkan password baru"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-stack-lg">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1" htmlFor="konfirmasi_password">Konfirmasi Password Baru</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">check_circle</span>
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-outline-variant/50 focus:border-primary focus:ring focus:ring-primary/20 bg-background text-on-surface font-body-md transition-shadow"
                  id="konfirmasi_password"
                  placeholder="Ulangi password baru"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-auto pt-stack-md flex justify-end items-center gap-stack-md">
              {passwordSuccess && (
                <span className="text-tertiary font-label-md text-label-md flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Password diubah!
                </span>
              )}
              <button className="border-2 border-primary text-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary/5 hover:scale-[1.02] transition-all active:scale-95 flex items-center space-x-2" type="submit">
                <span className="material-symbols-outlined text-[18px]">update</span>
                <span>UBAH PASSWORD</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
