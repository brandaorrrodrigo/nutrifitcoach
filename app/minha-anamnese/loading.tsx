export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>

        <div className="bg-white p-8 rounded-lg shadow">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="mb-6">
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
