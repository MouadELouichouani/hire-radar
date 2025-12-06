"use client";

import { useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import CompanyInfo from "@/components/profile/CompanyInfo";
import EditProfileModal from "@/components/profile/EditProfileModal";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ErrorState from "@/components/profile/ErrorState";
import {
  useEmployerProfile,
  useUpdateEmployerProfile,
} from "@/features/profile/hooks";
import { UpdateEmployerProfileRequest } from "@/types/profile";
import { toast } from "sonner";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";

export default function EmployerProfilePage() {
  const userId = useCurrentUserId();

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useEmployerProfile(userId);
  const updateMutation = useUpdateEmployerProfile(userId);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSave = async (data: UpdateEmployerProfileRequest) => {
    try {
      await updateMutation.mutateAsync(data);
      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 via-pink-50/20 to-white dark:from-gray-950 dark:via-purple-950/30 dark:via-pink-950/20 dark:to-gray-900 p-8">
        <div className="max-w-5xl mx-auto">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 via-pink-50/20 to-white dark:from-gray-950 dark:via-purple-950/30 dark:via-pink-950/20 dark:to-gray-900 p-8">
        <div className="max-w-5xl mx-auto">
          <ErrorState
            message={
              error instanceof Error ? error.message : "Failed to load profile"
            }
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 via-pink-50/20 to-white dark:from-gray-950 dark:via-purple-950/30 dark:via-pink-950/20 dark:to-gray-900 p-8">
        <div className="max-w-5xl mx-auto">
          <ErrorState message="Profile not found" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 via-pink-50/20 to-white dark:from-gray-950 dark:via-purple-950/30 dark:via-pink-950/20 dark:to-gray-900 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <ProfileHeader
          profile={profile}
          role="employer"
          onEditClick={() => setIsEditModalOpen(true)}
        />

        <CompanyInfo profile={profile} />

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          profile={profile}
          role="employer"
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
