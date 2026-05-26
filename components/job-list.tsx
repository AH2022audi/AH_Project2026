"use client"

import { Job } from "@/lib/types"
import { JobCard } from "./job-card"
import { JobDetailModal } from "./job-detail-modal"
import { SearchBar } from "./search-bar"
import { useState, useMemo } from "react"
import { Briefcase } from "lucide-react"

interface JobListProps {
  jobs: Job[]
}

export function JobList({ jobs }: JobListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const filteredJobs = useMemo(() => {
    if (!searchQuery) return jobs
    const query = searchQuery.toLowerCase()
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
    )
  }, [jobs, searchQuery])

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filteredJobs.length}</span>{" "}
              {filteredJobs.length === 1 ? "position" : "positions"} available
            </span>
          </div>
          <SearchBar onSearch={setSearchQuery} />
        </div>

        {filteredJobs.length > 0 ? (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onViewDetails={setSelectedJob}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-border bg-card">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? "No positions match your search." : "No positions available."}
            </p>
          </div>
        )}
      </div>

      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </>
  )
}
