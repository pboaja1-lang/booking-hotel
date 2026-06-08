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
      <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center mt-16 md:mt-24">
        <h1 className="font-headline-xl text-headline-xl text-white mb-stack-xl text-center drop-shadow-md tracking-tight">
          Pilihan utama untuk jelajahi dunia
        </h1>

        <div className="w-full max-w-5xl">
          {/* Menu Options (Traveloka Style) */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 mb-6">
            <button className="flex flex-col items-center justify-center bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full px-6 py-2 shadow-lg min-w-[100px] hover:bg-white/30 transition-all duration-200">
              <span className="material-symbols-outlined mb-1">domain</span>
              <span className="font-label-sm font-bold">Hotel</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-8 mb-2 ml-2">
            <div className="text-white font-label-sm flex-[1.5]">Kota, tujuan, atau nama akomodasi</div>
            <div className="text-white font-label-sm flex-1">Tanggal Check-in & Check-out</div>
            <div className="text-white font-label-sm flex-1">Tamu dan Kamar</div>
          </div>

          {/* Search Bar - Single Pill Design */}
          <form 
            onSubmit={handleSearch}
            className="bg-white p-1 md:p-1.5 rounded-[32px] w-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex flex-col md:flex-row items-center border border-gray-200"
          >
            {/* Lokasi */}
            <div className="flex-[1.5] w-full px-4 py-3 hover:bg-surface-container-low transition-colors rounded-full cursor-pointer group flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]">location_on</span>
              <input 
                type="text" 
                placeholder="Kota, vila, atau destinasi" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full min-w-0 bg-transparent border-0 p-0 font-body-lg text-body-lg focus:ring-0 text-on-surface placeholder:text-gray-400"
              />
            </div>
            
            <div className="hidden md:block w-px h-10 bg-gray-300"></div>

            {/* Check-in & Check-out Combined */}
            <div className="flex-1 w-full px-4 py-3 hover:bg-surface-container-low transition-colors rounded-full cursor-pointer group flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]">calendar_month</span>
              <div className="flex items-center w-full">
                <input 
                  type="date" 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-1/2 min-w-0 bg-transparent border-0 p-0 font-body-md text-body-md focus:ring-0 text-on-surface cursor-pointer"
                />
                <span className="text-gray-400 mx-1">-</span>
                <input 
                  type="date" 
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-1/2 min-w-0 bg-transparent border-0 p-0 font-body-md text-body-md focus:ring-0 text-on-surface cursor-pointer"
                />
              </div>
            </div>
            
            <div className="hidden md:block w-px h-10 bg-gray-300"></div>

            {/* Tamu & Kamar */}
            <div className="flex-1 w-full px-4 py-3 hover:bg-surface-container-low transition-colors rounded-full cursor-pointer group flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]">person</span>
              <select 
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full min-w-0 bg-transparent border-0 pl-0 pr-8 py-0 text-ellipsis overflow-hidden whitespace-nowrap font-body-md text-body-md focus:ring-0 text-on-surface cursor-pointer"
              >
                <option value="1 Dewasa, 0 Anak, 1 Kamar">1 Dewasa, 0 Anak, 1 Kamar</option>
                <option value="2 Dewasa, 0 Anak, 1 Kamar">2 Dewasa, 0 Anak, 1 Kamar</option>
                <option value="3 Dewasa, 0 Anak, 1 Kamar">3 Dewasa, 0 Anak, 1 Kamar</option>
                <option value="4 Dewasa, 0 Anak, 2 Kamar">4 Dewasa, 0 Anak, 2 Kamar</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="p-1 w-full md:w-auto">
              <button 
                type="submit"
                className="w-full md:w-[60px] h-[50px] bg-[#0071c2] text-white hover:bg-[#00487a] rounded-[28px] font-label-md text-label-md transition-all duration-200 shadow-md flex items-center justify-center active:scale-95"
              >
                <span className="material-symbols-outlined text-[24px]">search</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
