export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#06080f] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="h-6 w-52 rounded-lg bg-white/10" />
            <div className="h-4 w-72 rounded-lg bg-white/[0.06]" />
          </div>
          <div className="flex gap-3">
            <div className="h-9 w-28 rounded-full bg-white/10" />
            <div className="h-9 w-24 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-28 rounded-2xl border border-white/[0.08] bg-white/[0.03]"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 rounded-2xl border border-white/[0.08] bg-white/[0.03]" />
          <div className="h-80 rounded-2xl border border-white/[0.08] bg-white/[0.03]" />
        </div>

        <div className="h-64 rounded-2xl border border-white/[0.08] bg-white/[0.03]" />
      </div>
    </div>
  );
}
