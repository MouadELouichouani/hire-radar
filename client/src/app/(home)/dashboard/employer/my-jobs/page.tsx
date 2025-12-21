"use client";

import { useEffect, useState, useCallback } from "react";
import { getEmployerJobs, deleteJob, EmployerJob } from "./api";
import { JobsList } from "./components/jobs-list";
import { EditJobModal } from "./components/edit-job-modal";
import { AddJobModal } from "./components/add-job-modal";
import { Pagination } from "./components/pagination";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState<"created_at" | "title">("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [editingJob, setEditingJob] = useState<EmployerJob | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addJobModalOpen, setAddJobModalOpen] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getEmployerJobs({
        page,
        limit: 10,
        sort: sortBy,
        order,
      });

      setJobs(response.jobs);
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch {
      toast.error("Failed to load your jobs");
    } finally {
      setIsLoading(false);
    }
  }, [page, sortBy, order]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleEdit = (job: EmployerJob) => {
    setEditingJob(job);
    setEditModalOpen(true);
  };

  const handleDelete = async (jobId: number) => {
    try {
      setDeletingJobId(jobId);
      await deleteJob(jobId);
      toast.success("Job deleted successfully");
      fetchJobs();
    } catch {
      toast.error("Failed to delete job");
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleEditSuccess = () => {
    setEditingJob(null);
    fetchJobs();
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            My Job Postings
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor your job postings
          </p>
        </div>

        <Button onClick={() => setAddJobModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Post a New Job
        </Button>
      </div>      

      {/* Filters */}
      <Card>
        <CardContent className="py-1 flex flex-wrap gap-6 items-center">
          {total > 0 && (
            <p className="text-sm text-muted-foreground">
              Total job postings:{" "}
              <span className="font-medium text-foreground">{total}</span>
            </p>
          )}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as "created_at" | "title");
                setPage(1);
              }}
              className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="created_at">Recently Posted</option>
              <option value="title">Title (A–Z)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Order</span>
            <select
              value={order}
              onChange={(e) => {
                setOrder(e.target.value as "asc" | "desc");
                setPage(1);
              }}
              className="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <JobsList
        jobs={jobs}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deletingJobId}
      />

      {/* Pagination */}
      {!isLoading && jobs.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      )}

      {/* Modals */}
      <EditJobModal
        job={editingJob}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={handleEditSuccess}
      />

      <AddJobModal
        open={addJobModalOpen}
        onOpenChange={setAddJobModalOpen}
        onSuccess={() => {
          setAddJobModalOpen(false);
          setPage(1);
          fetchJobs();
        }}
      />
    </div>
  );
}
