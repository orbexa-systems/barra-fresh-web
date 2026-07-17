export default function AdminLoading() {
  return (
    <div className="px-6 py-8 max-w-5xl">
      <div className="h-8 w-52 bg-gray-200 rounded-xl animate-pulse mb-8" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
