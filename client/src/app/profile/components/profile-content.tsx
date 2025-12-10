"use client";

import { useState, useEffect } from "react";
import { Shield, Key, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCurrentUser } from "@/features/auth/hook";
import {
  useCandidateProfile,
  useUpdateCandidateProfile,
} from "@/features/profile/hooks";
import {
  useEmployerProfile,
  useUpdateEmployerProfile,
} from "@/features/profile/hooks";
import type { User } from "@/types";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";

export default function ProfileContent() {
  const { data: currentUserData } = useCurrentUser();
  const currentUser = currentUserData as User | undefined;
  const userId = useCurrentUserId();

  // Fetch profile data based on role
  const { data: candidateProfile, isLoading: isLoadingCandidate } =
    useCandidateProfile(userId);
  const { data: employerProfile, isLoading: isLoadingEmployer } =
    useEmployerProfile(userId);
  const updateCandidate = useUpdateCandidateProfile(userId);
  const updateEmployer = useUpdateEmployerProfile(userId);

  const isLoading =
    currentUser?.role === "candidate" ? isLoadingCandidate : isLoadingEmployer;
  const profile =
    currentUser?.role === "candidate" ? candidateProfile : employerProfile;

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    jobTitle: "",
    company: "",
    skills: [] as string[],
    experience_years: undefined as number | undefined,
    education: "",
    website: "",
    industry: "",
    company_size: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
  });

  // Update form data when profile loads
  // Note: This syncs form state with async profile data - necessary use case
  useEffect(() => {
    if (profile) {
      if (currentUser?.role === "candidate" && candidateProfile) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          full_name: candidateProfile.full_name || "",
          company_name: "",
          email: candidateProfile.email || "",
          phone: candidateProfile.phone || "",
          location: candidateProfile.location || "",
          bio: candidateProfile.bio || "",
          jobTitle: "",
          company: "",
          skills: candidateProfile.skills || [],
          experience_years: candidateProfile.experience_years,
          education: candidateProfile.education || "",
          website: "",
          industry: "",
          company_size: "",
          linkedin_url: candidateProfile.linkedin_url || "",
          github_url: candidateProfile.github_url || "",
          portfolio_url: candidateProfile.portfolio_url || "",
        });
      } else if (currentUser?.role === "employer" && employerProfile) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          full_name: "",
          company_name: employerProfile.company_name || "",
          email: employerProfile.email || "",
          phone: employerProfile.phone || "",
          location: employerProfile.location || "",
          bio: employerProfile.bio || employerProfile.description || "",
          jobTitle: "",
          company: employerProfile.company_name || "",
          skills: [],
          experience_years: undefined,
          education: "",
          website: employerProfile.website || "",
          industry: employerProfile.industry || "",
          company_size: employerProfile.company_size || "",
          linkedin_url: employerProfile.linkedin_url || "",
          github_url: "",
          portfolio_url: "",
        });
      }
    }
  }, [profile, candidateProfile, employerProfile, currentUser?.role]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser?.role === "candidate") {
      try {
        await updateCandidate.mutateAsync({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || undefined,
          location: formData.location || undefined,
          bio: formData.bio || undefined,
          skills: formData.skills,
          experience_years: formData.experience_years,
          education: formData.education || undefined,
          linkedin_url: formData.linkedin_url || undefined,
          github_url: formData.github_url || undefined,
          portfolio_url: formData.portfolio_url || undefined,
        });
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error("Failed to update profile. Please try again.");
      }
    } else if (currentUser?.role === "employer") {
      try {
        await updateEmployer.mutateAsync({
          company_name: formData.company_name,
          email: formData.email,
          phone: formData.phone || undefined,
          location: formData.location || undefined,
          bio: formData.bio || undefined,
          website: formData.website || undefined,
          industry: formData.industry || undefined,
          company_size: formData.company_size || undefined,
          description: formData.bio || undefined,
          linkedin_url: formData.linkedin_url || undefined,
        });
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      {/* Personal Information */}
      <TabsContent value="personal" className="space-y-6">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and profile information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {currentUser?.role === "candidate" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) =>
                          handleInputChange("full_name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience_years">
                        Years of Experience
                      </Label>
                      <Input
                        id="experience_years"
                        type="number"
                        value={formData.experience_years || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "experience_years",
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education">Education</Label>
                      <Input
                        id="education"
                        value={formData.education}
                        onChange={(e) =>
                          handleInputChange("education", e.target.value)
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name</Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) =>
                          handleInputChange("company_name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) =>
                          handleInputChange("website", e.target.value)
                        }
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        value={formData.industry}
                        onChange={(e) =>
                          handleInputChange("industry", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_size">Company Size</Label>
                      <Input
                        id="company_size"
                        value={formData.company_size}
                        onChange={(e) =>
                          handleInputChange("company_size", e.target.value)
                        }
                        placeholder="e.g., 1-10, 11-50, 51-200"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                />
              </div>
              {currentUser?.role === "candidate" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) =>
                        handleInputChange("linkedin_url", e.target.value)
                      }
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      type="url"
                      value={formData.github_url}
                      onChange={(e) =>
                        handleInputChange("github_url", e.target.value)
                      }
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio_url">Portfolio URL</Label>
                    <Input
                      id="portfolio_url"
                      type="url"
                      value={formData.portfolio_url}
                      onChange={(e) =>
                        handleInputChange("portfolio_url", e.target.value)
                      }
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </>
              )}
              {currentUser?.role === "employer" && (
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) =>
                      handleInputChange("linkedin_url", e.target.value)
                    }
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="submit"
                  disabled={
                    updateCandidate.isPending || updateEmployer.isPending
                  }
                >
                  {(updateCandidate.isPending || updateEmployer.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </TabsContent>

      {/* Account Settings */}
      <TabsContent value="account" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and subscription.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Account Status</Label>
                <p className="text-muted-foreground text-sm">
                  Your account is currently active
                </p>
              </div>
              <Badge
                variant="outline"
                className="border-green-200 bg-green-50 text-green-700"
              >
                Active
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Subscription Plan</Label>
                <p className="text-muted-foreground text-sm">
                  Pro Plan - $29/month
                </p>
              </div>
              <Button variant="outline">Manage Subscription</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Account Visibility</Label>
                <p className="text-muted-foreground text-sm">
                  Make your profile visible to other users
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Data Export</Label>
                <p className="text-muted-foreground text-sm">
                  Download a copy of your data
                </p>
              </div>
              <Button variant="outline">Export Data</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Delete Account</Label>
                <p className="text-muted-foreground text-sm">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Security Settings */}
      <TabsContent value="security" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your account security and authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Password</Label>
                  <p className="text-muted-foreground text-sm">
                    Last changed 3 months ago
                  </p>
                </div>
                <Button variant="outline">
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-muted-foreground text-sm">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-green-200 bg-green-50 text-green-700"
                  >
                    Enabled
                  </Badge>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Login Notifications</Label>
                  <p className="text-muted-foreground text-sm">
                    Get notified when someone logs into your account
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Active Sessions</Label>
                  <p className="text-muted-foreground text-sm">
                    Manage devices that are logged into your account
                  </p>
                </div>
                <Button variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  View Sessions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notification Settings */}
      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose what notifications you want to receive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive notifications via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Marketing Emails</Label>
                  <p className="text-muted-foreground text-sm">
                    Receive emails about new features and updates
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Weekly Summary</Label>
                  <p className="text-muted-foreground text-sm">
                    Get a weekly summary of your activity
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Security Alerts</Label>
                  <p className="text-muted-foreground text-sm">
                    Important security notifications (always enabled)
                  </p>
                </div>
                <Switch checked disabled />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
