'use client';

import { useParams } from 'next/navigation';

/**
 * Hook to get the current user ID
 * 
 * This hook attempts to get the user ID from:
 * 1. URL params (if viewing another user's profile)
 * 2. Auth context (if available)
 * 3. Fallback to 'current' (which the API should handle)
 * 
 * TODO: Replace with actual auth context when available
 */
export function useCurrentUserId(): string {
  const params = useParams();
  
  // If ID is in URL params, use it (for viewing other profiles)
  if (params?.id && typeof params.id === 'string') {
    return params.id;
  }
  
  // TODO: Get from auth context
  // const { user } = useAuth();
  // if (user?.id) return user.id;
  
  // Fallback to 'current' - API should handle this
  return 'current';
}
