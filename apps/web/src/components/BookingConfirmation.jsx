import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BookingConfirmation() {
  const location = useLocation();
  const ticketRef = useRef(null);
  const [shareStatus, setShareStatus] = useState('');

  const { room, bookingDetails } = location.state || {
    room: {
      title: "Deluxe Room - City View",
      location: "Jakarta Pusat",
    },
    bookingDetails: {
      checkIn: "2026-05-27",
      checkOut: "2026-05-29",
      nights: 2,
      adults: 2,
      children: 0,
      subtotal: 1400000,
      tax: 100000,
      total: 1500000,
    }
  };

  const formatIDR = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount).replace('Rp', 'Rp ');
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  // Generate a random booking code
  const [bookingCode] = useState(() => 
    `#BK-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`
  );

  // Download booking as printable HTML receipt
  const handleDownload = () => {
    const receiptHTML = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Booking Receipt - ${bookingCode}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
    .receipt { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 24px; text-align: center; }
    .header h1 { font-size: 24px; margin-bottom: 4px; }
    .header p { opacity: 0.9; font-size: 14px; }
    .booking-code { background: rgba(255,255,255,0.15); display: inline-block; padding: 8px 20px; border-radius: 8px; margin-top: 12px; font-size: 20px; font-weight: bold; letter-spacing: 1px; }
    .body { padding: 24px; }
    .hotel-name { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 4px; }
    .room-type { color: #666; font-size: 14px; margin-bottom: 20px; }
    .details { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .detail-item label { display: block; font-size: 11px; text-transform: uppercase; color: #999; letter-spacing: 0.5px; margin-bottom: 4px; }
    .detail-item p { font-size: 15px; color: #333; font-weight: 500; }
    .detail-item .sub { font-size: 12px; color: #888; }
    .divider { border: none; border-top: 2px dashed #e0e0e0; margin: 20px 0; }
    .total-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; }
    .total-label { font-size: 12px; color: #999; text-transform: uppercase; }
    .total-amount { font-size: 22px; font-weight: 700; color: #333; }
    .paid-badge { display: inline-flex; align-items: center; gap: 4px; color: #27ae60; font-size: 13px; font-weight: 500; margin-top: 4px; }
    .footer { background: #fafafa; padding: 16px 24px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
    @media print { body { padding: 0; background: white; } .receipt { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>Venellopy.io</h1>
      <p>Konfirmasi Booking</p>
      <div class="booking-code">${bookingCode}</div>
    </div>
    <div class="body">
      <p class="hotel-name">Venellopy.io ${room.location || ''}</p>
      <p class="room-type">🛏️ ${room.title}</p>
      <div class="details">
        <div class="detail-item">
          <label>Check-in</label>
          <p>${formatDate(bookingDetails.checkIn)}</p>
          <span class="sub">Mulai 14:00</span>
        </div>
        <div class="detail-item">
          <label>Check-out</label>
          <p>${formatDate(bookingDetails.checkOut)}</p>
          <span class="sub">Sebelum 12:00</span>
        </div>
        <div class="detail-item">
          <label>Tamu</label>
          <p>${bookingDetails.adults} Dewasa, ${bookingDetails.children} Anak</p>
        </div>
        <div class="detail-item">
          <label>Status</label>
          <p class="paid-badge">✅ Sudah Dibayar</p>
        </div>
      </div>
      <hr class="divider" />
      <div class="total-row">
        <div>
          <p class="total-label">Total Harga</p>
          <p class="total-amount">${formatIDR(bookingDetails.total)}</p>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>Terima kasih telah memesan dengan Venellopy.io</p>
      <p>Harap simpan bukti booking ini untuk keperluan check-in.</p>
    </div>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    
    // Clean up the URL after the window is loaded
    if (printWindow) {
      printWindow.onafterprint = () => URL.revokeObjectURL(url);
    }
  };

  // Share booking details
  const handleShare = async () => {
    const shareData = {
      title: `Booking Venellopy.io - ${bookingCode}`,
      text: `🏨 Booking Berhasil!\n\nKode: ${bookingCode}\nHotel: Venellopy.io ${room.location || ''}\nKamar: ${room.title}\nCheck-in: ${formatDate(bookingDetails.checkIn)}\nCheck-out: ${formatDate(bookingDetails.checkOut)}\nTamu: ${bookingDetails.adults} Dewasa, ${bookingDetails.children} Anak\nTotal: ${formatIDR(bookingDetails.total)}\n\nStatus: ✅ Sudah Dibayar`,
      url: window.location.href,
    };

    // Use Web Share API if available (mobile & modern browsers)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled sharing, that's OK
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.text);
        setShareStatus('copied');
        setTimeout(() => setShareStatus(''), 2500);
      } catch (err) {
        // Final fallback: select and copy via textarea
        const textarea = document.createElement('textarea');
        textarea.value = shareData.text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setShareStatus('copied');
        setTimeout(() => setShareStatus(''), 2500);
      }
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col font-body-md text-on-surface antialiased"
      style={{
        backgroundImage: 'radial-gradient(var(--tw-surface-variant, #e1e2e5) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      <main className="flex-grow flex items-center justify-center py-stack-xl px-margin-mobile md:px-margin-desktop">
        <div className="max-w-[600px] w-full flex flex-col gap-stack-xl items-center">
          
          {/* Success Header */}
          <div className="text-center flex flex-col items-center gap-stack-md animate-[fadeIn_0.5s_ease-out]">
            <div className="w-24 h-24 rounded-full bg-tertiary-container/20 flex items-center justify-center mb-stack-sm relative">
              <div className="absolute inset-0 rounded-full bg-tertiary-container/10 animate-ping" style={{ animationDuration: '2s' }}></div>
              <svg className="w-12 h-12 text-tertiary" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 50,
                    animation: 'checkmark 0.6s ease-out forwards'
                  }}
                />
              </svg>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Booking Berhasil!</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">
              Terima kasih telah memesan dengan Venellopy.io. Kami sedang memproses konfirmasi Anda dengan pihak hotel.
            </p>
          </div>

          {/* E-Ticket Card */}
          <div ref={ticketRef} className="w-full bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.02),0_12px_20px_rgba(26,26,46,0.06)] relative overflow-hidden transition-transform duration-300 hover:scale-[1.01] hover:shadow-[0_4px_8px_rgba(26,26,46,0.04),0_16px_24px_rgba(26,26,46,0.08)]">
            
            {/* Ticket Header */}
            <div className="p-stack-lg bg-surface-container-lowest border-b border-outline-variant/30 flex justify-between items-start">
              <div>
                <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-stack-xs">Kode Booking</p>
                <p className="font-headline-md text-headline-md text-primary">{bookingCode}</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20">
                <span className="font-label-sm text-label-sm text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">pending</span>
                  Menunggu Konfirmasi
                </span>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-stack-lg bg-surface-container-lowest grid grid-cols-1 md:grid-cols-2 gap-stack-lg relative">
              {/* Cutout decorations */}
              <div className="absolute top-1/2 -left-3 w-6 h-6 bg-background rounded-full -translate-y-1/2 shadow-inner"></div>
              <div className="absolute top-1/2 -right-3 w-6 h-6 bg-background rounded-full -translate-y-1/2 shadow-inner"></div>

              <div className="col-span-1 md:col-span-2">
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-stack-xs">Venellopy.io {room.location}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">bed</span> {room.title}
                </p>
              </div>

              <div className="flex flex-col gap-stack-xs">
                <p className="font-label-sm text-label-sm text-secondary">Check-in</p>
                <p className="font-body-md text-body-md text-on-surface font-medium">{formatDate(bookingDetails.checkIn)}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Mulai 14:00</p>
              </div>
              <div className="flex flex-col gap-stack-xs">
                <p className="font-label-sm text-label-sm text-secondary">Check-out</p>
                <p className="font-body-md text-body-md text-on-surface font-medium">{formatDate(bookingDetails.checkOut)}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Sebelum 12:00</p>
              </div>

              <div className="col-span-1 md:col-span-2 my-stack-sm">
                <div
                  className="h-[2px] w-full text-outline-variant/50"
                  style={{
                    backgroundImage: 'linear-gradient(to right, currentColor 50%, transparent 50%)',
                    backgroundSize: '16px 2px',
                    backgroundRepeat: 'repeat-x'
                  }}
                ></div>
              </div>

              <div className="flex flex-col gap-stack-xs">
                <p className="font-label-sm text-label-sm text-secondary">Tamu</p>
                <p className="font-body-md text-body-md text-on-surface">
                  {bookingDetails.adults} Dewasa, {bookingDetails.children} Anak
                </p>
              </div>
              <div className="flex flex-col gap-stack-xs text-left md:text-right">
                <p className="font-label-sm text-label-sm text-secondary">Total Harga</p>
                <p className="font-headline-sm text-headline-sm text-on-surface">{formatIDR(bookingDetails.total)}</p>
                <p className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 md:justify-end">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Sudah Dibayar
                </p>
              </div>
            </div>

            {/* Ticket Footer / Actions */}
            <div className="p-stack-md bg-surface-container-low border-t border-outline-variant/30 flex gap-stack-sm justify-end">
              <button 
                onClick={handleShare}
                className="px-6 py-2 rounded-lg border border-outline text-on-surface-variant font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-2 group relative"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">share</span>
                {shareStatus === 'copied' ? 'Tersalin!' : 'Bagikan'}
                {shareStatus === 'copied' && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-xs px-2 py-1 rounded whitespace-nowrap">
                    Teks booking disalin ke clipboard
                  </span>
                )}
              </button>
              <button 
                onClick={handleDownload}
                className="px-6 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:bg-on-secondary-fixed-variant transition-colors shadow-sm flex items-center gap-2 group"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:-translate-y-1 transition-transform">download</span>
                Unduh
              </button>
            </div>
          </div>

          {/* Global Actions */}
          <div className="flex flex-col sm:flex-row gap-stack-md w-full sm:justify-center mt-stack-sm">
            <Link
              to="/"
              className="px-8 py-3 rounded-lg border-2 border-primary text-primary font-label-md text-label-md text-center hover:bg-primary/5 transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Lihat Riwayat
            </Link>
            <Link
              to="/"
              className="px-8 py-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md text-center shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      {/* Keyframes for checkmark animation */}
      <style>{`
        @keyframes checkmark {
          0% { stroke-dashoffset: 50; opacity: 0; transform: scale(0.8); }
          50% { stroke-dashoffset: 0; opacity: 1; transform: scale(1.1); }
          100% { stroke-dashoffset: 0; opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

