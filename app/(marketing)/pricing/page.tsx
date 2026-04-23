export default function PricingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-4 px-6 py-24">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pricing</h1>
      <p className="text-slate-600">
        Keep marketing and growth pages under app/(marketing).
      </p>

      <button className="bg-brand-secondary text-brand-dark font-bold px-4 py-2 rounded-lg">
        Top Up Credits
      </button>

      <div className="bg-brand-primary text-white p-4">
        <h1 className="text-xl font-bold">Allocate Admin</h1>
      </div>
    </main>
  );
}
