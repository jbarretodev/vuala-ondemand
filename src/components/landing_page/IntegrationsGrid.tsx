import Image from "next/image";

type Integration = { name: string; subtitle: string; logo: string };

const integrations: Integration[] = [
  { name: "Uber Eats",   logo: "/logos/uber-eats.png",  subtitle: "Marketplace y delivery on-demand" },
  { name: "Glovo",       logo: "/logos/glovo.png",      subtitle: "Marketplace con logística integrada" },
  { name: "Rappi",       logo: "/logos/rappi.png",      subtitle: "Marketplace LATAM" },
  { name: "Just Eat",    logo: "/logos/just-eat.png",   subtitle: "Marketplace y pedidos online" },
  { name: "Instaleap",   logo: "/logos/instaleap.png",  subtitle: "OMS y ruteo para retail" },
  { name: "Ordatic",     logo: "/logos/ordatic.png",    subtitle: "Agregador de pedidos hacia tu TPV" },
  { name: "Last.app",    logo: "/logos/lastapp.png",    subtitle: "TPV & back-office de restauración" },
  { name: "Flipdish",    logo: "/logos/flipdish.png",   subtitle: "Web/app propia, kioskos y fidelización" },
];

export default function IntegrationsGrid() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800">
            Automatiza tu operación con nuestras integraciones
          </h2>
          <p className="mt-3 text-slate-500 text-lg">
            Conecta marketplaces, POS y orquestadores para sincronizar menú, estados y reparto en tiempo real.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((it) => (
            <article
              key={it.name}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition
                         hover:border-sky-200 hover:shadow-md"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden">
                <Image
                  src={it.logo}
                  alt={`${it.name} logo`}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>

              <div className="min-w-0">
                <h3 className="truncate font-semibold text-slate-800">{it.name}</h3>
                <p className="text-sm text-slate-500">{it.subtitle}</p>
              </div>

              <div className="ml-auto hidden text-slate-400 transition group-hover:block">→</div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-slate-700
                             shadow-sm hover:bg-slate-50">
            Ver todas las integraciones
          </button>
        </div>
      </div>
    </section>
  );
}
