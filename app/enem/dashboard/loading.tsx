export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="h-10 w-80 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-5 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Simulados */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-full bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
