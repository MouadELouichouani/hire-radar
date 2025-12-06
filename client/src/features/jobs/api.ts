import apiClient from "@/lib/apiClient";
import { Job, JobSearchParams, JobSearchResponse, SaveJobResponse } from "@/types/job";

export async function searchJobs(params: JobSearchParams = {}): Promise<JobSearchResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.search) queryParams.append('search', params.search);
  if (params.location) queryParams.append('location', params.location);
  if (params.salary_min) queryParams.append('salary_min', params.salary_min.toString());
  if (params.skill) queryParams.append('skill', params.skill);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const { data } = await apiClient.get<JobSearchResponse>(
    `/jobs?${queryParams.toString()}`
  );
  return data;
}

export async function getJobById(id: string): Promise<Job> {
  const { data } = await apiClient.get<Job>(`/jobs/${id}`);
  return data;
}

export async function saveJob(jobId: string): Promise<SaveJobResponse> {
  const { data } = await apiClient.post<SaveJobResponse>(`/jobs/${jobId}/save`);
  return data;
}

export async function unsaveJob(jobId: string): Promise<SaveJobResponse> {
  const { data } = await apiClient.delete<SaveJobResponse>(`/jobs/${jobId}/save`);
  return data;
}
