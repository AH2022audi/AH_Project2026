import { AudiLogo } from "./audi-logo"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AudiLogo className="h-10 w-auto text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Recruitment Information Platform
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
