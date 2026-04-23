export default function MarketingLandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6 text-center ">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Allocate Platform
      </p>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Plan, assign, and track work in one collaborative dashboard.
      </h1>
      <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
        This route group is your marketing surface. Keep public content, pricing,
        docs, and SEO-first pages in this segment.
      </p>
      <div className="flex gap-3">
        <a
          href="/sign-in"
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Sign in
        </a>
        <a
          href="/pricing"
          className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900"
        >
          View pricing
        </a>
      </div>
    </main>
  );
}
