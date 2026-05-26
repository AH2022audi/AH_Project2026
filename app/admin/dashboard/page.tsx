"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Job } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { Plus, Pencil, Trash2, X, Save, Loader2 } from "lucide-react"

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    description: "",
  })

  const supabase = createClient()

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching jobs:", error)
    } else {
      setJobs(data || [])
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const openModal = (job?: Job) => {
    if (job) {
      setEditingJob(job)
      setFormData({
        title: job.title,
        department: job.department,
        location: job.location,
        description: job.description,
      })
    } else {
      setEditingJob(null)
      setFormData({ title: "", department: "", location: "", description: "" })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingJob(null)
    setFormData({ title: "", department: "", location: "", description: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    if (editingJob) {
      const { error } = await supabase
        .from("jobs")
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq("id", editingJob.id)
      if (error) console.error("Error updating job:", error)
    } else {
      const { error } = await supabase.from("jobs").insert([formData])
      if (error) console.error("Error creating job:", error)
    }

    setSaving(false)
    closeModal()
    fetchJobs()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this position?")) return
    const { error } = await supabase.from("jobs").delete().eq("id", id)
    if (error) {
      console.error("Error deleting job:", error)
    } else {
      fetchJobs()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manage Positions</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Add, edit, or remove job listings.
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 h-10 px-4 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Position
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : jobs.length > 0 ? (
            <div className="border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      Position
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                      Location
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-foreground font-medium">
                        {job.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {job.department}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {job.location}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(job)}
                            aria-label="Edit position"
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            aria-label="Delete position"
                            className="p-2 text-muted-foreground hover:text-accent transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 border border-border bg-card">
              <p className="text-muted-foreground">No positions yet.</p>
              <button
                onClick={() => openModal()}
                className="mt-4 text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                Add the first position &rarr;
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-foreground/20"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-lg mx-6 bg-background border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                {editingJob ? "Edit Position" : "Add Position"}
              </h2>
              <button
                onClick={closeModal}
                aria-label="Close"
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full h-10 px-3 bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    placeholder="e.g. Engineering"
                    className="w-full h-10 px-3 bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g. Berlin"
                    className="w-full h-10 px-3 bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Job Description
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the role, responsibilities, and requirements..."
                  className="w-full px-3 py-2 bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 h-10 px-4 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {editingJob ? "Save Changes" : "Create Position"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
