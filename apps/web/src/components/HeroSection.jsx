import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2 Tamu, 1 Kamar');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/search', { state: { location, checkIn, checkOut, guests }});
  };

  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center mt-10">
        <h1 className="font-headline-xl text-headline-xl text-white mb-stack-sm text-center drop-shadow-md">
          Temukan Hotel Impian Anda
        </h1>
        <p className="font-body-lg text-body-lg text-white mb-stack-xl text-center max-w-2xl drop-shadow-sm opacity-90">
          Pengalaman menginap mewah dengan layanan yang dirancang khusus untuk kenyamanan Anda. Pesan sekarang dan nikmati penawaran eksklusif.
        </p>

        {/* Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="bg-surface-container-lowest p-2 md:p-3 rounded-2xl w-full max-w-5xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col md:flex-row gap-2"
        >
          {/* Lokasi */}
          <div className="flex-[1.2] px-4 py-2 hover:bg-surface-container-low transition-colors rounded-xl cursor-pointer">
            <label className="block font-label-sm text-label-sm text-secondary mb-1">Lokasi</label>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">location_on</span>
              <input 
                type="text" 
                placeholder="Mau ke mana?" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full min-w-0 bg-transparent border-0 p-0 font-body-md text-body-md focus:ring-0 text-on-surface"
              />
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  const query = location ? encodeURIComponent(location) : '';
                  window.open(`https://www.google.com/maps/search/${query}`, '_blank', 'noopener,noreferrer');
                }}
                className="flex items-center justify-center text-primary hover:text-primary-container transition-colors"
                title="Buka Peta"
              >
                <span className="material-symbols-outlined text-[20px]">map</span>
              </button>
            </div>
          </div>
          
          <div className="hidden md:block w-px bg-outline-variant/30 my-2"></div>

          {/* Check-in */}
          <div className="flex-1 px-4 py-2 hover:bg-surface-container-low transition-colors rounded-xl cursor-pointer">
            <label className="block font-label-sm text-label-sm text-secondary mb-1">Check-in</label>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">calendar_today</span>
              <input 
                type="date" 
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full min-w-0 bg-transparent border-0 p-0 font-body-md text-body-md focus:ring-0 text-on-surface cursor-pointer"
              />
            </div>
          </div>
          
          <div className="hidden md:block w-px bg-outline-variant/30 my-2"></div>

          {/* Check-out */}
          <div className="flex-1 px-4 py-2 hover:bg-surface-container-low transition-colors rounded-xl cursor-pointer">
            <label className="block font-label-sm text-label-sm text-secondary mb-1">Check-out</label>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">calendar_today</span>
              <input 
                type="date" 
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full min-w-0 bg-transparent border-0 p-0 font-body-md text-body-md focus:ring-0 text-on-surface cursor-pointer"
              />
            </div>
          </div>
          
          <div className="hidden md:block w-px bg-outline-variant/30 my-2"></div>

          {/* Tamu & Kamar */}
          <div className="flex-1 px-4 py-2 hover:bg-surface-container-low transition-colors rounded-xl cursor-pointer">
            <label className="block font-label-sm text-label-sm text-secondary mb-1">Tamu & Kamar</label>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">person</span>
                <select 
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full min-w-0 bg-transparent border-0 pl-0 pr-8 py-0 text-ellipsis overflow-hidden whitespace-nowrap font-body-md text-body-md focus:ring-0 text-on-surface cursor-pointer"
              >
                <option value="1 Tamu, 1 Kamar">1 Tamu, 1 Kamar</option>
                <option value="2 Tamu, 1 Kamar">2 Tamu, 1 Kamar</option>
                <option value="3 Tamu, 1 Kamar">3 Tamu, 1 Kamar</option>
                <option value="4 Tamu, 2 Kamar">4 Tamu, 2 Kamar</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-center justify-center p-2">
            <button 
              type="submit"
              className="w-full md:w-auto h-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary px-8 py-3 rounded-xl font-label-md text-label-md transition-all duration-200 hover:scale-[1.02] shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              CARI HOTEL
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
