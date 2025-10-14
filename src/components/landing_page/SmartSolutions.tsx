import Image from "next/image";

export default function SmartSolutions(){
  return(
      <section className="mt-5 relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 p-8 md:p-12 lg:p-16 text-white">
      {/* brillos suaves */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      </div>

      <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
        {/* Texto */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest/relaxed text-white/80">
            Plataforma todo-en-uno
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Soluciones de última milla,{" "}
            <span className="rounded bg-white/30 px-2">resultados en tiempo real</span>
          </h2>

          <p className="mt-5 text-white/85">
            <span className="rounded bg-white/25 px-1 text-xl">
              Orquestamos pedidos, ruteo dinámico y auto-batching
            </span>{" "}
            con riders y tiendas en un solo panel. Integramos tu TPV/ERP y marketplaces
            para preparar, despachar y entregar más rápido.
          </p>

          <ul className="mt-6 space-y-3 text-white/85">
            <li className="flex gap-3 text-xl">
              <span className="mt-1">•</span>
              Ruteo dinámico con ventanas de preparación, zonas y ETAs en vivo.
            </li>
            <li className="flex gap-3 text-xl">
              <span className="mt-1">•</span>
              Tracking con enlace al cliente, prueba de entrega (foto/firma) y geocercas.
            </li>
            <li className="flex gap-3 text-xl">
              <span className="mt-1">•</span>
              Integraciones: Last.app, Deliverect, Glop, Shopify, Stripe; estados de vuelta al TPV.
            </li>
          </ul>
        </div>

        {/* Imagen + tarjetas */}
        <div className="relative mx-auto">
          <div className="relative h-[420px] w-[420px]">
            {/* círculos y anillos */}
            <div className="absolute inset-0 rounded-full bg-white/10" />
            <div className="absolute inset-6 rounded-full border-2 border-dashed border-white/50" />
            <div className="absolute inset-20 rounded-full bg-white/10" />

            {/* rider */}
            <Image
              src="/images/rider.png"
              alt="Rider de última milla"
              fill
              className="object-contain p-6"
              priority
            />

            {/* tarjeta superior derecha */}
            <div className="absolute -top-4 right-0 w-44 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 text-slate-800">
              <p className="text-xs font-medium text-slate-500">On-Time</p>
              <div className="mt-1 text-2xl font-bold">92%</div>
              <div className="text-xs text-emerald-600">▲ +7% vs. semana pasada</div>
            </div>

            {/* tarjeta inferior izquierda */}
            <div className="absolute bottom-16 -left-6 w-44 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 text-slate-800">
              <p className="text-xs font-medium text-slate-500">ETA promedio</p>
              <div className="mt-1 text-2xl font-bold">24′</div>
              <div className="text-xs text-emerald-600">▼ −18% retraso medio</div>
            </div>

            {/* tarjeta inferior derecha */}
            <div className="absolute bottom-4 right-6 w-28 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5 text-center text-slate-800">
              <div className="text-2xl font-bold">74%</div>
              <div className="mt-1 h-2 rounded bg-slate-200">
                <div className="h-2 w-3/4 rounded bg-sky-500" />
              </div>
              <p className="mt-1 text-[10px] text-slate-500">Capacidad</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}