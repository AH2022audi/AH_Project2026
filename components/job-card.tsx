import { Job } from "@/lib/types"
import { MapPin, Building2, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface JobCardProps {
  job: Job
  onViewDetails: (job: Job) => void
}

export function JobCard({ job, onViewDetails }: JobCardProps) {
  return (
    <article className="group border border-border bg-card p-6 hover:border-foreground transition-colors">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
            {job.title}
          </h3>
          <span className="shrink-0 px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground uppercase tracking-wide">
            Hiring
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            <span>{job.department}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDistanceToNow(new Date(job.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        <div className="pt-2 border-t border-border">
          <button
            onClick={() => onViewDetails(job)}
            className="text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            View Details &rarr;
          </button>
        </div>
      </div>
    </article>
  )
}
