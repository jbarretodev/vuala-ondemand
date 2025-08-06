import Image from "next/image";

export default function PartnersSection() {
  const partners = [
    { name: "LastApp", logo: "/api/placeholder/120/60" },
    { name: "Deliverect", logo: "/api/placeholder/120/60" },
    { name: "KQVZY", logo: "/api/placeholder/120/60" }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8">
            Algunos de nuestros socios tecnológicos...
          </h2>
          
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {partners.map((partner, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 min-w-[150px]"
              >
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={120}
                  height={60}
                  className="mx-auto filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
