"use client";

import ProfileHeader from "./components/profile-header";
import ProfileContent from "./components/profile-content";
import { useCurrentUser } from "@/features/auth/hook";
import type { User } from "@/types";

export default function Page() {
  const { data } = useCurrentUser();
  const currentUser = data as User | undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <ProfileHeader user={currentUser} />
      <ProfileContent />
    </div>
  );
}