"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AudiLogo } from "./audi-logo"
import { Lock, Loader2, X } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const openDialog = () => {
    setUsername("")
    setPassword("")
    setError("")
    setIsOpen(true)
  }

  const closeDialog = () => {
    setIsOpen(false)
    setUsername("")
    setPassword("")
    setError("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        closeDialog()
        router.push("/admin/dashboard")
      } else {
        setError(data.error || "用户名或密码错误，请重试。")
      }
    } catch {
      setError("网络错误，请稍后重试。")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <AudiLogo className="h-10 w-auto text-foreground" />
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Open Positions
            </Link>
            <button
              onClick={openDialog}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </button>
          </nav>
        </div>
      </header>

      {/* Admin Login Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={closeDialog}
            aria-hidden="true"
          />

          {/* Dialog Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-login-title"
            className="relative w-full max-w-sm mx-6 bg-background border border-border shadow-xl"
          >
            {/* Close button */}
            <button
              onClick={closeDialog}
              aria-label="Close login dialog"
              className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-8">
              {/* Icon + Title */}
              <div className="flex flex-col items-center gap-4 mb-7">
                <div className="w-11 h-11 flex items-center justify-center border border-border">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <h2
                    id="admin-login-title"
                    className="text-lg font-semibold text-foreground"
                  >
                    Admin Login
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter your credentials to access the dashboard.
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-username"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Username
                  </label>
                  <input
                    id="admin-username"
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full h-10 px-3 bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 px-3 bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors text-sm"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="flex-1 h-10 border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-10 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
