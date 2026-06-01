import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminKamar() {
  const { rooms, deleteRoom, addRoom, updateRoom } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    roomTypeId: 1, // 1: Deluxe, 2: Executive, 3: Standard, 4: Villa
    pricePerNight: '',
    status: 'available',
    floorInfo: '',
    mainImage: '',
    description: '',
  });

  const openAddModal = () => {
    setEditingRoomId(null);
    setFormData({ name: '', roomTypeId: 1, pricePerNight: '', status: 'available', floorInfo: '', mainImage: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setEditingRoomId(room.id);
    let typeId = 1;
    if (room.type === 'Executive Suite') typeId = 2;
    if (room.type === 'Standard Room') typeId = 3;
    if (room.type === 'Private Villa') typeId = 4;
    
    setFormData({
      name: room.name || '',
      roomTypeId: typeId,
      pricePerNight: room.pricePerNight || '',
      status: room.status || 'available',
      floorInfo: room.floorInfo || '',
      mainImage: room.mainImage || room.image || '',
      description: room.description || '',
    });
    setIsModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      roomTypeId: Number(formData.roomTypeId),
      pricePerNight: Number(formData.pricePerNight.toString().replace(/[^0-9]/g, '')),
      status: formData.status,
      floorInfo: formData.floorInfo,
      mainImage: formData.mainImage,
      description: formData.description,
      maxGuests: 2,
    };

    if (editingRoomId) {
      updateRoom(editingRoomId, payload);
    } else {
      addRoom(payload);
    }

    setIsModalOpen(false);
    setFormData({ name: '', roomTypeId: 1, pricePerNight: '', status: 'available', floorInfo: '', mainImage: '', description: '' });
    setEditingRoomId(null);
  };

  // Filter logic
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === '' || room.type === typeFilter;
    const matchesStatus = statusFilter === '' || room.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-margin-desktop py-stack-lg bg-background">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-stack-lg">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Manajemen Kamar</h1>
          <p className="font-body-md text-body-md text-secondary mt-1">Kelola daftar kamar, tipe, dan ketersediaan properti Anda.</p>
        </div>
        <button
          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:scale-105 hover:shadow-[0_8px_16px_rgba(230,126,34,0.2)] transition-all duration-200 active:scale-95"
          onClick={openAddModal}
        >
          <span className="material-symbols-outlined">add</span>
          Tambah Kamar
        </button>
      </div>

      <div className="space-y-stack-lg">
        {/* Filters & Search Bar */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_2px_4px_rgba(26,26,46,0.02),0_8px_16px_rgba(26,26,46,0.02)] border border-surface-variant/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-surface-variant bg-surface-container-low/50 focus:bg-surface-container-lowest focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-body-md text-body-md text-on-surface placeholder:text-secondary"
              placeholder="Cari nama kamar atau fasilitas..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="relative min-w-[160px]">
              <select
                className="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-surface-variant bg-surface-container-low/50 focus:bg-surface-container-lowest focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-body-md text-body-md text-on-surface cursor-pointer"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Semua Tipe</option>
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Executive Suite">Executive Suite</option>
                <option value="Standard Room">Standard Room</option>
                <option value="Private Villa">Private Villa</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">expand_more</span>
            </div>
            <div className="relative min-w-[160px]">
              <select
                className="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-surface-variant bg-surface-container-low/50 focus:bg-surface-container-lowest focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors font-body-md text-body-md text-on-surface cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="available">Tersedia</option>
                <option value="booked">Dipesan</option>
                <option value="maintenance">Perawatan</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_2px_4px_rgba(26,26,46,0.02),0_12px_24px_rgba(26,26,46,0.04)] border border-surface-variant/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-surface-variant bg-surface-container-lowest">
                  <th className="p-4 pl-6 font-label-md text-label-md text-secondary uppercase tracking-wider w-24">Thumbnail</th>
                  <th className="p-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Nama Kamar</th>
                  <th className="p-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Tipe</th>
                  <th className="p-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Harga / Malam</th>
                  <th className="p-4 font-label-md text-label-md text-secondary uppercase tracking-wider">Status</th>
                  <th className="p-4 pr-6 font-label-md text-label-md text-secondary uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md text-on-surface divide-y divide-surface-container-low">
                {filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-secondary">
                      Tidak ada data kamar yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-4 pl-6">
                        <div className="w-16 h-12 rounded bg-surface-variant overflow-hidden flex items-center justify-center text-secondary relative">
                          {room.mainImage ? (
                            <>
                              <img key={room.mainImage} alt="Kamar" className="w-full h-full object-cover z-10" src={room.mainImage} onError={(e) => { e.target.style.display = 'none'; }} />
                              <span className="material-symbols-outlined text-[24px] absolute z-0">image_not_supported</span>
                            </>
                          ) : (
                            <span className="material-symbols-outlined text-[24px]">image_not_supported</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-label-md text-label-md text-on-surface">{room.name}</div>
                        <div className="font-body-sm text-body-sm text-secondary mt-0.5">{room.floorInfo}</div>
                      </td>
                      <td className="p-4">{room.type}</td>
                      <td className="p-4 font-medium">Rp {room.pricePerNight?.toLocaleString('id-ID')}</td>
                      <td className="p-4">
                        {room.status === 'available' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                            Tersedia
                          </span>
                        )}
                        {room.status === 'booked' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container/50 text-error font-label-sm text-label-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                            Dipesan
                          </span>
                        )}
                        {room.status === 'maintenance' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-[12px]">build</span>
                            Perawatan
                          </span>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-right whitespace-nowrap">
                        <button
                          className="p-2 text-secondary hover:text-primary transition-colors rounded-lg hover:bg-surface-container-low"
                          title="Edit"
                          onClick={() => openEditModal(room)}
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                          className="p-2 text-secondary hover:text-error transition-colors rounded-lg hover:bg-error-container/20 ml-1"
                          title="Hapus"
                          onClick={() => {
                            if (window.confirm(`Yakin ingin menghapus kamar ${room.name}?`)) {
                              deleteRoom(room.id);
                            }
                          }}
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-surface-variant/50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-lowest">
            <div className="font-body-sm text-body-sm text-secondary">
              Menampilkan <span className="font-medium text-on-surface">{filteredRooms.length > 0 ? 1 : 0}</span> - <span className="font-medium text-on-surface">{filteredRooms.length}</span> dari <span className="font-medium text-on-surface">{rooms.length}</span> kamar
            </div>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded text-secondary hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded text-secondary hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Kamar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-stack-md border-b border-surface-variant flex justify-between items-center sticky top-0 bg-surface-container-lowest z-10">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                {editingRoomId ? 'Edit Kamar' : 'Tambah Kamar Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-secondary hover:text-on-surface p-2 rounded-lg hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-stack-md flex flex-col gap-stack-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Nama Kamar</label>
                  <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="px-4 py-2 bg-surface border border-surface-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-body-sm" placeholder="Cth: Ocean View Suite 101" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Tipe Kamar</label>
                  <select required value={formData.roomTypeId} onChange={e => setFormData({ ...formData, roomTypeId: Number(e.target.value) })} className="px-4 py-2 bg-surface border border-surface-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-body-sm cursor-pointer">
                    <option value={1}>Deluxe Room</option>
                    <option value={2}>Executive Suite</option>
                    <option value={3}>Standard Room</option>
                    <option value={4}>Private Villa</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Harga / Malam</label>
                  <input required value={formData.pricePerNight} onChange={e => setFormData({ ...formData, pricePerNight: e.target.value })} className="px-4 py-2 bg-surface border border-surface-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-body-sm" placeholder="Cth: 1500000" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Status</label>
                  <select required value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="px-4 py-2 bg-surface border border-surface-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-body-sm cursor-pointer">
                    <option value="available">Tersedia</option>
                    <option value="booked">Dipesan</option>
                    <option value="maintenance">Perawatan</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Info Lantai & Kapasitas</label>
                  <input required value={formData.floorInfo} onChange={e => setFormData({ ...formData, floorInfo: e.target.value })} className="px-4 py-2 bg-surface border border-surface-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-body-sm" placeholder="Cth: Lantai 2 • Maks 3 Tamu" />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">URL Gambar (Opsional)</label>
                  <input value={formData.mainImage} onChange={e => setFormData({ ...formData, mainImage: e.target.value })} className="px-4 py-2 bg-surface border border-surface-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-body-sm" placeholder="Cth: https://example.com/image.jpg" />
                  {formData.mainImage && (
                    <div className="mt-2 w-full h-40 bg-surface-variant rounded-lg overflow-hidden border border-surface-variant/50 flex items-center justify-center relative">
                      <img
                        key={formData.mainImage}
                        src={formData.mainImage}
                        alt="Preview Kamar"
                        className="w-full h-full object-cover z-10"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div className="absolute z-0 flex flex-col items-center text-secondary">
                        <span className="material-symbols-outlined text-[32px] mb-1">broken_image</span>
                        <span className="font-label-sm text-label-sm">Gambar tidak dapat dimuat</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Deskripsi Kamar</label>
                  <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="px-4 py-2 bg-surface border border-surface-variant rounded-lg outline-none focus:ring-1 focus:ring-primary font-body-sm min-h-[100px]" placeholder="Deskripsi lengkap fasilitas kamar..."></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-stack-sm pt-stack-sm border-t border-surface-variant">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg text-secondary hover:bg-surface-container font-label-md transition-colors">Batal</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-primary-container text-on-primary-container hover:shadow-sm transition-all font-label-md">Simpan Kamar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
