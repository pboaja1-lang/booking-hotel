import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

const availableTypes = ["Standard Room", "Deluxe Room", "Executive Suite", "Private Villa"];
const availableAmenities = ["WiFi Gratis", "AC", "Kolam Renang", "Sarapan"];

export default function SearchResults() {
    const routeLocation = useLocation();
    const { rooms: adminRooms } = useAdmin();

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
                image: r.mainImage || '',
                location: r.floorInfo || '',
                type: r.type,
                amenities: ['WiFi Gratis', 'AC'],
                badge: r.badge || null,
                recommendationScore: (r.rating || 4.5) * 10,
                status: r.status,
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
    const itemsPerPage = 2;

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
        setMaxPrice(2000000);
        setSelectedAmenities([]);
        setCurrentPage(1);
    };

    // Derived Data
    const filteredRooms = useMemo(() => {
        return allRooms.filter(room => {
            if (selectedTypes.length > 0 && !selectedTypes.includes(room.type)) return false;
            if (room.priceNumeric > maxPrice) return false;
            if (selectedAmenities.length > 0) {
                const hasAllAmenities = selectedAmenities.every(a => room.amenities.includes(a));
                if (!hasAllAmenities) return false;
            }
            return true;
        });
    }, [allRooms, selectedTypes, maxPrice, selectedAmenities]);

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

    return (
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-xl mt-20 min-h-screen">
            {/* Search Summary / Edit Bar */}
            <div className="glass-card rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.05)] border border-surface-variant p-stack-md mb-stack-xl">
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
                                <button 
                                    type="button" 
                                    onClick={(e) => { e.preventDefault(); alert("Membuka Google Maps..."); }}
                                    className="flex items-center justify-center text-primary hover:text-primary-container transition-colors"
                                    title="Buka Peta"
                                >
                                    <span className="material-symbols-outlined text-[20px]">map</span>
                                </button>
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
                <aside className="w-full lg:w-1/4 flex-shrink-0 space-y-stack-lg">
                    <div className="glass-card rounded-xl p-stack-lg border border-surface-variant">
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
                                            className="rounded border-outline text-primary focus:ring-primary focus:ring-opacity-50" 
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
                                    <span>2JT+</span>
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
                                            className="rounded border-outline text-primary focus:ring-primary focus:ring-opacity-50" 
                                        />
                                        <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-stack-lg gap-stack-sm">
                        <h2 className="font-headline-sm text-headline-sm text-on-surface">Menampilkan {sortedRooms.length} kamar</h2>
                        <div className="flex items-center gap-2">
                            <span className="font-body-sm text-body-sm text-secondary">Urutkan:</span>
                            <select 
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="bg-surface-container-lowest border border-outline-variant text-on-surface text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 font-body-sm"
                            >
                                <option>Rekomendasi</option>
                                <option>Harga: Rendah ke Tinggi</option>
                                <option>Harga: Tinggi ke Rendah</option>
                                <option>Rating Tertinggi</option>
                            </select>
                        </div>
                    </div>

                    {/* Results List */}
                    <div className="space-y-stack-lg">
                        {paginatedRooms.length > 0 ? paginatedRooms.map((room) => (
                            <div key={room.id} className="glass-card rounded-xl border border-surface-variant overflow-hidden hover:scale-[1.02] transition-all duration-200 shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.05)] hover:shadow-[0_4px_8px_rgba(26,26,46,0.1),0_16px_24px_rgba(26,26,46,0.1)] group flex flex-col md:flex-row">
                                <div className="md:w-1/3 relative h-48 md:h-auto bg-surface-container">
                                    <img src={room.image} alt={room.title} className="w-full h-full object-cover border-r border-outline-variant/20" />
                                    {room.badge && (
                                        <div className="absolute top-2 left-2 bg-secondary-container/90 text-on-secondary-fixed-variant px-2 py-1 rounded font-label-sm text-label-sm backdrop-blur-sm">
                                            {room.badge}
                                        </div>
                                    )}
                                </div>
                                <div className="p-stack-lg flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">{room.title}</h3>
                                            <div className="flex items-center bg-surface-container-low px-2 py-1 rounded-lg">
                                                <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="font-label-sm text-label-sm ml-1">{room.rating}</span>
                                            </div>
                                        </div>
                                        <p className="font-body-sm text-body-sm text-secondary mb-stack-md flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">location_on</span> {room.location}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-stack-lg">
                                            {room.amenities.map(amenity => {
                                                // Quick map for material icons based on string
                                                let icon = "check";
                                                if(amenity.includes("WiFi")) icon = "wifi";
                                                if(amenity.includes("AC")) icon = "ac_unit";
                                                if(amenity.includes("TV")) icon = "tv";
                                                if(amenity.includes("Kolam")) icon = "pool";
                                                if(amenity.includes("Sarapan")) icon = "restaurant";
                                                if(amenity.includes("Bathtub")) icon = "bathtub";

                                                return (
                                                    <span key={amenity} className="inline-flex items-center gap-1 bg-surface-container px-2 py-1 rounded-md font-body-sm text-body-sm text-secondary">
                                                        <span className="material-symbols-outlined text-sm">{icon}</span> {amenity}
                                                    </span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-outline-variant/30 pt-stack-md">
                                        <div>
                                            {room.originalPrice && <p className="font-body-sm text-body-sm text-secondary line-through">{room.originalPrice}</p>}
                                            <p className="font-headline-sm text-headline-sm text-primary">{room.price}<span className="font-body-sm text-body-sm text-secondary font-normal">/malam</span></p>
                                        </div>
                                        <Link 
                                            to="/room" 
                                            state={{ room }}
                                            className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-lg hover:bg-surface-tint transition-colors shadow-[0_2px_4px_rgba(26,26,46,0.05),0_12px_20px_rgba(26,26,46,0.05)] active:scale-95 text-center"
                                        >
                                            Lihat Detail
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-stack-xl">
                                <p className="font-body-lg text-body-lg text-secondary">Tidak ada kamar yang sesuai dengan kriteria filter.</p>
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
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-secondary hover:bg-surface-container transition-colors disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant font-label-md text-label-md transition-colors ${currentPage === i + 1 ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-container'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-secondary hover:bg-surface-container transition-colors disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};
