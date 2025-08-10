import Image from "next/image";

export default function WhatIsOnDemandSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué Vualá?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              El mejor servicio del mercado
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Nuestra plataforma te permite gestionar todos tus pedidos desde un solo lugar, 
              con herramientas avanzadas de seguimiento y análisis que te ayudarán a optimizar 
              tu negocio y brindar la mejor experiencia a tus clientes.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Dashboard completo para gestión de pedidos
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Seguimiento en tiempo real
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Reportes y análisis detallados
              </li>
            </ul>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-8 transform rotate-6">
              <div className="bg-white rounded-lg shadow-xl p-4 transform -rotate-6">
                <Image
                  src="/api/placeholder/500/350"
                  alt="Dashboard de gestión de pedidos"
                  width={500}
                  height={350}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

                    <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              El mejor servicio del mercado
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Nuestra plataforma te permite gestionar todos tus pedidos desde un solo lugar, 
              con herramientas avanzadas de seguimiento y análisis que te ayudarán a optimizar 
              tu negocio y brindar la mejor experiencia a tus clientes.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Dashboard completo para gestión de pedidos
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Seguimiento en tiempo real
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Reportes y análisis detallados
              </li>
            </ul>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-8 transform rotate-6">
              <div className="bg-white rounded-lg shadow-xl p-4 transform -rotate-6">
                <Image
                  src="/api/placeholder/500/350"
                  alt="Dashboard de gestión de pedidos"
                  width={500}
                  height={350}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
