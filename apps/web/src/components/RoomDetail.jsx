import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

// Mock data for nearby attractions (will be per-room in future with DB)
const MOCK_ATTRACTIONS = [
  { name: "Monumen Nasional (Monas)", distance: "1.2 km", icon: "museum", lat: -6.1754, lng: 106.8272 },
  { name: "Museum Nasional Indonesia", distance: "1.8 km", icon: "account_balance", lat: -6.1764, lng: 106.8222 },
  { name: "Masjid Istiqlal", distance: "2.1 km", icon: "mosque", lat: -6.1700, lng: 106.8311 },
  { name: "Taman Suropati", distance: "2.5 km", icon: "park", lat: -6.1990, lng: 106.8366 },
  { name: "Grand Indonesia Mall", distance: "3.0 km", icon: "shopping_bag", lat: -6.1951, lng: 106.8207 },
];

const MOCK_LOCATION = { lat: -6.1862, lng: 106.8341, address: "Jl. M.H. Thamrin No.1, Jakarta Pusat" };

// Additional gallery images (fallback)
const EXTRA_GALLERY_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDEARlyoqoMvzwP4r8QVxEBWK323L0q1dAydkWikUuHEg_bHEoHALzabbFRy9-SogCtV1w98DgwPZVx4WxmDaFPadh6WJzErAo5YjB783F0QAsJ_iNP3bPHhE1Hdv36cbxiqViJ0aBXDQ9rwHbW_X9VLEi5lE3iH1Z_y6ZuofBPNjkF5pacRIc9wlgb4yOnCUfi_Z08_DVSDUaTsxCNmCJyoqJhaZRJVEZXcKRq2nMTwvkOQ-zsRWE9hESTf7kcD1ZUjLivpxHU9CrE",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBv44qSnsAtOAan1AswXxktDjp_f7WdBMq2K1jjc0ywGf9EOkRZJjqLuzx6yj3xt3t5vTehungKvpX8Xv0kBCpALrMPbST0xgPJ7s6lGaY0DmyXmzFGk_NsQErVzVQys74gjv8e46FHhOE_HCwI3bNJXCNY9ET-Sl4c9pAB3Rr6GxbQHmrkMWUBUUpcyoLt1oZZyTpLpqiU0EKgAw_varKtrvHOOweEXntgqMXbM4f9XdZ--PNHPnuh9IISw7eUrkWM72ILhsenc-lT",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCDCYoMyHPZ_QUt9zqaFTlD2o1Q9ZQOEYSoeIiMC8iz6Yz-RDpBF1dz_LkZ9BBPA8IqqSnvAGbILhr6HrNDQ5aCMw9ynZbm_hCZQYveyZb7Z-S_wMEWxQFrD7GolclVCRwrQYVLtqmPv144bDLFg5G3vfConVIv9z5iV-mw-33404_nkpk6B5ScsIYMy6v7Q9PE5kRLkZPAkd4rRxqzdqU_ztebu0PhWT0BCiLOh-r-kbDCuEf20O90HPBesCz-Po-WGTn3O3o_0OM1",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDiES_psZSzEcbraupcJmycKFnuwM3nIEGXeqt4U18UFe5KIpmLxtT5iib-cSY_llkAo8LAqw5sGCgOfhnMDIlwUgFtJqBS8QtURn7bWMeAg5ih1FGA95cLrwtXsuQh_v2YuHMTWCayBVnm2nCZ_yE6ZaqJ_XhU3dWehVsEejsd5j8XUT8MtQmsP00Qa5_a8AYn803qXY6et2BjVLsmyqgNQOYSJprCJE7xkafDvxG6pBqgad_VnJyPuYPl1-M7bvGB2Sdu5BZlMiL6",
  "https://images.unsplash.com/photo-1590490360182-c33d955b4c60?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&auto=format&fit=crop",
];

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

// Google Maps component
function LocationMap({ center, roomTitle, attractions }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [selectedAttraction, setSelectedAttraction] = useState(null);

  const onLoad = useCallback((map) => {
    // Fit bounds to include hotel + attractions
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(center);
    attractions.forEach(a => bounds.extend({ lat: a.lat, lng: a.lng }));
    map.fitBounds(bounds);
    // Don't zoom in too much
    const listener = window.google.maps.event.addListener(map, 'idle', () => {
      if (map.getZoom() > 15) map.setZoom(15);
      window.google.maps.event.removeListener(listener);
    });
  }, [center, attractions]);

  if (loadError) {
    return (
      <div className="h-full rounded-xl bg-surface-container flex items-center justify-center text-secondary">
        <div className="text-center p-4">
          <span className="material-symbols-outlined text-4xl mb-2 block">map</span>
          <p className="font-body-sm text-body-sm">Gagal memuat peta. Pastikan API key Google Maps sudah dikonfigurasi.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full rounded-xl bg-surface-container flex items-center justify-center text-secondary animate-pulse">
        <span className="material-symbols-outlined text-4xl">map</span>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={14}
      onLoad={onLoad}
      options={mapOptions}
    >
      {/* Hotel Marker */}
      <Marker
        position={center}
        icon={{
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
              <path d="M20 0C8.954 0 0 8.954 0 20c0 14 20 28 20 28s20-14 20-28C40 8.954 31.046 0 20 0z" fill="#0071c2"/>
              <circle cx="20" cy="18" r="10" fill="white"/>
              <text x="20" y="22" text-anchor="middle" font-size="14" font-weight="bold" fill="#0071c2">H</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 48),
          anchor: new window.google.maps.Point(20, 48),
        }}
        onClick={() => setSelectedAttraction({ name: roomTitle, lat: center.lat, lng: center.lng, isHotel: true })}
      />

      {/* Attraction Markers */}
      {attractions.map((attraction, index) => (
        <Marker
          key={index}
          position={{ lat: attraction.lat, lng: attraction.lng }}
          icon={{
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="12" fill="#003580" stroke="white" stroke-width="2"/>
                <text x="14" y="18" text-anchor="middle" font-size="11" fill="white">${index + 1}</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(28, 28),
            anchor: new window.google.maps.Point(14, 14),
          }}
          onClick={() => setSelectedAttraction(attraction)}
        />
      ))}

      {selectedAttraction && (
        <InfoWindow
          position={{ lat: selectedAttraction.lat, lng: selectedAttraction.lng }}
          onCloseClick={() => setSelectedAttraction(null)}
        >
          <div style={{ padding: '4px 8px', fontFamily: 'Inter, sans-serif' }}>
            <strong style={{ fontSize: '13px', color: '#003580' }}>{selectedAttraction.name}</strong>
            {!selectedAttraction.isHotel && (
              <p style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{selectedAttraction.distance} dari hotel</p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Build gallery images array
  const galleryImages = [
    room.image,
    ...EXTRA_GALLERY_IMAGES,
  ];

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

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const hotelLocation = MOCK_LOCATION;
  const attractions = MOCK_ATTRACTIONS;

  return (
    <>
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg pt-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-secondary mb-stack-md">
          <a className="font-body-sm text-body-sm hover:text-primary transition-colors" href="#">Home</a>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <a className="font-body-sm text-body-sm hover:text-primary transition-colors" href="#">Search</a>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="font-body-sm text-body-sm text-on-background font-medium">{room.title}</span>
        </nav>

        {/* ============ Booking.com-style Image Gallery ============ */}
        <div className="mb-stack-xl">
          {/* Main Grid: 2 columns, left = big hero, right = 2x2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5 md:h-[420px]">
            {/* Main Image (spans 2 cols, 2 rows) */}
            <div
              className="md:col-span-2 md:row-span-2 relative rounded-l-xl overflow-hidden group cursor-pointer"
              onClick={() => openLightbox(0)}
            >
              <img
                alt={room.title}
                className="w-full h-[280px] md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={galleryImages[0]}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-l-xl pointer-events-none"></div>
            </div>
            {/* Top-right image */}
            <div
              className="hidden md:block relative overflow-hidden group cursor-pointer"
              onClick={() => openLightbox(1)}
            >
              <img
                alt="Room view 2"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={galleryImages[1]}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>
            {/* Top-far-right image */}
            <div
              className="hidden md:block relative rounded-tr-xl overflow-hidden group cursor-pointer"
              onClick={() => openLightbox(2)}
            >
              <img
                alt="Room view 3"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={galleryImages[2]}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-tr-xl pointer-events-none"></div>
            </div>
            {/* Bottom-right image */}
            <div
              className="hidden md:block relative overflow-hidden group cursor-pointer"
              onClick={() => openLightbox(3)}
            >
              <img
                alt="Room view 4"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={galleryImages[3]}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>
            {/* Bottom-far-right image (with "+N photos" overlay) */}
            <div
              className="hidden md:block relative rounded-br-xl overflow-hidden group cursor-pointer"
              onClick={() => openLightbox(4)}
            >
              <img
                alt="Room view 5"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={galleryImages[4]}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white font-headline-sm text-headline-sm drop-shadow-md">+{galleryImages.length - 5} photos</span>
              </div>
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-br-xl pointer-events-none"></div>
            </div>
          </div>

          {/* Thumbnail Strip (mobile-visible for scrolling, desktop shows below) */}
          <div className="flex gap-1.5 mt-1.5 overflow-x-auto pb-2 scrollbar-hide">
            {galleryImages.slice(0, 6).map((img, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden cursor-pointer group ring-2 ring-transparent hover:ring-primary transition-all duration-200"
                onClick={() => openLightbox(index)}
              >
                <img
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  src={img}
                />
              </div>
            ))}
            {galleryImages.length > 6 && (
              <div
                className="relative flex-shrink-0 w-24 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden cursor-pointer bg-surface-container-high flex items-center justify-center hover:bg-surface-container transition-colors"
                onClick={() => openLightbox(6)}
              >
                <span className="font-label-md text-label-md text-primary">+{galleryImages.length - 6} foto</span>
              </div>
            )}
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
              <div className="flex items-center gap-1 text-secondary mb-4">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span className="font-body-md text-body-md">{room.location || hotelLocation.address}</span>
                <span className="text-primary font-label-sm text-label-sm ml-2 cursor-pointer hover:underline" onClick={() => document.getElementById('location-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  — Lokasi bagus · lihat peta
                </span>
              </div>
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

            {/* ============ Location & Map Section ============ */}
            <div id="location-section" className="border-t border-surface-variant pt-stack-lg">
              <h2 className="font-headline-sm text-headline-sm mb-stack-sm">Lokasi & Sekitar</h2>
              <div className="flex items-center gap-1 text-secondary mb-stack-md">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span className="font-body-sm text-body-sm">{hotelLocation.address}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-stack-lg">
                {/* Map */}
                <div className="lg:col-span-3 h-[320px] rounded-xl overflow-hidden shadow-sm border border-surface-variant">
                  {GOOGLE_MAPS_API_KEY ? (
                    <LocationMap
                      center={{ lat: hotelLocation.lat, lng: hotelLocation.lng }}
                      roomTitle={room.title}
                      attractions={attractions}
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-container flex flex-col items-center justify-center text-secondary p-6 text-center">
                      <span className="material-symbols-outlined text-5xl mb-3 text-primary/40">map</span>
                      <p className="font-label-md text-label-md text-on-surface mb-1">Google Maps API Key Belum Dikonfigurasi</p>
                      <p className="font-body-sm text-body-sm text-secondary max-w-xs">
                        Tambahkan <code className="bg-surface-container-high px-1.5 py-0.5 rounded text-xs">VITE_GOOGLE_MAPS_API_KEY</code> di file <code className="bg-surface-container-high px-1.5 py-0.5 rounded text-xs">.env</code> untuk menampilkan peta.
                      </p>
                    </div>
                  )}
                </div>

                {/* Nearby Attractions */}
                <div className="lg:col-span-2">
                  <h3 className="font-label-md text-label-md text-on-surface mb-stack-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">near_me</span>
                    Top Attractions
                  </h3>
                  <div className="space-y-1">
                    {attractions.map((attraction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-surface-container-low transition-colors group cursor-default"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="font-label-sm text-label-sm text-primary">{index + 1}</span>
                          </div>
                          <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">{attraction.name}</span>
                        </div>
                        <span className="font-label-sm text-label-sm text-secondary flex-shrink-0 ml-2">{attraction.distance}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-stack-sm pt-stack-sm border-t border-surface-variant">
                    <p className="font-body-sm text-body-sm text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      Jarak dihitung dari lokasi properti
                    </p>
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

      {/* ============ Lightbox Modal ============ */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-50"
            onClick={() => setLightboxOpen(false)}
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors z-50 bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length); }}
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>

          <div className="max-w-5xl max-h-[85vh] px-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryImages[lightboxIndex]}
              alt={`Gallery image ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4 text-white/70 font-label-md text-label-md">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors z-50 bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % galleryImages.length); }}
          >
            <span className="material-symbols-outlined text-2xl">chevron_right</span>
          </button>
        </div>
      )}
    </>
  );
}
