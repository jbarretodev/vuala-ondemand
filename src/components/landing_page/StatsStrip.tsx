type Stat = { value: string; text: string };

const stats: Stat[] = [
  {
    value: "89k",
    text: "Pedidos de última milla entregados en el último año.",
  },
  {
    value: "76%",
    text: "Entregas en < 30 min gracias a ruteo dinámico y auto-batching.",
  },
  {
    value: "4.93",
    text: "Valoración media de clientes (25k reseñas verificadas).",
  },
];

export default function StatsStrip() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <ul className="grid gap-12 md:grid-cols-3">
          {stats.map((s) => (
            <li key={s.value} className="flex items-start gap-6 text-lg">
              <span className="text-slate-800 text-5xl md:text-6xl font-extrabold tabular-nums">
                {s.value}
              </span>
              <p className="text-slate-600 leading-relaxed">
                {s.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
