import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { user, login } = useAuth();

  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin' || user.email === 'admin@stayease.com' || user.email === 'admin@gmail.com') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Let the useEffect handle the navigation
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = () => {
    alert('Fitur login Google belum tersedia di versi ini. Silakan mendaftar menggunakan email.');
  };

  const handleFacebookLogin = () => {
    alert('Fitur login Facebook belum tersedia di versi ini. Silakan mendaftar menggunakan email.');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop font-body-md text-on-surface"
      style={{
        backgroundColor: '#f8f9fc',
        backgroundImage: 'radial-gradient(#dcc1b1 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <main className="w-full max-w-[440px]">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.05)] p-stack-xl flex flex-col gap-stack-lg relative overflow-hidden">
          {/* Brand & Header */}
          <div className="text-center flex flex-col gap-stack-sm">
            <h1 className="font-headline-lg md:font-headline-xl text-headline-lg md:text-headline-xl text-primary tracking-tight">
              Venellopy.io
            </h1>
            <p className="font-body-md text-body-md text-secondary">
              Selamat datang kembali! Silakan masuk ke akun Anda.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-stack-md" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="flex flex-col gap-stack-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="login-email">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">
                  mail
                </span>
                <input
                  className="w-full bg-surface pl-10 pr-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-sm text-body-sm text-on-surface placeholder:text-secondary-fixed-dim"
                  id="login-email"
                  placeholder="Masukkan email Anda"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-stack-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="login-password">
                Kata Sandi
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">
                  lock
                </span>
                <input
                  className="w-full bg-surface pl-10 pr-10 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-sm text-body-sm text-on-surface placeholder:text-secondary-fixed-dim"
                  id="login-password"
                  placeholder="Masukkan kata sandi"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <button type="button" className="font-label-sm text-label-sm text-primary hover:underline">
                  Lupa kata sandi?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-primary-container text-on-primary py-3 rounded-lg font-label-md text-label-md hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 mt-stack-sm shadow-sm flex justify-center items-center gap-2"
              type="submit"
            >
              MASUK
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-outline-variant flex-1"></div>
            <span className="font-label-sm text-label-sm text-secondary">Atau masuk dengan</span>
            <div className="h-px bg-outline-variant flex-1"></div>
          </div>

          {/* Social Login */}
          <div className="flex gap-stack-md">
            <button
              onClick={handleGoogleLogin}
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
              onClick={handleFacebookLogin}
              className="flex-1 bg-surface border border-outline-variant py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-surface-container transition-colors duration-200 font-label-md text-label-md text-on-surface"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-stack-sm">
            <p className="font-body-sm text-body-sm text-secondary">
              Belum punya akun?{' '}
              <Link className="font-label-md text-label-md text-primary hover:underline" to="/register">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
