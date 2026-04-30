export function GlobalBentoBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(45,212,191,0.14),transparent_40%),radial-gradient(circle_at_88%_20%,rgba(26,54,93,0.14),transparent_38%),linear-gradient(to_bottom,#f8fafc,#eef4ff)] dark:bg-[radial-gradient(circle_at_15%_10%,rgba(45,212,191,0.20),transparent_40%),radial-gradient(circle_at_88%_20%,rgba(99,102,241,0.20),transparent_38%),linear-gradient(to_bottom,#020617,#0f172a)]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.10)_1px,transparent_1px)]" />

      <div className="absolute left-[7%] top-[14%] h-28 w-28 rounded-3xl border border-slate-200/70 bg-white/45 shadow-[0_14px_40px_-30px_rgba(15,23,42,0.65)] backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/35" />
      <div className="absolute right-[12%] top-[19%] h-32 w-44 rounded-3xl border border-cyan-200/70 bg-cyan-100/40 shadow-[0_14px_40px_-32px_rgba(8,145,178,0.85)] backdrop-blur-md dark:border-cyan-500/40 dark:bg-cyan-500/14" />
      <div className="absolute left-[16%] bottom-[21%] h-36 w-52 rounded-3xl border border-indigo-200/70 bg-indigo-100/35 shadow-[0_14px_40px_-32px_rgba(79,70,229,0.85)] backdrop-blur-md dark:border-indigo-500/40 dark:bg-indigo-500/12" />
      <div className="absolute right-[18%] bottom-[13%] h-24 w-24 rounded-2xl border border-emerald-200/80 bg-emerald-100/45 shadow-[0_14px_40px_-32px_rgba(5,150,105,0.85)] backdrop-blur-md dark:border-emerald-500/45 dark:bg-emerald-500/15" />
      <div className="absolute left-1/2 top-[48%] h-40 w-72 -translate-x-1/2 rounded-[2rem] border border-slate-200/70 bg-white/40 shadow-[0_20px_60px_-38px_rgba(15,23,42,0.40)] backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/35" />
    </div>
  );
}
