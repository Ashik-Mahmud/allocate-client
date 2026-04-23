export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-transparent">
      <header className="border-b border-slate-200/75 bg-white/75 px-6 py-4 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/65">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Dashboard</p>
      </header>
      <section className="mx-auto w-full max-w-6xl px-6 py-8">{children}</section>
    </div>
  );
}
