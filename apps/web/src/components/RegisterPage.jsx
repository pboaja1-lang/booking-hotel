import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

        {/* Footer Link */}
        <div className="mt-stack-lg text-center font-body-sm text-body-sm text-secondary">
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
