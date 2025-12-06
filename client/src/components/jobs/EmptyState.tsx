'use client';

import { Search, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export default function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-12 shadow-lg max-w-md w-full text-center">
        <Search className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No jobs found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {hasFilters
            ? 'Try adjusting your filters to see more results.'
            : 'We couldn\'t find any jobs matching your search. Try different keywords or check back later.'}
        </p>
        {hasFilters && onClearFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="flex items-center gap-2 mx-auto"
          >
            <FilterX className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
