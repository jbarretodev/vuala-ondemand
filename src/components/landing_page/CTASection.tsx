import { Button } from "flowbite-react";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-16 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          ¿Aún no eres Partner de Glovo?
        </h2>
        <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto">
          Únete a miles de restaurantes y negocios que ya confían en nosotros para sus entregas
        </p>
        <Button 
          size="xl" 
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-10 py-4 rounded-lg text-lg"
        >
          Convertirse en Partner
        </Button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 rounded-full opacity-50 -translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-yellow-300 rounded-full opacity-50 translate-x-12 translate-y-12"></div>
    </section>
  );
}
