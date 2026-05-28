"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Lock, Loader2 } from "lucide-react"

export default function AdminPage() {
  const [username, setUsername] = useState("admin")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        router.push("/admin/dashboard")
      } else {
        setError(data.error || "Invalid credentials. Please try again.")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16">
        <div className="w-full max-w-sm px-6">
          <div className="border border-border bg-card p-8">
            <div className="flex flex-col items-center gap-6">
              <div className="w-12 h-12 flex items-center justify-center border border-border">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>

              <div className="text-center">
                <h1 className="text-xl font-semibold text-foreground">Admin Access</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your credentials to continue.
                </p>
              </div>

              <form onSubmit={handleLogin} className="w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full h-10 px-3 bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-10 px-3 bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                  />
                  {error && (
                    <p className="mt-2 text-sm text-accent">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
