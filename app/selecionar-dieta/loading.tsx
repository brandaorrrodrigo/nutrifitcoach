export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="h-10 w-96 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-8"></div>

        {/* Perfis skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="h-7 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-4 w-4/6 bg-gray-100 rounded animate-pulse"></div>
              </div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
