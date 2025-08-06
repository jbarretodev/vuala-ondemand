import { Card } from "flowbite-react";
import Image from "next/image";

export default function FeaturesSection() {
  const features = [
    {
      title: "Precios competitivos",
      description: "Tarifas justas y transparentes que se adaptan a tu negocio, sin costos ocultos ni sorpresas.",
      image: "/api/placeholder/300/200",
      bgColor: "bg-teal-100",
      borderColor: "border-teal-500"
    },
    {
      title: "Integración óptima",
      description: "Conecta fácilmente tu sistema actual con nuestra API robusta y documentación completa.",
      image: "/api/placeholder/300/200", 
      bgColor: "bg-blue-100",
      borderColor: "border-blue-500"
    },
    {
      title: "Soporte 24/7",
      description: "Nuestro equipo está disponible las 24 horas para ayudarte cuando más lo necesites.",
      image: "/api/placeholder/300/200",
      bgColor: "bg-purple-100", 
      borderColor: "border-purple-500"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                <div className={`${feature.bgColor} rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center border-4 ${feature.borderColor}`}>
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
