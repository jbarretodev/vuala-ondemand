import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-neutral-50 text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-blue-400">Vualá</span>
              <span className="text-md ml-2 text-black">Delivery</span>
            </div>
            <p className="text-gray-900 text-sm leading-relaxed">
              La plataforma líder en entregas on-demand para tu negocio.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-black">Servicios</h3>
            <ul className="space-y-2 text-gray-900">
              <li><a href="#" className="hover:text-white transition-colors">Entrega inmediata</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Entrega programada</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Integration</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-black">Soporte</h3>
            <ul className="space-y-2 text-gray-900">
              <li><a href="#" className="hover:text-white transition-colors">Centro de ayuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Estado del servicio</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-black">Contacto</h3>
            <div className="space-y-2 text-gray-900">
              <p>📧 partners@vualadelivery.com</p>
              <p>📞 +34 950 79 70 24</p>
              <p>📍 Almería, España</p>
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 VualáPlataforma. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Términos de servicio
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Política de privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
