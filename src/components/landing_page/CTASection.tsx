import { Button } from "flowbite-react";

export default function CTASection() {
  return (
    <div className="bg-blue-500 min-h-[350px] flex flex-col items-center justify-center text-white px-4">
  <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
    ¿Aún no eres Partner de Vualá?
  </h1>
  
  <p className="text-lg md:text-xl text-center mb-8 max-w-3xl">
    Únete a cientos de restaurantes y negocios que ya confían en nosotros para sus entregas
  </p>
  
  <button className="bg-yellow-200 text-black font-bold py-4 px-8 rounded-full hover:bg-yellow-300 transition">
    Convertirse en Partner
  </button>
</div>
  );
}
