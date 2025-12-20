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
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/features/auth/hook";
import type { User } from "@/types";
import { getValidImageUrl } from "@/lib/image-utils";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function LeftSidebarContent() {
  const { data } = useCurrentUser();
  const currentUser = data as User | undefined;

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

  return (
    <Sidebar collapsible="icon" className="top-16 h-[calc(100svh-4rem)] border-r">
      <SidebarHeader className="border-b border-border p-4 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0 hover:bg-transparent hover:text-foreground data-[active=true]:bg-transparent data-[active=true]:text-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 group-data-[collapsible=icon]:justify-center">
              <div className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center">
                {/* User Profile - Hidden when collapsed */}
                <Link href="/profile" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getValidImageUrl(currentUser?.image)} />
                    <AvatarFallback className="bg-muted text-foreground font-semibold">
                      {currentUser?.full_name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentUser?.full_name || "Guest"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      Welcome!
                    </span>
                  </div>
                </Link>

                {/* User Avatar - Visible only when collapsed (as icon) */}
                <Link href="/profile" className="hidden group-data-[collapsible=icon]:block">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getValidImageUrl(currentUser?.image)} />
                    <AvatarFallback className="bg-muted text-foreground font-semibold">
                      {currentUser?.full_name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>

              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            {/* Trigger Button - Always visible, adjusting icon based on state handled by component usually, or we can explicit it if needed */}
            <div className="flex items-center justify-between w-full group-data-[collapsible=icon]:justify-center mt-2 group-data-[collapsible=icon]:mt-0">
              <SidebarTrigger className="h-7 w-7 text-muted-foreground hover:text-foreground ml-auto group-data-[collapsible=icon]:ml-0" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Navigation Links */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Learning">
                  <a href="#">
                    <Play />
                    <span>Learning</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Insights">
                  <a href="#">
                    <BarChart3 />
                    <span>Insights</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Find colleagues">
                  <a href="#">
                    <UserPlus />
                    <span>Find colleagues</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Bookmarks">
                  <a href="/dashboard/candidate/saved-jobs">
                    <Bookmark />
                    <span>Bookmarks</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Gaming">
                  <a href="#">
                    <Gamepad2 />
                    <span>Gaming</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuBadge className="bg-secondary text-secondary-foreground text-xs rounded-full px-1.5 py-0.5">New</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <a href="#">
                    <Settings />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Followed Hashtags */}
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            <div className="flex items-center justify-between w-full">
              <span>Followed Hashtags</span>
              <button className="text-muted-foreground hover:text-foreground">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-wrap gap-2 px-2 group-data-[collapsible=icon]:hidden">
              {hashtags.map((tag) => (
                <a
                  key={tag}
                  href="#"
                  className="px-2 py-1 bg-muted hover:bg-accent text-foreground text-xs rounded transition-colors"
                >
                  #{tag}
                </a>
              ))}
            </div>
            {/* Icon only view for hashtags (maybe just a hash icon or hidden?) - hiding for now complexity */}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        {/* Footer content if needed */}
      </SidebarFooter>
    </Sidebar>
  );
}

export default function LeftSidebar() {
  return (
    <SidebarProvider
      style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
      className="w-auto flex-none min-h-[calc(100vh-4rem)] hidden md:flex"
    >
      <LeftSidebarContent />
    </SidebarProvider>
  );
}
