"use client"

import { Job } from "@/lib/types"
import { X, MapPin, Building2, Calendar } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { useEffect } from "react"

interface JobDetailModalProps {
  job: Job | null
  onClose: () => void
}

export function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  useEffect(() => {
    if (!job) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [job, onClose])

  if (!job) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-detail-title"
        className="relative w-full max-w-2xl bg-background border border-border flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-8 py-6 border-b border-border">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-widest text-accent">
              Open Position
            </span>
            <h2
              id="job-detail-title"
              className="text-xl font-bold text-foreground leading-tight text-balance"
            >
              {job.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Meta */}
        <div className="px-8 py-5 border-b border-border bg-secondary/40">
          <dl className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <dt className="sr-only">Department</dt>
              <dd className="text-sm text-foreground font-medium">{job.department}</dd>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <dt className="sr-only">Location</dt>
              <dd className="text-sm text-foreground font-medium">{job.location}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <dt className="sr-only">Posted</dt>
              <dd className="text-sm text-muted-foreground">
                Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                <span className="ml-1 text-muted-foreground/60">
                  &mdash; {format(new Date(job.created_at), "MMM d, yyyy")}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Job Description
          </h3>
          <div className="prose prose-sm max-w-none">
            {job.description.split("\n").map((paragraph, i) => (
              <p
                key={i}
                className="text-sm text-foreground leading-relaxed mb-3 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-border flex items-center justify-between gap-4 bg-secondary/20">
          <p className="text-xs text-muted-foreground">
            Last updated {format(new Date(job.updated_at), "MMM d, yyyy")}
          </p>
          <button
            onClick={onClose}
            className="h-9 px-5 text-sm font-medium border border-border text-foreground hover:bg-secondary transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
