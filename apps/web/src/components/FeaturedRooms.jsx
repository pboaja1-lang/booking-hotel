import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function FeaturedRooms() {
  const { rooms } = useAdmin();
  return (
    <section className="py-stack-xl px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto bg-surface-container-low">
      <div className="text-center mb-stack-xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm">
          KAMAR UNGGULAN
        </h2>
        <p className="font-body-md text-body-md text-secondary max-w-2xl mx-auto">
          Pilihan akomodasi terbaik yang dirancang untuk memberikan kenyamanan
          maksimal selama Anda menginap.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-surface-container-lowest rounded-xl overflow-hidden card-shadow hover:card-hover-shadow transform hover:scale-[1.02] transition-all duration-300 flex flex-col group border border-outline-variant/20"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                alt={room.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src={room.mainImage}
              />
              {room.badge && (
                <div className="absolute top-4 left-4 bg-tertiary-container/20 text-on-tertiary-container border border-tertiary-container/30 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                  <span className="font-label-sm text-label-sm">
                    {room.badge}
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <span
                  className="material-symbols-outlined text-primary-container text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="font-label-sm text-label-sm text-on-surface">
                  {room.rating || 4.5}
                </span>
              </div>
            </div>
            <div className="p-stack-md flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-stack-sm">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {room.name}
                </h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex-1 mb-stack-md line-clamp-2">
                {room.description}
              </p>
              <div className="flex justify-between items-end border-t border-outline-variant/30 pt-stack-sm mt-auto">
                <div>
                  <span className="block font-label-sm text-label-sm text-secondary">
                    Mulai dari
                  </span>
                  <span className="font-headline-sm text-headline-sm text-primary">
                    Rp {room.pricePerNight?.toLocaleString('id-ID')}
                    <span className="font-body-sm text-body-sm text-secondary font-normal">
                      /malam
                    </span>
                  </span>
                </div>
                <Link 
                  to="/room" 
                  state={{ room: { ...room, title: room.name, image: room.mainImage, price: `Rp ${room.pricePerNight?.toLocaleString('id-ID')}`, priceNumeric: room.pricePerNight } }} 
                  className="bg-surface-container text-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary hover:text-on-primary transition-colors duration-200"
                >
                  Detail
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
