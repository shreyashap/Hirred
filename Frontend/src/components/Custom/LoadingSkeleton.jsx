const LoadingSkeleton = () => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
        <div className="w-11/12 max-w-md p-6 bg-gray-800 rounded-lg shadow-lg animate-pulse">
          <div className="h-6 w-3/4 bg-gray-700 rounded mb-4"></div>
          <div className="h-6 w-1/2 bg-gray-700 rounded mb-4"></div>
          <div className="h-48 bg-gray-700 rounded mb-4"></div>
          <div className="flex space-x-4">
            <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
            <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
            <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingSkeleton;
