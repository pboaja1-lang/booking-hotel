import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function RoomDetail() {
  const location = useLocation();
  const room = location.state?.room || {
    title: "Kamar Deluxe",
    description: "Nikmati kenyamanan maksimal di kamar Deluxe kami yang dirancang dengan sentuhan modern dan fasilitas premium. Sempurna untuk pelancong bisnis maupun rekreasi, kamar ini menawarkan ruang yang luas, pencahayaan alami yang melimpah, dan pemandangan kota yang menakjubkan. Tempat tidur king-size dengan linen berkualitas tinggi menjamin istirahat yang nyenyak.",
    price: "Rp 750.000",
    priceNumeric: 750000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDCYoMyHPZ_QUt9zqaFTlD2o1Q9ZQOEYSoeIiMC8iz6Yz-RDpBF1dz_LkZ9BBPA8IqqSnvAGbILhr6HrNDQ5aCMw9ynZbm_hCZQYveyZb7Z-S_wMEWxQFrD7GolclVCRwrQYVLtqmPv144bDLFg5G3vfConVIv9z5iV-mw-33404_nkpk6B5ScsIYMy6v7Q9PE5kRLkZPAkd4rRxqzdqU_ztebu0PhWT0BCiLOh-r-kbDCuEf20O90HPBesCz-Po-WGTn3O3o_0OM1",
    rating: "4.8"
  };

  const [checkIn, setCheckIn] = useState('2024-10-12');
  const [checkOut, setCheckOut] = useState('2024-10-14');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showGuestMenu, setShowGuestMenu] = useState(false);

  // Calculate nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  let timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  let nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  if (isNaN(nights) || nights < 1) nights = 1;

  const pricePerNight = room.priceNumeric;
  const subtotal = pricePerNight * nights;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const formatIDR = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount).replace('Rp', 'Rp ');
  };
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg pt-24">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-secondary mb-stack-md">
        <a className="font-body-sm text-body-sm hover:text-primary transition-colors" href="#">Home</a>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <a className="font-body-sm text-body-sm hover:text-primary transition-colors" href="#">Search</a>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="font-body-sm text-body-sm text-on-background font-medium">{room.title}</span>
      </nav>

      {/* Image Gallery (Bento-ish) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-sm md:gap-stack-md mb-stack-xl md:h-[400px]">
        <div className="md:col-span-2 relative rounded-xl overflow-hidden shadow-sm group">
          <img
            alt={room.title}
            className="w-full h-[300px] md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={room.image}
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl pointer-events-none"></div>
        </div>
        <div className="hidden md:grid grid-rows-2 gap-stack-md">
          <div className="relative rounded-xl overflow-hidden shadow-sm group">
            <img
              alt="Luxurious modern hotel bathroom with a freestanding tub"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEARlyoqoMvzwP4r8QVxEBWK323L0q1dAydkWikUuHEg_bHEoHALzabbFRy9-SogCtV1w98DgwPZVx4WxmDaFPadh6WJzErAo5YjB783F0QAsJ_iNP3bPHhE1Hdv36cbxiqViJ0aBXDQ9rwHbW_X9VLEi5lE3iH1Z_y6ZuofBPNjkF5pacRIc9wlgb4yOnCUfi_Z08_DVSDUaTsxCNmCJyoqJhaZRJVEZXcKRq2nMTwvkOQ-zsRWE9hESTf7kcD1ZUjLivpxHU9CrE"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl pointer-events-none"></div>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-sm group">
            <img
              alt="Comfortable hotel room seating area with modern chairs"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv44qSnsAtOAan1AswXxktDjp_f7WdBMq2K1jjc0ywGf9EOkRZJjqLuzx6yj3xt3t5vTehungKvpX8Xv0kBCpALrMPbST0xgPJ7s6lGaY0DmyXmzFGk_NsQErVzVQys74gjv8e46FHhOE_HCwI3bNJXCNY9ET-Sl4c9pAB3Rr6GxbQHmrkMWUBUUpcyoLt1oZZyTpLpqiU0EKgAw_varKtrvHOOweEXntgqMXbM4f9XdZ--PNHPnuh9IISw7eUrkWM72ILhsenc-lT"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-xl">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-stack-xl">
          {/* Header Info */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-label-sm text-label-sm">Best Seller</span>
              <div className="flex items-center text-primary">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-stack-sm">{room.title}</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Facilities */}
          <div className="border-t border-surface-variant pt-stack-lg">
            <h2 className="font-headline-sm text-headline-sm mb-stack-md">Fasilitas Utama</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-stack-md">
              <div className="flex items-center space-x-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary">wifi</span>
                <span className="font-body-sm text-body-sm">Free Wi-Fi</span>
              </div>
              <div className="flex items-center space-x-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary">ac_unit</span>
                <span className="font-body-sm text-body-sm">AC</span>
              </div>
              <div className="flex items-center space-x-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary">tv</span>
                <span className="font-body-sm text-body-sm">Smart TV</span>
              </div>
              <div className="flex items-center space-x-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary">coffee_maker</span>
                <span className="font-body-sm text-body-sm">Coffee Maker</span>
              </div>
              <div className="flex items-center space-x-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary">bathtub</span>
                <span className="font-body-sm text-body-sm">Bathtub</span>
              </div>
              <div className="flex items-center space-x-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary">room_service</span>
                <span className="font-body-sm text-body-sm">Room Service</span>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="border-t border-surface-variant pt-stack-lg">
            <h2 className="font-headline-sm text-headline-sm mb-stack-md">Kebijakan Kamar</h2>
            <div className="bg-surface-container-low rounded-xl p-stack-md border border-surface-variant">
              <div className="flex items-start space-x-3 mb-4">
                <span className="material-symbols-outlined text-primary mt-1">info</span>
                <div>
                  <h3 className="font-label-md text-label-md mb-1">Kebijakan Pembatalan</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Pembatalan gratis hingga 24 jam sebelum waktu check-in. Pembatalan dalam waktu 24 jam akan dikenakan biaya malam pertama.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="material-symbols-outlined text-primary mt-1">schedule</span>
                <div>
                  <h3 className="font-label-md text-label-md mb-1">Waktu Check-in/Check-out</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Check-in: 14:00 | Check-out: 12:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-surface-variant pt-stack-lg">
            <h2 className="font-headline-sm text-headline-sm mb-stack-md">Ulasan Tamu</h2>
            <div className="space-y-stack-md">
              {/* Review Item */}
              <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-sm border border-surface-variant">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-label-md">
                      AN
                    </div>
                    <div>
                      <p className="font-label-md text-label-md">Andi N.</p>
                      <p className="font-body-sm text-body-sm text-secondary">2 minggu lalu</p>
                    </div>
                  </div>
                  <div className="flex text-primary">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-3">Kamar sangat bersih dan nyaman. Pelayanan ramah, lokasi strategis. Pasti akan kembali lagi!</p>
              </div>

              {/* Review Item */}
              <div className="bg-surface-container-lowest rounded-xl p-stack-md shadow-sm border border-surface-variant">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-label-md">
                      BW
                    </div>
                    <div>
                      <p className="font-label-md text-label-md">Budi W.</p>
                      <p className="font-body-sm text-body-sm text-secondary">1 bulan lalu</p>
                    </div>
                  </div>
                  <div className="flex text-primary">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[16px]">star</span>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-3">Sangat memuaskan. Proses check-in cepat dan fasilitas lengkap sesuai deskripsi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.05)] border border-surface-variant p-stack-lg">
            <div className="mb-stack-md flex items-end justify-between">
              <div>
                <span className="font-headline-md text-headline-md text-primary font-bold">{room.price}</span>
                <span className="font-body-sm text-body-sm text-secondary">/malam</span>
              </div>
            </div>
            
            <div className="border border-outline-variant rounded-lg overflow-visible mb-stack-md bg-surface relative">
              <div className="flex border-b border-outline-variant">
                <div className="flex-1 p-3 border-r border-outline-variant hover:bg-surface-container-low transition-colors relative">
                  <label className="block font-label-sm text-label-sm text-secondary mb-1">CHECK-IN</label>
                  <input 
                    type="date" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full min-w-0 border-0 p-0 bg-transparent font-body-sm text-body-sm focus:ring-0 focus:outline-none cursor-pointer"
                  />
                </div>
                <div className="flex-1 p-3 hover:bg-surface-container-low transition-colors relative">
                  <label className="block font-label-sm text-label-sm text-secondary mb-1">CHECK-OUT</label>
                  <input 
                    type="date" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full min-w-0 border-0 p-0 bg-transparent font-body-sm text-body-sm focus:ring-0 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
              <div 
                className="p-3 hover:bg-surface-container-low transition-colors cursor-pointer flex justify-between items-center relative"
                onClick={() => setShowGuestMenu(!showGuestMenu)}
              >
                <div>
                  <label className="block font-label-sm text-label-sm text-secondary mb-1">TAMU</label>
                  <div className="font-body-sm text-body-sm">{adults} Dewasa, {children} Anak</div>
                </div>
                <span className="material-symbols-outlined text-secondary">expand_more</span>
              </div>
              
              {/* Guest Dropdown */}
              {showGuestMenu && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-10 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <div className="font-label-md text-label-md">Dewasa</div>
                      <div className="font-body-sm text-body-sm text-secondary">Usia 13+</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setAdults(Math.max(1, adults - 1)); }}
                        className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low"
                      >
                        -
                      </button>
                      <span className="font-body-md text-body-md w-4 text-center">{adults}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setAdults(adults + 1); }}
                        className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-label-md text-label-md">Anak-anak</div>
                      <div className="font-body-sm text-body-sm text-secondary">Usia 0-12</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setChildren(Math.max(0, children - 1)); }}
                        className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low"
                      >
                        -
                      </button>
                      <span className="font-body-md text-body-md w-4 text-center">{children}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setChildren(children + 1); }}
                        className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Link 
              to="/booking" 
              state={{ 
                room, 
                bookingDetails: { checkIn, checkOut, nights, subtotal, tax, total, adults, children } 
              }}
              className="block text-center w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg active:scale-95 mb-stack-md"
            >
              PESAN SEKARANG
            </Link>
            
            <div className="space-y-2 mb-stack-md border-b border-surface-variant pb-stack-md">
              <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                <span>{room.price} x {nights} malam</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                <span>Pajak & Biaya (10%)</span>
                <span>{formatIDR(tax)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center font-headline-sm text-headline-sm text-on-background">
              <span>Total Pembayaran</span>
              <span className="text-primary-container">{formatIDR(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
