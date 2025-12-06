'use client';

export default function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="flex-1 space-y-4">
            <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-20 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
        <div className="space-y-4">
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
        <div className="space-y-4">
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
