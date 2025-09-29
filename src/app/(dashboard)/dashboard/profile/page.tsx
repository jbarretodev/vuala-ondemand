export default function Profile() {
  return (
    <section className="flex">
      <div className="space-y-6 lg:col-span-3">
        <Card>
          <div className="flex items-center gap-4">
              <img
                src="https://i.pravatar.cc/100?img=32"
                className="h-16 w-16 rounded-xl"
                alt="avatar"
              />
              <div>
                <h3 className="font-heading text-base font-semibold">Jose Manuel Cedeño</h3>
                <p className="text-sm text-neutral-500">Partner</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-neutral-500">Email</dt>
                <dd>jose@vualadelivery.com</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Telefono</dt>
                <dd>+34 641 53 96 72</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Direccion</dt>
                <dd>Calle jaul 101 , 04007, Almería</dd>
              </div>
            </dl>
       </Card>
       <Card>
        <div className="flex intems-center justify-between">
          <div>
            <h3 className="font-heading text-base font-semibold"> Plan actual</h3>
            <p className="text-sm text-neutral-600">Bussiness | +2000 pedidos/mes</p>
          </div>
        <div className="rounded-lg bg-[var(--color-brand-50)] px-3 py-1 text-[var(--color-brand-600)]"> Base 4.50€ por 2kms <br/> 
          + 1€ km extra
        </div>
       </div>
       <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <FeatureItem>Soporte en vivo </FeatureItem>
        <FeatureItem>Riders disponibles</FeatureItem>
        <FeatureItem>Historial de pedidos </FeatureItem>
        <FeatureItem>Reportes mensuales </FeatureItem>
       </div>
       <div className="mt-4 flex gap-2">
        <button className="rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50">Cambiar plan</button>
        <button className="rounded-xl bg-[var(--color-brand-500)] px-3 py-2 text-sm fonr-semibold text-white hover:bg-[var(--color-brand-600)]">Actualizar plan</button>
       </div>
       </Card>
      </div>
      <div className="space-y-6 px-4 lg:col-span-7">
      <h3>Mostraremos Facturacion</h3>
      </div>
     
    </section>
  );
}

/* ui */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-6 shadow-sm">
      {children}
    </div>
  );
}
function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm">
      <span>#</span> {children}
    </div>
  );
}

function ActivityItem({ title, time }: { title: string; time: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 text-lg">•</span>
      <div>
        <p>{title}</p>
        <p className="text-xs text-neutral-500">{time}</p>
      </div>
    </li>
  );
}