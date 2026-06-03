import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authClient } from '../lib/auth-client';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }
    try {
      await register(email, password, fullName);
      alert(`Pendaftaran berhasil! Selamat bergabung, ${fullName}.`);
      navigate('/user/dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/user/dashboard',
      });
    } catch (error) {
      alert('Gagal daftar dengan Google: ' + (error.message || 'Terjadi kesalahan'));
    }
  };

  const handleFacebookRegister = async () => {
    try {
      await authClient.signIn.social({
        provider: 'facebook',
        callbackURL: '/user/dashboard',
      });
    } catch (error) {
      alert('Gagal daftar dengan Facebook: ' + (error.message || 'Terjadi kesalahan'));
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center relative p-margin-mobile md:p-margin-desktop font-body-md">
      {/* Decorative Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCtCS2AmmMXoHrrrAoMEPCRjfDcQ12DdC3L3VfIAI8E5w0GpChCKiIDlUK0AZJ1p3H0D3uPUJKpRBpTvChLUZDg7Ka3nKwMp_7-dUWqT8iptJApNcrvYywL_DYKUDY5Q77CU9UD0P02yZdQqpd_8Vn8mwZOqORxW1FfcpfCG5_M8a0kpty532T7fei76hGSfIBsVytDXlMy2DLusztOEyb2Xiiu6__fqTVYxU6VviKbwx0IzOAxEq4iCqB6UsEmR4JjvSKljwz0Hye9')" }}
      >
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-surface/50 to-surface"></div>

      {/* Registration Card */}
      <div className="relative z-10 w-full max-w-[440px] bg-surface-container-lowest rounded-xl shadow-[0_2px_8px_rgba(26,26,46,0.04),0_20px_40px_rgba(26,26,46,0.08)] p-stack-xl flex flex-col transform transition-transform duration-500 hover:scale-[1.005]">
        {/* Header */}
        <div className="text-center mb-stack-xl">
          <h1 className="font-headline-lg text-headline-lg text-primary-container tracking-tight mb-stack-xs">
            Venellopy.io
          </h1>
          <p className="font-body-sm text-body-sm text-secondary">
            Mulai perjalanan Anda bersama kami
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-stack-md" onSubmit={handleSubmit}>
          {/* Nama Lengkap */}
          <div className="flex flex-col gap-stack-xs">
            <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="fullName">
              Nama Lengkap
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-secondary">
                <span className="material-symbols-outlined">person</span>
              </span>
              <input
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-outline-variant/50 bg-surface-container-lowest shadow-[0_2px_6px_rgba(26,26,46,0.02)] focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all font-body-md text-body-md text-on-surface placeholder:text-secondary-fixed-dim"
                id="fullName"
                name="fullName"
                placeholder="Masukkan nama lengkap"
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-stack-xs">
            <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="register-email">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-secondary">
                <span className="material-symbols-outlined">mail</span>
              </span>
              <input
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-outline-variant/50 bg-surface-container-lowest shadow-[0_2px_6px_rgba(26,26,46,0.02)] focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all font-body-md text-body-md text-on-surface placeholder:text-secondary-fixed-dim"
                id="register-email"
                name="email"
                placeholder="contoh@email.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-stack-xs">
            <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="register-password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-secondary">
                <span className="material-symbols-outlined">lock</span>
              </span>
              <input
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-outline-variant/50 bg-surface-container-lowest shadow-[0_2px_6px_rgba(26,26,46,0.02)] focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all font-body-md text-body-md text-on-surface placeholder:text-secondary-fixed-dim"
                id="register-password"
                name="password"
                placeholder="Minimal 8 karakter"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div className="flex flex-col gap-stack-xs">
            <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="confirmPassword">
              Konfirmasi Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-secondary">
                <span className="material-symbols-outlined">lock_reset</span>
              </span>
              <input
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-outline-variant/50 bg-surface-container-lowest shadow-[0_2px_6px_rgba(26,26,46,0.02)] focus:outline-none focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container transition-all font-body-md text-body-md text-on-surface placeholder:text-secondary-fixed-dim"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Ulangi password Anda"
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="w-full mt-stack-sm bg-primary-container text-on-primary py-3 px-6 rounded-lg font-label-md text-label-md shadow-[0_4px_12px_rgba(230,126,34,0.25)] hover:scale-[1.02] hover:shadow-[0_6px_16px_rgba(230,126,34,0.35)] active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2"
            type="submit"
          >
            DAFTAR
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2 mt-stack-sm">
          <div className="h-px bg-outline-variant flex-1"></div>
          <span className="font-label-sm text-label-sm text-secondary">Atau daftar dengan</span>
          <div className="h-px bg-outline-variant flex-1"></div>
        </div>

        {/* Social Register */}
        <div className="flex gap-stack-md">
          <button
            onClick={handleGoogleRegister}
            className="flex-1 bg-surface border border-outline-variant py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-surface-container transition-colors duration-200 font-label-md text-label-md text-on-surface"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
          <button
            onClick={handleFacebookRegister}
            className="flex-1 bg-surface border border-outline-variant py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-surface-container transition-colors duration-200 font-label-md text-label-md text-on-surface"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
            </svg>
            Facebook
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-stack-sm text-center font-body-sm text-body-sm text-secondary">
          <span>Sudah punya akun? </span>
          <Link
            className="font-label-md text-label-md text-primary-container hover:text-primary transition-colors hover:underline underline-offset-4"
            to="/login"
          >
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
