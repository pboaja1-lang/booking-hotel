import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function BookingForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const { room, bookingDetails } = location.state || {
    room: {
      title: "Deluxe Room - City View",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiES_psZSzEcbraupcJmycKFnuwM3nIEGXeqt4U18UFe5KIpmLxtT5iib-cSY_llkAo8LAqw5sGCgOfhnMDIlwUgFtJqBS8QtURn7bWMeAg5ih1FGA95cLrwtXsuQh_v2YuHMTWCayBVnm2nCZ_yE6ZaqJ_XhU3dWehVsEejsd5j8XUT8MtQmsP00Qa5_a8AYn803qXY6et2BjVLsmyqgNQOYSJprCJE7xkafDvxG6pBqgad_VnJyPuYPl1-M7bvGB2Sdu5BZlMiL6",
      rating: "4.8"
    },
    bookingDetails: {
      checkIn: "2026-05-27",
      checkOut: "2026-05-29",
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

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pt-20">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full bg-surface-container-lowest border-b border-outline-variant/30 h-20 flex items-center px-margin-mobile md:px-margin-desktop z-50 shadow-sm">
        <div className="max-w-container-max mx-auto w-full flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-on-surface-variant hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined mr-2 group-hover:-translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_back</span>
            <span className="font-label-md text-label-md">Kembali</span>
          </button>
          <div className="flex-1 text-center font-headline-sm text-headline-sm text-primary tracking-tight font-bold">
            Venellopy.io
          </div>
          <div className="w-20"></div> {/* Spacer for center alignment */}
        </div>
      </header>

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl">
        {/* Booking Stepper */}
        <div className="mb-stack-xl max-w-3xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-variant -z-10 rounded-full"></div>
            {/* Step 1: Active */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold shadow-md ring-4 ring-background">
                1
              </div>
              <span className="mt-stack-sm font-label-md text-label-md text-primary">Data Tamu</span>
            </div>
            {/* Step 2: Inactive */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-headline-sm text-headline-sm font-bold shadow-sm ring-4 ring-background">
                2
              </div>
              <span className="mt-stack-sm font-label-md text-label-md text-on-surface-variant">Review</span>
            </div>
            {/* Step 3: Inactive */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-headline-sm text-headline-sm font-bold shadow-sm ring-4 ring-background">
                3
              </div>
              <span className="mt-stack-sm font-label-md text-label-md text-on-surface-variant">Pembayaran</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column (Guest Form) */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-stack-lg border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-lg">Detail Tamu</h2>
              <form className="space-y-stack-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-unit" htmlFor="nama_lengkap">Nama Lengkap</label>
                    <input className="w-full rounded-lg border-outline-variant bg-surface focus:ring-primary focus:border-primary shadow-sm font-body-md text-body-md" id="nama_lengkap" placeholder="Sesuai KTP/Paspor" type="text" />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-unit" htmlFor="email">Alamat Email</label>
                    <input className="w-full rounded-lg border-outline-variant bg-surface focus:ring-primary focus:border-primary shadow-sm font-body-md text-body-md" id="email" placeholder="email@contoh.com" type="email" />
                  </div>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-unit" htmlFor="telepon">No. Telepon</label>
                  <input className="w-full rounded-lg border-outline-variant bg-surface focus:ring-primary focus:border-primary shadow-sm font-body-md text-body-md" id="telepon" placeholder="+62 812 3456 7890" type="tel" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-unit" htmlFor="permintaan">Permintaan Khusus (Opsional)</label>
                  <textarea className="w-full rounded-lg border-outline-variant bg-surface focus:ring-primary focus:border-primary shadow-sm font-body-md text-body-md" id="permintaan" placeholder="Contoh: Kamar bebas rokok, check-in lebih awal..." rows="3"></textarea>
                </div>
                <div className="flex items-start mt-stack-lg pt-stack-sm border-t border-outline-variant/30">
                  <div className="flex items-center h-5">
                    <input 
                      className="w-5 h-5 text-primary border-2 border-outline-variant rounded focus:ring-primary focus:ring-offset-2 cursor-pointer transition-all" 
                      id="terms" 
                      type="checkbox" 
                      defaultChecked
                    />
                  </div>
                  <label className="ml-stack-sm font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" htmlFor="terms">
                    Saya telah membaca dan menyetujui Syarat &amp; Ketentuan serta Kebijakan Privasi dari Venellopy.io.
                  </label>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column (Booking Summary) */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.05)] p-stack-lg border border-outline-variant/30 sticky top-28">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack-md">Rincian Pesanan</h3>
              <div className="flex gap-stack-md mb-stack-md pb-stack-md border-b border-outline-variant/30">
                <img alt={room.title} className="w-24 h-24 object-cover rounded-lg ring-1 ring-black/5" src={room.image} />
                <div className="flex flex-col justify-center">
                  <h4 className="font-label-md text-label-md text-on-surface">{room.title}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mt-unit">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    {room.rating} (120 Ulasan)
                  </p>
                </div>
              </div>

              <div className="space-y-stack-sm mb-stack-lg pb-stack-md border-b border-outline-variant/30">
                <div className="flex justify-between items-center">
                  <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">calendar_month</span>
                    Tanggal Menginap
                  </span>
                  <span className="font-label-md text-label-md text-on-surface">{bookingDetails.checkIn} s/d {bookingDetails.checkOut}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">group</span>
                    Tamu &amp; Kamar
                  </span>
                  <span className="font-label-md text-label-md text-on-surface">{bookingDetails.adults} Dewasa{bookingDetails.children > 0 ? `, ${bookingDetails.children} Anak` : ''}, 1 Kamar</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">night_shelter</span>
                    Durasi
                  </span>
                  <span className="font-label-md text-label-md text-on-surface">{bookingDetails.nights} Malam</span>
                </div>
              </div>

              <div className="space-y-stack-sm mb-stack-lg pb-stack-md border-b border-outline-variant/30">
                <div className="flex justify-between items-center">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Harga Kamar ({bookingDetails.nights} Malam)</span>
                  <span className="font-body-md text-body-md text-on-surface">{formatIDR(bookingDetails.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Pajak &amp; Biaya Layanan</span>
                  <span className="font-body-md text-body-md text-on-surface">{formatIDR(bookingDetails.tax)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-stack-lg">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">TOTAL</span>
                <span className="font-headline-sm text-headline-sm text-primary-container font-bold">{formatIDR(bookingDetails.total)}</span>
              </div>

              <Link 
                to="/payment" 
                state={location.state}
                className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-4 rounded-lg hover:bg-primary transition-all duration-200 hover:scale-[1.02] shadow-md flex items-center justify-center gap-2 group active:scale-95"
              >
                LANJUT KE PEMBAYARAN
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              
              <p className="font-label-sm text-label-sm text-on-surface-variant text-center mt-stack-sm flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                Pembayaran Aman Terenkripsi
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
