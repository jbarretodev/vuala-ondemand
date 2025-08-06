"use client";
import { useState } from "react";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        className="w-full px-6 py-4 text-left text-lg font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-700 leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  const faqs = [
    {
      question: "¿Cuánto tiempo tarda la integración con Glovo On-Demand?",
      answer: "La integración típicamente toma entre 1-2 semanas dependiendo de la complejidad de tu sistema actual. Nuestro equipo técnico te acompañará durante todo el proceso."
    },
    {
      question: "¿Cuáles son los costos del servicio?",
      answer: "Ofrecemos planes flexibles adaptados a tu volumen de pedidos. Contáctanos para recibir una cotización personalizada sin compromiso."
    },
    {
      question: "¿En qué ciudades está disponible Glovo On-Demand?",
      answer: "Glovo On-Demand está disponible en más de 25 países y cientos de ciudades. Consulta la disponibilidad en tu zona contactando a nuestro equipo comercial."
    },
    {
      question: "¿Qué tipo de negocios pueden usar On-Demand?",
      answer: "Cualquier negocio que necesite entregas puede usar nuestro servicio: restaurantes, farmacias, supermercados, tiendas de conveniencia, y más."
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
