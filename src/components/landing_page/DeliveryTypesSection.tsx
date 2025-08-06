import { Card } from "flowbite-react";
import Image from "next/image";

export default function DeliveryTypesSection() {
  const deliveryTypes = [
    {
      title: "Entrega inmediata",
      subtitle: "15-30 min",
      description: "Para pedidos urgentes que necesitan llegar lo más rápido posible",
      icon: "⏰",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Entrega programada", 
      subtitle: "Hasta 7 días",
      description: "Programa entregas con anticipación para mayor comodidad",
      icon: "📅",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Elige el tipo de entrega On-Demand que necesite tu negocio
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {deliveryTypes.map((type, index) => (
            <Card key={index} className={`${type.bgColor} ${type.borderColor} border-2 hover:shadow-xl transition-all duration-300 group`}>
              <div className="text-center p-6">
                <div className="text-6xl mb-4">{type.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {type.title}
                </h3>
                <p className="text-lg font-semibold text-gray-700 mb-4">
                  {type.subtitle}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {type.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
