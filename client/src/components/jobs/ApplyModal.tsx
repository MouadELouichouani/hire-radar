"use client";

import { useState } from "react";
import { X, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onApply: (
    jobId: string,
    coverLetter?: string,
    cvFile?: File,
  ) => Promise<void>;
}

export default function ApplyModal({
  isOpen,
  onClose,
  job,
  onApply,
}: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !job) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onApply(job.id, coverLetter, cvFile || undefined);
      // Reset form
      setCoverLetter("");
      setCvFile(null);
      onClose();
    } catch (error) {
      console.error("Error applying:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Apply for {job.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {job.company_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Cover Letter (Optional)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              placeholder="Tell the employer why you're a great fit for this position..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Upload CV/Resume (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="cv-upload"
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cvFile ? cvFile.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  PDF, DOC, DOCX (max 5MB)
                </p>
              </label>
            </div>
            {cvFile && (
              <div className="mt-2 flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                <FileText className="w-4 h-4" />
                <span>{cvFile.name}</span>
                <button
                  type="button"
                  onClick={() => setCvFile(null)}
                  className="ml-auto text-red-600 dark:text-red-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
