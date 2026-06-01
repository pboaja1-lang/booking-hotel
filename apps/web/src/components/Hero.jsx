export default function Hero() {
  return (
    <section className="relative min-h-[870px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          alt="Hero Background"
          className="w-full h-full object-cover object-center"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpr_7jsB4Cmij0-hZ0-TG1mIID9iLXlMx6rnrI6J-4N8xkVlDplkcsgQiyN_Su8d_HXvnRCXSB_bA0wB0SLEjarNP0X0R_sATcaGleOPurQEzJ1GVDwQCHBrSth19VE7DV-1T3VDUmixfSUJGsyDlwn3PdLe19RYuq-MINDQFotfFy-2YTPE_Mw-Y6B2D9LiUsMlGccHYEmIyprE3PGxuritVMNk_9lgufg2cyjqqtjv-XZzqLYbXMHd6iYeV0PLuYDdJnb7lP52Fu"
        />
        <div className="absolute inset-0 hero-gradient opacity-80 mix-blend-multiply"></div>
      </div>
      <div className="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mt-stack-xl">
        <h1 className="font-headline-xl text-headline-xl text-white mb-stack-md drop-shadow-lg">
          Temukan Hotel Impian Anda
        </h1>
        <p className="font-body-lg text-body-lg text-white/90 mb-stack-xl max-w-2xl mx-auto drop-shadow-md">
          Pengalaman menginap mewah dengan layanan yang dirancang khusus untuk
          kenyamanan Anda. Pesan sekarang dan nikmati penawaran eksklusif.
        </p>
        
        {/* Integrated Search Bar */}
        <div className="glass-panel rounded-xl p-stack-sm md:p-stack-md shadow-2xl max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
          <form className="flex flex-col md:flex-row gap-stack-sm items-end">
            <div className="flex-1 w-full text-left">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit ml-2">
                Lokasi
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                  location_on
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-on-surface font-body-md"
                  placeholder="Mau ke mana?"
                  type="text"
                />
              </div>
            </div>
            <div className="flex-1 w-full text-left">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit ml-2">
                Check-in
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                  calendar_today
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-on-surface font-body-md"
                  type="date"
                />
              </div>
            </div>
            <div className="flex-1 w-full text-left">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit ml-2">
                Check-out
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                  calendar_month
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-on-surface font-body-md"
                  type="date"
                />
              </div>
            </div>
            <div className="flex-1 w-full text-left">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-unit ml-2">
                Tamu & Kamar
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                  person
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-on-surface font-body-md cursor-pointer"
                  readOnly
                  type="text"
                  value="2 Tamu, 1 Kamar"
                />
              </div>
            </div>
            <div className="w-full md:w-auto mt-stack-sm md:mt-0">
              <button
                className="w-full md:w-auto bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary font-label-md text-label-md px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 h-[46px]"
                type="submit"
              >
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
                CARI HOTEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
