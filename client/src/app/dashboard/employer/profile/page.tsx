"use client";

import { useCurrentUser } from "@/features/auth/hook";
import TopNavbar from "@/components/TopNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/features/jobs/hooks";
import JobCard from "@/components/jobs/JobCard";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import { Briefcase } from "lucide-react";

export default function EmployerProfilePage() {
  const { data: currentUser, isLoading, error, refetch } = useCurrentUser();

  const {
    data: jobsData,
    isLoading: isLoadingJobs,
  } = useJobs({ limit: 100 });

  // Filter jobs by this employer (using user.id as employer_id)
  const employerJobs =
    jobsData?.jobs.filter((job) => job.employer_id === currentUser?.id) || [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavbar />
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl pt-24">
          <Card className="border-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-6 mb-6">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
          </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavbar />
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl pt-24">
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-destructive mb-4">
                {error instanceof Error
                  ? error.message
                  : "Failed to load profile"}
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-foreground text-background hover:bg-foreground/90 rounded-md font-semibold transition-colors"
              >
                Try Again
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavbar />
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl pt-24">
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Profile not found. Please log in.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl pt-24">
        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="border-border">
            <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-32 w-32 border-4 border-border">
                  <AvatarImage
                    src={currentUser.image || undefined}
                    alt={currentUser.full_name}
                  />
                  <AvatarFallback className="bg-foreground text-background text-2xl font-bold">
                    {getInitials(currentUser.full_name)}
                  </AvatarFallback>
                </Avatar>

              <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{currentUser.full_name}</h1>
                  <p className="text-muted-foreground mb-4">{currentUser.email}</p>
                  <Badge variant="secondary" className="capitalize">
                    {currentUser.role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-3">
              <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                  Company Name
                </label>
                  <p className="text-foreground">{currentUser.full_name}</p>
              </div>
              <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                  Email
                </label>
                  <p className="text-foreground">{currentUser.email}</p>
              </div>
              <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                  Role
                </label>
                  <p className="text-foreground capitalize">{currentUser.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posted Jobs Section */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Posted Jobs ({employerJobs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingJobs ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <JobCardSkeleton key={i} />
                  ))}
            </div>
              ) : employerJobs.length === 0 ? (
                <p className="text-muted-foreground">
                  No jobs posted yet.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {employerJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
          </div>
              )}
            </CardContent>
          </Card>

          {/* Note */}
          <Card className="border-border bg-muted/50">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Complete profile features (company details,
              industry, website) will be available once the backend employer
              endpoints are implemented.
            </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
