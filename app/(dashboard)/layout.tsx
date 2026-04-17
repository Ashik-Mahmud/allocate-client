export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <p className="text-sm font-semibold text-slate-700">Dashboard</p>
      </header>
      <section className="mx-auto w-full max-w-6xl px-6 py-8">{children}</section>
    </div>
  );
}
