"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Calendar, Mail, MapPin } from "lucide-react";
import type { User } from "@/types";

interface ProfileHeaderProps {
  user?: User;
  compact?: boolean;
}

export default function ProfileHeader({ user, compact = false }: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (compact) {
    // Compact version for sidebar
    return (
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage 
                  src={user?.image && user.image.trim() !== "" ? user.image : undefined} 
                  alt={user?.full_name || "Profile"} 
                />
                <AvatarFallback className="bg-foreground text-background text-lg font-semibold">
                  {user ? getInitials(user.full_name) : "ME"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full">
                <Camera className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex flex-col items-center gap-1 w-full">
              <h3 className="font-semibold text-sm truncate w-full text-center">
                {user?.full_name || "User"}
              </h3>
              <Badge variant="secondary" className="text-xs capitalize">
                {user?.role || "User"}
              </Badge>
              {user?.email && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground truncate w-full justify-center">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{user.email}</span>
                </div>
              )}
              {user?.created_at && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {formatDate(user.created_at)}</span>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full" size="sm">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full version for profile page
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage 
                src={user?.image && user.image.trim() !== "" ? user.image : undefined} 
                alt={user?.full_name || "Profile"} 
              />
              <AvatarFallback className="text-2xl">
                {user ? getInitials(user.full_name) : "JD"}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full">
              <Camera />
            </Button>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{user?.full_name || "User"}</h1>
              <Badge variant="secondary" className="capitalize">
                {user?.role || "User"}
              </Badge>
            </div>
            {user?.email && (
              <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Mail className="size-4" />
                  {user.email}
                </div>
                {user.created_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    Joined {formatDate(user.created_at)}
                  </div>
                )}
              </div>
            )}
          </div>
          <Button variant="default">Edit Profile</Button>
        </div>
      </CardContent>
    </Card>
  );
}