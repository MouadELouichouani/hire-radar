"use client";

import {
  Play,
  BarChart3,
  UserPlus,
  Bookmark,
  Gamepad2,
  Settings,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/features/auth/hook";

export default function LeftSidebar() {
  const { data: currentUser } = useCurrentUser();
  const hashtags = [
    "work",
    "business",
    "hr",
    "userinterface",
    "digital",
    "userexperience",
    "ux",
    "ui",
    "freelance",
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border overflow-y-auto">
      <div className="p-4">
        {/* User Profile Card */}
        <Card className="border-border mb-4">
          <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-foreground text-background font-semibold">
                  {currentUser
                    ? getInitials(currentUser.full_name)
                    : "ME"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">
                  {currentUser?.full_name || "User"}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser?.role === "candidate"
                    ? "Candidate"
                    : currentUser?.role === "employer"
                      ? "Employer"
                      : "User"}
                </p>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Profile completion</span>
                <span className="text-muted-foreground">90%</span>
            </div>
              <div className="w-full bg-muted rounded-full h-2">
              <div
                  className="bg-foreground h-2 rounded-full"
                style={{ width: "90%" }}
                />
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-border"
              size="sm"
            >
            + Add another account
            </Button>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <nav className="space-y-1 mb-6">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Play className="w-5 h-5" />
            <span>Learning</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Insights</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>Find colleagues</span>
          </a>
          <a
            href="/dashboard/candidate/saved-jobs"
            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Bookmark className="w-5 h-5" />
            <span>Bookmarks</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>Gaming</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              New
            </Badge>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </nav>

        {/* Followed Hashtags */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase">
              Followed Hashtags
            </h3>
            <button className="text-muted-foreground hover:text-foreground">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <a
                key={tag}
                href="#"
                className="px-3 py-1 bg-muted hover:bg-accent text-foreground text-sm rounded-full transition-colors"
              >
                #{tag}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
