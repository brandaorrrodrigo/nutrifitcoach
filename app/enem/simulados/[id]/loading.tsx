export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="flex gap-4">
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Questão */}
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-4 w-5/6 bg-gray-100 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-4/6 bg-gray-100 rounded animate-pulse mb-8"></div>

          {/* Alternativas */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 w-full bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
