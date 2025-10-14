type Feature = { title: string; description: string; icon?: string };

const features: Feature[] = [
  {
    title: "Ruteo inteligente & auto-batching",
    description:
      "Agrupamos pedidos cercanos y calculamos ETAs dinámicos con Distance Matrix y ventanas de preparación. Menos km, más entregas on-time.",
    icon: "📍",
  },
  {
    title: "Integraciones con TPV/POS",
    description:
      "Conecta Last.app, Deliverect, Glop o Square: sincroniza menú, stock y tickets; devuelve estados al TPV y reduce errores de cocina.",
    icon: "🧩",
  },
  {
    title: "Pedidos omnicanal",
    description:
      "Web, WhatsApp, Instagram y teléfono en un solo panel. Bots validan dirección/horario y disparan el flujo de preparación y despacho.",
    icon: "🛒",
  },
  {
    title: "Pagos & split automático",
    description:
      "Stripe Link/QR, propinas y reparto de comisiones. Conciliación diaria y reportes para contabilidad sin fricción.",
    icon: "💳",
  },
  {
    title: "Tracking en tiempo real",
    description:
      "Link al cliente con mapa, ETA y pruebas de entrega (foto/firma). Geocercas y alertas por retrasos o incidencias.",
    icon: "📦",
  },
  {
    title: "BI, KPIs y alertas",
    description:
      "Looker Studio + Sheets: UTR, on-time, cancelaciones, km/pedido y coste por entrega. Alertas en Slack/Telegram por SLA.",
    icon: "📊",
  },
];export default function AboutSection(){
  return(
    <section className="container mx-auto max-w-6xl about">
      <div className="text-center">
        <h2 className="text-60px font-extrabold traking-right text-slate-800">Todo en un solo Lugar  </h2>
        <span className="mt-5 text-slate-500 text-xl">Integraciones y operaciones de última milla, todo desde un solo panel.</span>
      </div>
      <div className="grid gap-10 md:grid-cols-2 mt-5">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-5">
              {/* Icono simple en círculo (sin librerías) */}
              <div className="shrink-0 grid place-items-center h-14 w-14 rounded-full bg-sky-50">
                <span className="text-2xl" aria-hidden>
                  {f.icon ?? "⚙️"}
                </span>
              </div>

              <div>
                <h3 className="text-32px font-semibold text-slate-800">{f.title}</h3>
                <p className="mt-2 text-slate-500 leading-relaxed text-base">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
    </section>
  );
}