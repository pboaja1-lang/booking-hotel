import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';

const availableTypes = ["Standard Room", "Deluxe Room", "Executive Suite", "Private Villa"];
const availableAmenities = ["WiFi Gratis", "AC", "Kolam Renang", "Sarapan"];

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

// Default center to Jakarta if no rooms have valid coordinates
const DEFAULT_CENTER = { lat: -6.200000, lng: 106.816666 };

export default function SearchResults() {
    const routeLocation = useLocation();
    const { rooms: adminRooms } = useAdmin();

    // View Mode State: 'list' or 'map'
    const [viewMode, setViewMode] = useState('list');
    
    // Map States
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    // Transform admin rooms to search format
    const allRooms = useMemo(() => {
        return adminRooms
          .filter(r => r.status === 'available') // only show available rooms
          .map(r => {
            return {
                id: r.id,
                title: r.name,
                description: r.description || '',
                priceNumeric: r.pricePerNight || 0,
                price: `Rp ${r.pricePerNight?.toLocaleString('id-ID')}`,
                originalPrice: null,
                rating: r.rating ? r.rating.toString() : '4.5',
                image: r.mainImage || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&auto=format&fit=crop',
                location: r.location || r.floorInfo || 'Jakarta Pusat',
                type: r.type || 'Standard Room',
                amenities: ['WiFi Gratis', 'AC'],
                badge: r.badge || null,
                recommendationScore: (r.rating || 4.5) * 10,
                status: r.status,
                // Add coordinates from DB, fallback to null if not present
                lat: r.latitude ? Number(r.latitude) : null,
                lng: r.longitude ? Number(r.longitude) : null,
            };
        });
    }, [adminRooms]);
    
    // Search Params State
    const [searchLocation, setSearchLocation] = useState(routeLocation.state?.location || "");
    const [searchCheckIn, setSearchCheckIn] = useState(routeLocation.state?.checkIn || "");
    const [searchCheckOut, setSearchCheckOut] = useState(routeLocation.state?.checkOut || "");
    const [searchGuests, setSearchGuests] = useState(routeLocation.state?.guests || "2 Tamu, 1 Kamar");
    const [isEditingSearch, setIsEditingSearch] = useState(false);

    // Filter & Sort State
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [maxPrice, setMaxPrice] = useState(5000000);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [sortOption, setSortOption] = useState("Rekomendasi");
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const handleTypeChange = (type) => {
        setSelectedTypes(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
        setCurrentPage(1);
    };

    const handleAmenityChange = (amenity) => {
        setSelectedAmenities(prev => 
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        );
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setSelectedTypes([]);
        setMaxPrice(5000000);
        setSelectedAmenities([]);
        setCurrentPage(1);
    };

    // Derived Data
    const filteredRooms = useMemo(() => {
        return allRooms.filter(room => {
            if (searchLocation && searchLocation.toLowerCase() !== "semua lokasi") {
                const searchLower = searchLocation.toLowerCase();
                const roomLocationLower = room.location.toLowerCase();
                const roomTitleLower = room.title.toLowerCase();
                if (!roomLocationLower.includes(searchLower) && !roomTitleLower.includes(searchLower)) {
                    return false;
                }
            }
            if (selectedTypes.length > 0 && !selectedTypes.includes(room.type)) return false;
            if (room.priceNumeric > maxPrice) return false;
            if (selectedAmenities.length > 0) {
                const hasAllAmenities = selectedAmenities.every(a => room.amenities.includes(a));
                if (!hasAllAmenities) return false;
            }
            return true;
        });
    }, [allRooms, selectedTypes, maxPrice, selectedAmenities, searchLocation]);

    const sortedRooms = useMemo(() => {
        let sorted = [...filteredRooms];
        switch (sortOption) {
            case "Harga: Rendah ke Tinggi":
                sorted.sort((a, b) => a.priceNumeric - b.priceNumeric);
                break;
            case "Harga: Tinggi ke Rendah":
                sorted.sort((a, b) => b.priceNumeric - a.priceNumeric);
                break;
            case "Rating Tertinggi":
                sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
                break;
            case "Rekomendasi":
            default:
                sorted.sort((a, b) => b.recommendationScore - a.recommendationScore);
                break;
        }
        return sorted;
    }, [filteredRooms, sortOption]);

    const totalPages = Math.ceil(sortedRooms.length / itemsPerPage) || 1;
    const paginatedRooms = sortedRooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Fix for out-of-bounds page after filtering
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    // Map onLoad handler to fit bounds
    const onMapLoad = useCallback((map) => {
        const roomsWithCoords = sortedRooms.filter(r => r.lat && r.lng);
        if (roomsWithCoords.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            roomsWithCoords.forEach(r => bounds.extend({ lat: r.lat, lng: r.lng }));
            map.fitBounds(bounds);
            
            // Prevent zooming in too close if there's only 1 marker
            const listener = window.google.maps.event.addListener(map, 'idle', () => {
                if (map.getZoom() > 15) map.setZoom(15);
                window.google.maps.event.removeListener(listener);
            });
        }
    }, [sortedRooms]);

    return (
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl mt-20 min-h-screen">
            {/* Search Summary / Edit Bar */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.05)] border border-surface-variant p-stack-md mb-stack-xl relative z-10">
                {!isEditingSearch ? (
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md">
                        <div className="flex flex-wrap items-center gap-stack-md md:gap-stack-lg">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                                <div>
                                    <p className="font-label-sm text-label-sm text-secondary">Lokasi</p>
                                    <p className="font-body-md text-body-md font-semibold text-on-surface">{searchLocation || "Semua Lokasi"}</p>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-outline-variant/50 hidden md:block"></div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
                                <div>
                                    <p className="font-label-sm text-label-sm text-secondary">Tanggal</p>
                                    <p className="font-body-md text-body-md font-semibold text-on-surface">{searchCheckIn} - {searchCheckOut}</p>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-outline-variant/50 hidden md:block"></div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                                <div>
                                    <p className="font-label-sm text-label-sm text-secondary">Tamu & Kamar</p>
                                    <p className="font-body-md text-body-md font-semibold text-on-surface">{searchGuests}</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsEditingSearch(true)} className="bg-surface-container-low text-primary border border-outline-variant font-label-md text-label-md px-6 py-2 rounded-lg hover:bg-surface-container transition-colors w-full md:w-auto">
                            Edit
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row items-end gap-3">
                        <div className="flex-1 w-full">
                            <label className="block font-label-sm text-label-sm text-secondary mb-1">Lokasi</label>
                            <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-outline-variant">
                                <span className="material-symbols-outlined text-secondary text-[20px]">location_on</span>
                                <input 
                                    type="text" 
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    className="w-full bg-transparent border-0 p-0 font-body-md text-body-md focus:ring-0 text-on-surface"
                                />
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block font-label-sm text-label-sm text-secondary mb-1">Tanggal</label>
                            <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-outline-variant">
                                <input type="date" value={searchCheckIn} onChange={(e) => setSearchCheckIn(e.target.value)} className="w-full bg-transparent border-0 p-0 font-body-sm text-body-sm focus:ring-0 text-on-surface" />
                                <span className="text-secondary">-</span>
                                <input type="date" value={searchCheckOut} onChange={(e) => setSearchCheckOut(e.target.value)} className="w-full bg-transparent border-0 p-0 font-body-sm text-body-sm focus:ring-0 text-on-surface" />
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <label className="block font-label-sm text-label-sm text-secondary mb-1">Tamu & Kamar</label>
                            <div className="flex items-center gap-2 bg-surface rounded-lg px-3 py-2 border border-outline-variant">
                                <select value={searchGuests} onChange={(e) => setSearchGuests(e.target.value)} className="w-full bg-transparent border-0 pl-0 pr-8 py-0 font-body-md text-body-md focus:ring-0 text-on-surface">
                                    <option>1 Tamu, 1 Kamar</option>
                                    <option>2 Tamu, 1 Kamar</option>
                                    <option>3 Tamu, 1 Kamar</option>
                                    <option>4 Tamu, 2 Kamar</option>
                                </select>
                            </div>
                        </div>
                        <div className="w-full md:w-auto">
                            <button onClick={() => setIsEditingSearch(false)} className="w-full bg-primary text-on-primary px-6 py-2 h-[42px] rounded-lg hover:bg-surface-tint transition-colors font-label-md text-label-md">
                                Cari
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-gutter">
                {/* Sidebar Filter */}
                <aside className={`w-full lg:w-1/4 flex-shrink-0 space-y-stack-lg ${viewMode === 'map' ? 'hidden lg:block' : ''}`}>
                    <div className="bg-surface-container-lowest rounded-xl p-stack-lg border border-surface-variant">
                        <div className="flex justify-between items-center mb-stack-md">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface">Filter</h3>
                            <button onClick={handleResetFilters} className="font-label-sm text-label-sm text-primary hover:underline">Reset</button>
                        </div>
                        <hr className="border-outline-variant/30 my-stack-md" />

                        {/* Tipe Kamar */}
                        <div className="mb-stack-lg">
                            <h4 className="font-label-md text-label-md text-on-surface mb-stack-sm">Tipe Kamar</h4>
                            <div className="space-y-stack-sm">
                                {availableTypes.map(type => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedTypes.includes(type)}
                                            onChange={() => handleTypeChange(type)}
                                            className="rounded border-outline-variant text-primary focus:ring-primary focus:ring-opacity-50" 
                                        />
                                        <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="mb-stack-lg">
                            <h4 className="font-label-md text-label-md text-on-surface mb-stack-sm">Harga Maks: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(maxPrice)}</h4>
                            <div className="px-2">
                                <input 
                                    type="range" 
                                    min="200000" 
                                    max="5000000" 
                                    step="50000"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                                    className="w-full accent-primary h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer" 
                                />
                                <div className="flex justify-between mt-2 font-body-sm text-body-sm text-secondary">
                                    <span>200K</span>
                                    <span>5JT</span>
                                </div>
                            </div>
                        </div>

                        {/* Fasilitas */}
                        <div>
                            <h4 className="font-label-md text-label-md text-on-surface mb-stack-sm">Fasilitas</h4>
                            <div className="space-y-stack-sm">
                                {availableAmenities.map(amenity => (
                                    <label key={amenity} className="flex items-center gap-2 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedAmenities.includes(amenity)}
                                            onChange={() => handleAmenityChange(amenity)}
                                            className="rounded border-outline-variant text-primary focus:ring-primary focus:ring-opacity-50" 
                                        />
                                        <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content (List or Map) */}
                <div className={`flex-1 ${viewMode === 'map' ? 'flex flex-col h-[calc(100vh-250px)] min-h-[600px]' : ''}`}>
                    <div className="flex justify-between items-center mb-stack-lg">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">Menampilkan {sortedRooms.length} kamar</h2>
                        
                        <div className="flex items-center gap-4">
                            {/* Toggle List/Map */}
                            <div className="flex bg-surface-container-low rounded-lg p-1 border border-surface-variant">
                                <button 
                                    onClick={() => setViewMode('list')}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-label-sm transition-all duration-200 ${viewMode === 'list' ? 'bg-white shadow-sm text-primary font-bold' : 'text-secondary hover:text-on-surface'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">list</span>
                                    List
                                </button>
                                <button 
                                    onClick={() => setViewMode('map')}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-label-sm transition-all duration-200 ${viewMode === 'map' ? 'bg-white shadow-sm text-primary font-bold' : 'text-secondary hover:text-on-surface'}`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">map</span>
                                    Peta
                                </button>
                            </div>

                            {viewMode === 'list' && (
                                <div className="hidden sm:flex items-center gap-2">
                                    <span className="font-body-sm text-body-sm text-secondary">Urutkan:</span>
                                    <select 
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                        className="bg-surface-container-lowest border border-outline-variant text-on-surface text-sm rounded-lg focus:ring-primary focus:border-primary block p-1.5 font-body-sm"
                                    >
                                        <option>Rekomendasi</option>
                                        <option>Harga: Rendah ke Tinggi</option>
                                        <option>Harga: Tinggi ke Rendah</option>
                                        <option>Rating Tertinggi</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* VIEW: MAP */}
                    {viewMode === 'map' ? (
                        <div className="flex-1 rounded-xl overflow-hidden shadow-sm border border-surface-variant relative">
                            {GOOGLE_MAPS_API_KEY ? (
                                isLoaded ? (
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        center={mapCenter}
                                        zoom={12}
                                        onLoad={onMapLoad}
                                        options={mapOptions}
                                        onClick={() => setSelectedRoom(null)} // Close card when clicking on empty map space
                                    >
                                        {/* Markers for all rooms with lat/lng */}
                                        {sortedRooms.filter(r => r.lat && r.lng).map((room) => (
                                            <OverlayView
                                                key={room.id}
                                                position={{ lat: room.lat, lng: room.lng }}
                                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                            >
                                                <div 
                                                    className={`absolute -translate-x-1/2 -translate-y-full mb-2 cursor-pointer transition-all duration-200 z-10 
                                                        ${selectedRoom?.id === room.id ? 'scale-110 z-20' : 'hover:scale-105'}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedRoom(room);
                                                    }}
                                                >
                                                    {/* Price Tag Bubble */}
                                                    <div className={`px-3 py-1.5 rounded-lg shadow-md font-label-sm text-label-sm font-bold border-2 relative
                                                        ${selectedRoom?.id === room.id 
                                                            ? 'bg-[#003580] text-white border-white' 
                                                            : 'bg-white text-[#003580] border-[#003580]'}`}
                                                    >
                                                        Rp {(room.priceNumeric / 1000000).toFixed(1).replace('.0', '')}jt
                                                        {/* Triangle pointing down */}
                                                        <div className={`absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent
                                                            ${selectedRoom?.id === room.id ? 'border-t-[#003580]' : 'border-t-[#003580]'}`}
                                                        ></div>
                                                        <div className={`absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent
                                                            ${selectedRoom?.id === room.id ? 'border-t-[#003580]' : 'border-t-white'}`}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </OverlayView>
                                        ))}
                                    </GoogleMap>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-surface-container animate-pulse">
                                        <span className="material-symbols-outlined text-4xl text-secondary">map</span>
                                    </div>
                                )
                            ) : (
                                <div className="w-full h-full bg-surface-container flex flex-col items-center justify-center text-secondary p-6 text-center">
                                    <span className="material-symbols-outlined text-5xl mb-3 text-primary/40">map_off</span>
                                    <p className="font-label-md text-label-md text-on-surface mb-1">Google Maps API Key Belum Dikonfigurasi</p>
                                    <p className="font-body-sm text-body-sm text-secondary max-w-sm">
                                        Peta tidak dapat ditampilkan. Tambahkan key Anda di file `.env` dan restart server.
                                    </p>
                                </div>
                            )}

                            {/* Floating Selected Room Card */}
                            {selectedRoom && (
                                <div className="absolute top-4 left-4 w-72 md:w-80 bg-white rounded-xl shadow-xl border border-surface-variant overflow-hidden z-30 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <button 
                                        className="absolute top-2 right-2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors z-10"
                                        onClick={() => setSelectedRoom(null)}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>
                                    <div className="h-40 w-full relative">
                                        <img src={selectedRoom.image} alt={selectedRoom.title} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                                            <span className="material-symbols-outlined text-[#febb02] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="font-label-sm text-label-sm font-bold text-on-surface">{selectedRoom.rating}</span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1 truncate">{selectedRoom.title}</h3>
                                        <p className="font-body-sm text-body-sm text-secondary flex items-center gap-1 mb-3 truncate">
                                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                                            {selectedRoom.location}
                                        </p>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <span className="block font-body-sm text-body-sm text-secondary text-xs">Mulai dari</span>
                                                <span className="font-label-md text-label-md text-[#003580] font-bold">{selectedRoom.price}</span>
                                            </div>
                                            <Link 
                                                to="/room" 
                                                state={{ room: selectedRoom }}
                                                className="bg-[#0071c2] hover:bg-[#00487a] text-white px-4 py-1.5 rounded font-label-sm text-label-sm transition-colors"
                                            >
                                                Lihat
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* VIEW: LIST */
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
                                {paginatedRooms.length > 0 ? paginatedRooms.map((room) => (
                                    <div 
                                        key={room.id} 
                                        className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.03)] hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex flex-col group border border-outline-variant/20"
                                    >
                                        <div className="relative h-64 overflow-hidden">
                                            <img 
                                                src={room.image} 
                                                alt={room.title} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                            />
                                            {room.badge && (
                                                <div className="absolute top-4 left-4 bg-tertiary-container/90 text-on-tertiary-container px-3 py-1 rounded shadow-sm backdrop-blur-sm">
                                                    <span className="font-label-sm text-label-sm font-bold">
                                                        {room.badge}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 shadow-sm">
                                                <span 
                                                    className="material-symbols-outlined text-[#febb02] text-[16px]" 
                                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                                >
                                                    star
                                                </span>
                                                <span className="font-label-sm text-label-sm font-bold text-on-surface">
                                                    {room.rating}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-stack-md flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-stack-sm">
                                                <h3 className="font-headline-sm text-headline-sm text-[#0071c2] group-hover:underline">
                                                    {room.title}
                                                </h3>
                                            </div>
                                            <p className="font-body-sm text-body-sm text-secondary flex items-center gap-1 mb-stack-xs">
                                                <span className="material-symbols-outlined text-sm">location_on</span> {room.location}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 mb-stack-md">
                                                {room.amenities.map(amenity => {
                                                    let icon = "check";
                                                    if(amenity.includes("WiFi")) icon = "wifi";
                                                    if(amenity.includes("AC")) icon = "ac_unit";
                                                    if(amenity.includes("TV")) icon = "tv";
                                                    if(amenity.includes("Kolam")) icon = "pool";
                                                    if(amenity.includes("Sarapan")) icon = "restaurant";
                                                    if(amenity.includes("Bathtub")) icon = "bathtub";
                                                    return (
                                                        <span key={amenity} className="inline-flex items-center gap-1 border border-outline-variant/50 px-2 py-0.5 rounded text-xs text-secondary">
                                                            <span className="material-symbols-outlined text-[14px]">{icon}</span> {amenity}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex justify-between items-end border-t border-outline-variant/30 pt-stack-sm mt-auto">
                                                <div>
                                                    <span className="block font-label-sm text-label-sm text-secondary text-xs">
                                                        Mulai dari
                                                    </span>
                                                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                                        {room.price}
                                                        <span className="font-body-sm text-body-sm text-secondary font-normal text-xs">
                                                            /malam
                                                        </span>
                                                    </span>
                                                </div>
                                                <Link 
                                                    to="/room" 
                                                    state={{ room }}
                                                    className="bg-[#0071c2] text-white font-label-md text-label-md px-4 py-2 rounded hover:bg-[#00487a] transition-colors duration-200"
                                                >
                                                    Lihat
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full text-center py-stack-xl bg-surface-container-lowest rounded-xl border border-surface-variant">
                                        <span className="material-symbols-outlined text-6xl text-secondary mb-4">search_off</span>
                                        <p className="font-body-lg text-body-lg text-on-surface font-bold">Tidak ada kamar ditemukan</p>
                                        <p className="font-body-md text-body-md text-secondary mt-2">Coba ubah filter atau lokasi pencarian Anda.</p>
                                        <button onClick={handleResetFilters} className="mt-4 text-[#0071c2] font-label-md hover:underline">Reset Filter</button>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-stack-xl flex justify-center">
                                    <nav className="flex items-center gap-2">
                                        <button 
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-secondary hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined">chevron_left</span>
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-10 h-10 flex items-center justify-center rounded border font-label-md text-label-md transition-colors ${currentPage === i + 1 ? 'bg-[#0071c2] border-[#0071c2] text-white' : 'border-outline-variant text-on-surface hover:bg-surface-container'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        <button 
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant text-secondary hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined">chevron_right</span>
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};
