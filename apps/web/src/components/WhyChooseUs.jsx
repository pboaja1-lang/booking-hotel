export default function WhyChooseUs() {
  const features = [
    {
      icon: "verified",
      title: "Harga Terbaik",
      description:
        "Kami menjamin harga terbaik untuk setiap pemesanan. Dapatkan penawaran eksklusif hanya melalui website resmi kami.",
    },
    {
      icon: "support_agent",
      title: "Layanan 24/7",
      description:
        "Tim dukungan kami siap membantu Anda kapan saja, memastikan pengalaman menginap Anda berjalan lancar tanpa hambatan.",
    },
    {
      icon: "credit_card",
      title: "Pembayaran Aman",
      description:
        "Sistem pembayaran kami dienkripsi penuh untuk menjamin keamanan transaksi Anda dengan berbagai metode yang mudah.",
    },
  ];

  return (
    <section className="py-stack-xl px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="text-center mb-stack-xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-sm">
          MENGAPA MEMILIH KAMI
        </h2>
        <div className="w-16 h-1 bg-primary-container mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-surface-container-lowest p-stack-lg rounded-xl text-center card-shadow hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-stack-md">
              <span className="material-symbols-outlined text-primary text-3xl">
                {feature.icon}
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-stack-sm">
              {feature.title}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
