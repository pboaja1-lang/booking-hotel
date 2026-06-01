import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BookingDetail() {
  const { bookingId } = useParams();
  const { history } = useAuth();

  const booking = (history || []).find((b) => b.id === `#${bookingId}`);

  const formatIDR = (amount) => {
    if (typeof amount === 'number') {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount).replace('Rp', 'Rp ');
    }
    return amount;
  };

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-stack-md text-center">
        <span className="material-symbols-outlined text-[64px] text-secondary/40">search_off</span>
        <h2 className="font-headline-md text-headline-md text-on-surface">Pesanan Tidak Ditemukan</h2>
        <p className="font-body-md text-body-md text-secondary max-w-md">
          Pesanan dengan kode <span className="font-label-md text-primary">#{bookingId}</span> tidak ditemukan di riwayat Anda.
        </p>
        <Link to="/user/dashboard" className="mt-stack-md bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md hover:scale-[1.02] transition-transform">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-stack-xl max-w-4xl">
      {/* Back Button */}
      <Link to="/user/dashboard" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-label-md text-label-md w-fit">
        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        Kembali ke Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-stack-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-stack-xs">Detail Pemesanan</h1>
          <p className="font-body-md text-body-md text-secondary">Kode Booking: <span className="font-label-md text-primary">{booking.id}</span></p>
        </div>
        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-tertiary-container/20 text-tertiary border border-tertiary-container/30 w-fit">
          <span className="material-symbols-outlined text-[16px] mr-1">check_circle</span>
          {booking.status === 'Aktif' ? 'Confirmed' : booking.status === 'Selesai' ? 'Completed' : 'Cancelled'}
        </span>
      </div>

      {/* Hotel Card */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.02)] overflow-hidden">
        <div className="h-56 md:h-72 w-full relative">
          <img src={booking.image} alt={booking.hotel} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-stack-lg text-white">
            <h2 className="font-headline-md text-headline-md drop-shadow-md">{booking.hotel}</h2>
            <div className="flex items-center gap-2 mt-1 opacity-90">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              <span className="font-body-sm text-body-sm">{booking.location || 'Jakarta'}</span>
            </div>
          </div>
        </div>

        <div className="p-stack-lg">
          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-lg mb-stack-lg">
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">bed</span> Tipe Kamar
              </span>
              <span className="font-body-md text-body-md text-on-surface">{booking.roomType}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">group</span> Tamu
              </span>
              <span className="font-body-md text-body-md text-on-surface">{booking.guests || '2 Dewasa'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span> Tanggal
              </span>
              <span className="font-body-md text-body-md text-on-surface">{booking.dates}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">dark_mode</span> Durasi
              </span>
              <span className="font-body-md text-body-md text-on-surface">{booking.nights || 2} Malam</span>
            </div>
          </div>

          <hr className="border-outline-variant/30 mb-stack-lg" />

          {/* Payment Details */}
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack-md flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">receipt_long</span>
            Rincian Pembayaran
          </h3>
          <div className="bg-surface-container rounded-lg p-stack-md space-y-stack-sm mb-stack-lg">
            {typeof booking.subtotal === 'number' && (
              <>
                <div className="flex justify-between font-body-sm text-body-sm text-secondary">
                  <span>Subtotal ({booking.nights || 2} Malam)</span>
                  <span>{formatIDR(booking.subtotal)}</span>
                </div>
                <div className="flex justify-between font-body-sm text-body-sm text-secondary">
                  <span>Pajak &amp; Biaya (10%)</span>
                  <span>{formatIDR(booking.tax)}</span>
                </div>
                <hr className="border-outline-variant/30" />
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="font-label-md text-label-md text-on-surface">Total Pembayaran</span>
              <span className="font-headline-md text-headline-md text-primary font-bold">{typeof booking.total === 'number' ? formatIDR(booking.total) : booking.price}</span>
            </div>
            <div className="flex justify-between font-body-sm text-body-sm text-secondary">
              <span>Metode Pembayaran</span>
              <span className="font-label-sm text-on-surface">{booking.paymentMethod || 'Transfer Bank'}</span>
            </div>
          </div>

          {/* Hotel Rules */}
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack-md flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">info</span>
            Informasi Penting
          </h3>
          <div className="bg-surface-container rounded-lg p-stack-md">
            <ul className="space-y-stack-sm font-body-sm text-body-sm text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-tertiary mt-0.5">check_circle</span>
                <span>Check-in mulai pukul <strong>14:00 WIB</strong>, check-out paling lambat <strong>12:00 WIB</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-tertiary mt-0.5">check_circle</span>
                <span>Harap tunjukkan E-Ticket ini di resepsionis saat check-in.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-tertiary mt-0.5">check_circle</span>
                <span>Pembatalan gratis hingga 24 jam sebelum check-in.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-tertiary mt-0.5">check_circle</span>
                <span>Sarapan sudah termasuk untuk semua tamu.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
