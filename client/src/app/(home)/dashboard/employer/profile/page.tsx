"use client";

<<<<<<< HEAD
<<<<<<<< HEAD:client/src/app/(home)/dashboard/employer/profile/page.tsx
import ProfileHeader from "./components/profile-header";
import ProfileContent from "./components/profile-content";
========
>>>>>>>> origin/main:client/src/app/(home)/dashboard/candidate/profile/page.tsx
=======
<<<<<<<< HEAD:client/src/app/(home)/dashboard/candidate/profile/page.tsx
import ProfileHeader from "./components/profile-header";
import ProfileContent from "./components/profile-content";
========
import ProfileHeader from "../../components/profile-header";
import ProfileContent from "../../components/profile-content";
>>>>>>>> origin/main:client/src/app/(home)/dashboard/employer/profile/page.tsx
>>>>>>> origin/main
import ProfileSidebar from "@/app/(home)/profile/components/profile-sidebar";
import { useCurrentUser } from "@/features/auth/hook";
import type { User } from "@/types";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import ProfileContent from "../../components/profile-content";
import ProfileHeader from "../../components/profile-header";
=======
>>>>>>> origin/main

export default function Page() {
  const { data } = useCurrentUser();
  const currentUser = data as User | undefined;
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && ["profile", "security", "notifications"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    const handleTabChange = (e: CustomEvent) => {
      setActiveTab(e.detail);
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("tab-change", handleTabChange as EventListener);
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener(
        "tab-change",
        handleTabChange as EventListener,
      );
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="mb-8">
        <ProfileHeader user={currentUser} />
      </div>
      <div className="md:flex gap-8">
        <ProfileSidebar />
        <div className="flex-1 min-w-0">
          <ProfileContent defaultTab={activeTab} />
        </div>
      </div>
    </div>
  );
}
