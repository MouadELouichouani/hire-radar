"use client";

import { EmployerJob } from "../api";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Edit2, Briefcase, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface JobCardProps {
  job: EmployerJob;
  onEdit: (job: EmployerJob) => void;
  onDelete: (jobId: number) => Promise<void>;
  isDeleting?: boolean;
}

export function JobCard({ job, onEdit, onDelete, isDeleting }: JobCardProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleteLoading(true);
      await onDelete(job.id);
      setDeleteConfirmOpen(false);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(job.created_at), {
    addSuffix: true,
  });

  return (
    <>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold leading-tight">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {job.company}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(job)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={isDeleting || isDeleteLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            {job.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            )}

            {job.emp_type && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="capitalize">{job.emp_type}</span>
              </div>
            )}

            {job.salary_range && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>{job.salary_range}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
                {job.skills.length > 3 && (
                  <Badge variant="outline">
                    +{job.skills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-6 py-4 border-t text-xs text-muted-foreground">
          Posted {timeAgo}
        </CardFooter>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete job posting</DialogTitle>
            <DialogDescription>
              This will permanently remove <strong>{job.title}</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isDeleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
