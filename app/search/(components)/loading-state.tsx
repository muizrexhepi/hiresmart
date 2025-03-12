export function LoadingState() {
  return (
    <div className="overflow-hidden space-y-6">
      <div className="flex justify-between items-center">
        <div className="w-32 md:w-44 h-8 bg-gray-200 rounded-md"></div>
        <div className="w-32 md:hidden h-8 bg-gray-200 rounded-md"></div>
      </div>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="p-4 border-b bg-white border-gray-100 animate-pulse rounded-lg"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3 h-52 bg-gray-200 rounded-md"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
