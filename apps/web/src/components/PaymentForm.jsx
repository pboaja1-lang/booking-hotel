import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PaymentForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addBooking, user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(23 * 3600 + 59 * 60 + 59);
  const [paymentMethod, setPaymentMethod] = useState('transfer');

  const { room, bookingDetails } = location.state || {
    room: {
      title: "Deluxe Room - City View",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiES_psZSzEcbraupcJmycKFnuwM3nIEGXeqt4U18UFe5KIpmLxtT5iib-cSY_llkAo8LAqw5sGCgOfhnMDIlwUgFtJqBS8QtURn7bWMeAg5ih1FGA95cLrwtXsuQh_v2YuHMTWCayBVnm2nCZ_yE6ZaqJ_XhU3dWehVsEejsd5j8XUT8MtQmsP00Qa5_a8AYn803qXY6et2BjVLsmyqgNQOYSJprCJE7xkafDvxG6pBqgad_VnJyPuYPl1-M7bvGB2Sdu5BZlMiL6",
      location: "Jakarta Pusat"
    },
    bookingDetails: {
      nights: 2,
      adults: 2,
      children: 0,
      subtotal: 1400000,
      tax: 100000,
      total: 1500000
    }
  };

  const formatIDR = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount).replace('Rp', 'Rp ');
  };

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
  const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pt-20">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/30">
        <nav className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <Link className="font-headline-md text-headline-md text-primary tracking-tight style_brand_logo hover:scale-105 transition-transform duration-200" to="/">Venellopy.io</Link>
          <div className="hidden md:flex items-center space-x-stack-lg">
            <Link className="font-label-md text-label-md text-secondary hover:text-primary transition-colors hover:scale-105 duration-200" to="/">Home</Link>
            <Link className="font-label-md text-label-md text-secondary hover:text-primary transition-colors hover:scale-105 duration-200" to="/search">Cari</Link>
          </div>
          <div className="flex items-center space-x-stack-sm">
            <button className="hidden md:flex items-center justify-center font-label-md text-label-md text-primary px-4 py-2 hover:bg-surface-container-low rounded-full transition-colors active:scale-95">Sign In</button>
            <button className="flex items-center justify-center font-label-md text-label-md bg-primary-container text-on-primary-container px-4 py-2 rounded-full hover:shadow-md hover:scale-105 transition-all duration-200 active:scale-95">Profile</button>
          </div>
        </nav>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow pb-stack-xl px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        {/* Booking Stepper */}
        <div className="w-full max-w-3xl mx-auto mb-stack-xl mt-stack-md">
          <div className="flex items-center justify-between relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10 w-1/3">
              <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-stack-xs font-label-md text-label-md shadow-sm">
                <span className="material-symbols-outlined text-[16px] font-bold">check</span>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary-container">Data Tamu</span>
            </div>
            {/* Line 1 to 2 */}
            <div className="absolute left-1/6 right-1/2 top-4 h-0.5 bg-tertiary-container z-0 -ml-4 -mr-4"></div>
            {/* Step 2 (Active) */}
            <div className="flex flex-col items-center relative z-10 w-1/3">
              <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center mb-stack-xs font-label-md text-label-md shadow-md ring-4 ring-primary-fixed">
                2
              </div>
              <span className="font-label-sm text-label-sm text-primary font-bold">Pembayaran</span>
            </div>
            {/* Line 2 to 3 */}
            <div className="absolute left-1/2 right-1/6 top-4 h-0.5 bg-surface-variant z-0 -ml-4 -mr-4"></div>
            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10 w-1/3">
              <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center mb-stack-xs font-label-md text-label-md">
                3
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Konfirmasi</span>
            </div>
          </div>
        </div>

        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-stack-xl text-center md:text-left">Selesaikan Pembayaran</h1>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column: Payment Methods */}
          <div className="lg:col-span-8 flex flex-col gap-stack-lg">
            {/* Payment Method Selection Box */}
            <div className="bg-surface-container-lowest rounded-xl p-stack-lg shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.03)] border border-outline-variant/20">
              <h2 className="font-headline-sm text-headline-sm text-on-background mb-stack-md">Pilih Metode Pembayaran</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-sm mb-stack-lg">
                {/* Transfer Bank */}
                <div 
                  onClick={() => setPaymentMethod('transfer')}
                  className={`rounded-lg p-stack-sm cursor-pointer transition-all duration-200 ${paymentMethod === 'transfer' ? 'border-2 border-primary bg-primary-fixed/20 shadow-sm' : 'border border-outline-variant/50 bg-surface hover:border-primary/50 hover:shadow-sm group'}`}>
                  <div className="flex items-center gap-stack-sm mb-stack-xs">
                    <span className={`material-symbols-outlined transition-colors ${paymentMethod === 'transfer' ? 'text-primary fill-icon' : 'text-secondary group-hover:text-primary'}`}>account_balance</span>
                    <span className={`font-label-md text-label-md ${paymentMethod === 'transfer' ? 'text-primary' : 'text-on-surface'}`}>Transfer Bank</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">BCA, Mandiri, BNI</p>
                </div>
                {/* E-Wallet */}
                <div 
                  onClick={() => setPaymentMethod('ewallet')}
                  className={`rounded-lg p-stack-sm cursor-pointer transition-all duration-200 ${paymentMethod === 'ewallet' ? 'border-2 border-primary bg-primary-fixed/20 shadow-sm' : 'border border-outline-variant/50 bg-surface hover:border-primary/50 hover:shadow-sm group'}`}>
                  <div className="flex items-center gap-stack-sm mb-stack-xs">
                    <span className={`material-symbols-outlined transition-colors ${paymentMethod === 'ewallet' ? 'text-primary fill-icon' : 'text-secondary group-hover:text-primary'}`}>account_balance_wallet</span>
                    <span className={`font-label-md text-label-md ${paymentMethod === 'ewallet' ? 'text-primary' : 'text-on-surface'}`}>E-Wallet</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">GoPay, OVO, DANA</p>
                </div>
                {/* Kartu Kredit */}
                <div 
                  onClick={() => setPaymentMethod('kredit')}
                  className={`rounded-lg p-stack-sm cursor-pointer transition-all duration-200 ${paymentMethod === 'kredit' ? 'border-2 border-primary bg-primary-fixed/20 shadow-sm' : 'border border-outline-variant/50 bg-surface hover:border-primary/50 hover:shadow-sm group'}`}>
                  <div className="flex items-center gap-stack-sm mb-stack-xs">
                    <span className={`material-symbols-outlined transition-colors ${paymentMethod === 'kredit' ? 'text-primary fill-icon' : 'text-secondary group-hover:text-primary'}`}>credit_card</span>
                    <span className={`font-label-md text-label-md ${paymentMethod === 'kredit' ? 'text-primary' : 'text-on-surface'}`}>Kartu Kredit</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-secondary">Visa, Mastercard</p>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-surface-container rounded-lg p-stack-lg">
                {paymentMethod === 'transfer' && (
                  <>
                    <div className="flex justify-between items-center mb-stack-md border-b border-outline-variant/30 pb-stack-sm">
                      <div className="flex items-center gap-stack-sm">
                        <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-blue-800 shadow-sm">BCA</div>
                        <span className="font-label-md text-label-md text-on-surface">Bank BCA</span>
                      </div>
                      <img alt="bca logo placeholder" className="h-8 rounded" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC639kG-fuARHuD0qiqA5dVsGEs7h4QYg4q6mi1gf4NfK3hevmHOldAdm0_BKtDVJBsVTjVmThXLlDanP2JOS7NioamsVk7GJX1wSYfWDl921f-03oZmOujBkjIWEpHcNhMG5UgmiJX2R4J3r8USIoJzSuTvoa4UewXfjnNjPYoX1wSp84W0a5-UlazgS3mfCfh5Dpz_l47j00Ot13Sf_n2f8RyY-6xhuASA1PBWlT3NVyrsn1G7YIs8fJ8T1YFkdABAo1QVpMfYGyS"/>
                    </div>
                    <div className="mb-stack-md">
                      <p className="font-body-sm text-body-sm text-secondary mb-stack-xs">Nomor Virtual Account</p>
                      <div className="flex items-center justify-between bg-surface-container-lowest p-stack-sm rounded border border-outline-variant/30">
                        <span className="font-headline-sm text-headline-sm text-on-background tracking-wider">8077 0812 3456 7890</span>
                        <button className="flex items-center gap-unit text-primary hover:text-surface-tint font-label-md text-label-md px-3 py-1.5 rounded bg-primary-fixed/30 hover:bg-primary-fixed/50 transition-colors" onClick={() => alert('Nomor disalin!')}>
                          <span className="material-symbols-outlined text-[18px]">content_copy</span>
                          Salin
                        </button>
                      </div>
                    </div>
                    <ul className="list-disc list-inside font-body-sm text-body-sm text-on-surface-variant space-y-unit opacity-80">
                      <li>Buka aplikasi BCA Mobile.</li>
                      <li>Pilih m-Transfer &gt; BCA Virtual Account.</li>
                      <li>Masukkan nomor di atas dan pastikan nama penerima adalah "Venellopy.io".</li>
                      <li>Selesaikan pembayaran.</li>
                    </ul>
                  </>
                )}
                
                {paymentMethod === 'ewallet' && (
                  <>
                    <div className="flex justify-between items-center mb-stack-md border-b border-outline-variant/30 pb-stack-sm">
                      <div className="flex items-center gap-stack-sm">
                        <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-green-600 shadow-sm">GPY</div>
                        <span className="font-label-md text-label-md text-on-surface">GoPay</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center py-stack-md">
                      <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-sm mb-stack-md">
                        {/* Placeholder QR */}
                        <div className="w-full h-full bg-surface-variant rounded flex items-center justify-center text-secondary font-label-sm">
                          [ QR Code ]
                        </div>
                      </div>
                      <p className="font-body-sm text-body-sm text-secondary text-center max-w-xs">Scan QR Code ini menggunakan aplikasi GoPay atau aplikasi e-wallet lain yang mendukung QRIS.</p>
                    </div>
                  </>
                )}
                
                {paymentMethod === 'kredit' && (
                  <>
                    <div className="mb-stack-md border-b border-outline-variant/30 pb-stack-sm">
                      <h3 className="font-label-md text-label-md text-on-surface">Detail Kartu Kredit</h3>
                    </div>
                    <div className="space-y-stack-md">
                      <div>
                        <label className="block font-label-sm text-label-sm text-secondary mb-1">Nomor Kartu</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full rounded border-outline-variant/50 p-2 text-body-sm bg-surface" />
                      </div>
                      <div className="grid grid-cols-2 gap-stack-md">
                        <div>
                          <label className="block font-label-sm text-label-sm text-secondary mb-1">Masa Berlaku (MM/YY)</label>
                          <input type="text" placeholder="MM/YY" className="w-full rounded border-outline-variant/50 p-2 text-body-sm bg-surface" />
                        </div>
                        <div>
                          <label className="block font-label-sm text-label-sm text-secondary mb-1">CVV</label>
                          <input type="text" placeholder="123" className="w-full rounded border-outline-variant/50 p-2 text-body-sm bg-surface" />
                        </div>
                      </div>
                      <div>
                        <label className="block font-label-sm text-label-sm text-secondary mb-1">Nama di Kartu</label>
                        <input type="text" placeholder="John Doe" className="w-full rounded border-outline-variant/50 p-2 text-body-sm bg-surface" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-surface-container-lowest rounded-xl p-stack-lg shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.03)] border border-outline-variant/20 sticky top-28">
              {/* Countdown */}
              <div className="bg-error-container/30 border border-error-container rounded-lg p-stack-sm mb-stack-lg flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-error flex items-center gap-unit">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  Selesaikan dalam
                </span>
                <span className="font-headline-sm text-headline-sm text-error font-bold">{h}:{m}:{s}</span>
              </div>
              
              <h3 className="font-headline-sm text-headline-sm text-on-background mb-stack-sm">Detail Pesanan</h3>
              <p className="font-body-sm text-body-sm text-secondary mb-stack-md pb-stack-sm border-b border-outline-variant/30">
                Kode Booking: <span className="font-label-md text-label-md text-on-surface">#BK-2026052701</span>
              </p>
              
              {/* Room Details Summary */}
              <div className="flex gap-stack-sm mb-stack-md">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 relative">
                  <img alt={room.title} className="w-full h-full object-cover" src={room.image}/>
                  <div className="absolute inset-0 ring-1 ring-inset ring-outline-variant/20 rounded"></div>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-background">{room.title}</h4>
                  <p className="font-body-sm text-body-sm text-secondary">{room.location}</p>
                  <p className="font-body-sm text-body-sm text-secondary text-xs mt-1">{bookingDetails.nights} Malam • {bookingDetails.adults} Dewasa{bookingDetails.children > 0 ? `, ${bookingDetails.children} Anak` : ''}</p>
                </div>
              </div>
              
              <div className="space-y-stack-sm border-t border-outline-variant/30 pt-stack-md mb-stack-lg">
                <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>Subtotal ({bookingDetails.nights} Malam)</span>
                  <span>{formatIDR(bookingDetails.subtotal)}</span>
                </div>
                <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>Pajak &amp; Biaya (10%)</span>
                  <span>{formatIDR(bookingDetails.tax)}</span>
                </div>
                <div className="flex justify-between items-end pt-stack-sm">
                  <span className="font-label-md text-label-md text-on-background">TOTAL</span>
                  <span className="font-headline-md text-headline-md text-primary font-bold">{formatIDR(bookingDetails.total)}</span>
                </div>
              </div>
              
              {/* Primary Action */}
              <button 
                onClick={async () => {
                  const today = new Date();
                  const checkIn = new Date(today);
                  checkIn.setDate(today.getDate() + 3);
                  const checkOut = new Date(checkIn);
                  checkOut.setDate(checkIn.getDate() + bookingDetails.nights);
                  
                  if (user) {
                    try {
                      await addBooking({
                        roomId: room.id || 1,
                        checkIn: checkIn.getTime(),
                        checkOut: checkOut.getTime(),
                        nights: bookingDetails.nights,
                        adults: bookingDetails.adults,
                        children: bookingDetails.children,
                        guestName: user.name,
                        guestEmail: user.email,
                        subtotal: bookingDetails.subtotal,
                        taxAmount: bookingDetails.tax,
                        totalAmount: bookingDetails.total,
                        paymentMethod: paymentMethod === 'transfer' ? 'transfer' : paymentMethod === 'ewallet' ? 'ewallet' : 'kredit',
                      });
                      
                      navigate('/confirmation', { state: location.state });
                    } catch (error) {
                      alert("Gagal memproses pesanan: " + error.message);
                    }
                  } else {
                    alert("Anda harus login terlebih dahulu.");
                  }
                }}
                className="w-full bg-primary-container hover:bg-surface-tint text-white font-label-md text-label-md py-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 active:scale-95 flex justify-center items-center gap-stack-xs"
              >
                SAYA SUDAH BAYAR
              </button>
              <p className="text-center font-body-sm text-body-sm text-secondary text-xs mt-stack-sm">
                Dengan mengklik tombol ini, Anda menyetujui Syarat &amp; Ketentuan.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-stack-xl bg-surface-container-lowest grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mt-auto border-t border-outline-variant/20">
        <div>
          <div className="font-headline-sm text-headline-sm text-primary mb-stack-sm">Venellopy.io</div>
          <p className="font-body-sm text-body-sm text-secondary">© 2024 Venellopy.io. All rights reserved.</p>
        </div>
        <div className="flex flex-col gap-stack-xs">
          <Link className="font-body-sm text-body-sm text-secondary hover:text-primary hover:underline transition-opacity duration-200" to="#">About Us</Link>
          <Link className="font-body-sm text-body-sm text-secondary hover:text-primary hover:underline transition-opacity duration-200" to="#">Terms of Service</Link>
        </div>
        <div className="flex flex-col gap-stack-xs">
          <Link className="font-body-sm text-body-sm text-secondary hover:text-primary hover:underline transition-opacity duration-200" to="#">Privacy Policy</Link>
          <Link className="font-body-sm text-body-sm text-secondary hover:text-primary hover:underline transition-opacity duration-200" to="#">Contact Support</Link>
        </div>
        <div className="flex flex-col gap-stack-xs">
          <Link className="font-body-sm text-body-sm text-secondary hover:text-primary hover:underline transition-opacity duration-200" to="#">Hotel Partners</Link>
        </div>
      </footer>
    </div>
  );
}
