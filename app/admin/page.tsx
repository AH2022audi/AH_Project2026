"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Lock } from "lucide-react"

const ADMIN_PASSWORD = "audi2024"

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setError("")
      router.push("/admin/dashboard")
    } else {
      setError("Incorrect password. Please try again.")
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
                  Enter the admin password to continue.
                </p>
              </div>

              <form onSubmit={handleLogin} className="w-full space-y-4">
                <div>
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
                  className="w-full h-10 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Sign In
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
