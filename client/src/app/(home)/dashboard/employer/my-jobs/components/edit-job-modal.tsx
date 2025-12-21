"use client";

import {
  EmployerJob,
  updateJobWithSkills,
  getAvailableSkills,
  Skill,
} from "../api";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SkillSelector } from "./skill-selector";
import { toast } from "sonner";

interface EditJobModalProps {
  job: EmployerJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditJobModal({
  job,
  open,
  onOpenChange,
  onSuccess,
}: EditJobModalProps) {
  const [formData, setFormData] = useState<{
    title?: string;
    description?: string;
    company?: string;
    location?: string;
    salary_range?: string;
    emp_type?: string;
    responsibilities?: string[];
    skill_ids?: number[];
  }>(job || {});
  const [isLoading, setIsLoading] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        company: job.company,
        location: job.location,
        salary_range: job.salary_range,
        emp_type: job.emp_type,
        responsibilities: job.responsibilities,
        skill_ids: job.skills?.map((s) => s.id) || [],
      });
      fetchSkills();
    }
  }, [job, open]);

  const fetchSkills = async () => {
    try {
      setSkillsLoading(true);
      const skills = await getAvailableSkills();
      setAvailableSkills(skills);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      toast.error("Failed to load skills");
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    try {
      setIsLoading(true);

      await updateJobWithSkills(job.id, {
        title: formData.title,
        description: formData.description,
        company: formData.company,
        location: formData.location,
        salary_range: formData.salary_range,
        emp_type: formData.emp_type,
        responsibilities: formData.responsibilities,
        skill_ids: formData.skill_ids,
      });

      toast.success("Job updated successfully");

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to update job:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update job"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Posting</DialogTitle>
          <DialogDescription>Update the job details below</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Job Title *
            </label>
            <Input
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Senior React Developer"
              required
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Company Name
            </label>
            <Input
              value={formData.company || ""}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="e.g., Tech Company Inc."
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Description *
            </label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter job description"
              rows={5}
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Location *
            </label>
            <Input
              value={formData.location || ""}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., New York, NY"
              required
            />
          </div>

          {/* Employment Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Employment Type
            </label>
            <select
              value={formData.emp_type || ""}
              onChange={(e) =>
                setFormData({ ...formData, emp_type: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md text-sm
                         border-border bg-background
                         focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="temporary">Temporary</option>
            </select>
          </div>

          {/* Salary Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Salary Range
            </label>
            <Input
              value={formData.salary_range || ""}
              onChange={(e) =>
                setFormData({ ...formData, salary_range: e.target.value })
              }
              placeholder="e.g., $80,000 - $120,000 per year"
              disabled={isLoading}
            />
          </div>

          {/* Skills */}
          <SkillSelector
            availableSkills={availableSkills}
            selectedSkillIds={formData.skill_ids || []}
            onSkillsChange={(skillIds) =>
              setFormData({ ...formData, skill_ids: skillIds })
            }
            disabled={isLoading}
            isLoading={skillsLoading}
          />

          {/* Responsibilities */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Responsibilities
            </label>
            <Textarea
              value={(formData.responsibilities || []).join("\n") || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  responsibilities: e.target.value
                    .split("\n")
                    .filter((r) => r.trim()),
                })
              }
              placeholder="Enter each responsibility on a new line"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              One responsibility per line
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
