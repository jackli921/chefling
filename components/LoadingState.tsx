"use client";

export function LoadingState() {
  return (
    <div className="mt-8 space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>

      {/* Meta info skeleton */}
      <div className="flex gap-4">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
        <div className="h-5 bg-gray-200 rounded w-24"></div>
        <div className="h-5 bg-gray-200 rounded w-24"></div>
      </div>

      {/* Ingredients section skeleton */}
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-56"></div>
          <div className="h-4 bg-gray-200 rounded w-40"></div>
          <div className="h-4 bg-gray-200 rounded w-52"></div>
          <div className="h-4 bg-gray-200 rounded w-44"></div>
        </div>
      </div>

      {/* Steps section skeleton */}
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm">
        Fetching and parsing recipe...
      </p>
    </div>
  );
}
