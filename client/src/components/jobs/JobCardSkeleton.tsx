"use client";

export default function JobCardSkeleton() {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 space-y-2">
          <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-5 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="flex gap-3 mb-4">
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="h-6 w-18 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      </div>
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="h-10 flex-1 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}
