import Link from "next/link";

export default function MarketingLandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6  px-6 text-center ">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        Allocate Platform
      </p>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
        Plan, assign, and track work in one collaborative dashboard.
      </h1>
      <p className="max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
        This route group is your marketing surface. Keep public content, pricing,
        docs, and SEO-first pages in this segment.
      </p>
      <div className="flex gap-3">
        <Link
          href="/sign-in"
          className="rounded-full bg-slate-900 dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-white"
        >
          Sign in
        </Link>
        <a
          href="/pricing"
          className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 dark:text-slate-800"
        >
          View pricing
        </a>
      </div>
    </main>
  );
}
