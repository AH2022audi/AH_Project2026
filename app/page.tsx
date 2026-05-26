import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { JobList } from "@/components/job-list"
import { createClient } from "@/lib/supabase/server"
import { AudiLogo } from "@/components/audi-logo"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching jobs:", error)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-background">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="flex flex-col items-center text-center gap-6">
              <AudiLogo className="h-10 w-auto text-foreground" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance">
                Join Our Team
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl text-pretty" style={{ fontFamily: 'inherit' }}>
                Explore our latest opportunities in China and become part of a team that drives innovation forward.
              </p>
            </div>
          </div>
        </section>

        {/* Job List Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6">
            <JobList jobs={jobs || []} />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
