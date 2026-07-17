export default function MenuLoading() {
  return (
    <>
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-5 w-16 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>

      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-3">
            <div className="h-6 w-28 bg-gray-200 rounded-full mx-auto animate-pulse" />
            <div className="h-9 w-64 bg-gray-200 rounded-xl mx-auto animate-pulse" />
            <div className="h-4 w-80 bg-gray-100 rounded-lg mx-auto animate-pulse" />
          </div>

          <div className="flex gap-2 mb-8 overflow-hidden">
            {[80, 96, 72, 88, 64, 80].map((w, i) => (
              <div
                key={i}
                style={{ width: w }}
                className="h-9 rounded-full bg-gray-200 animate-pulse shrink-0"
              />
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                  <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-1/2 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
