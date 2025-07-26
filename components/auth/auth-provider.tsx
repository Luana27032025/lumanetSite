"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, Permission } from "@/types/user"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signOut: () => void
  hasPermission: (permission: Permission) => boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize default users
  useEffect(() => {
    const initializeUsers = () => {
      const existingUsers = localStorage.getItem("lumanet-users")
      if (!existingUsers) {
        const defaultUsers: User[] = [
          {
            id: "1",
            name: "Administrador",
            email: "admin@lumanet.ao",
            password: "LumaNet2024!",
            role: "admin",
            status: "active",
            permissions: [
              "view_dashboard",
              "view_clients",
              "manage_clients",
              "view_subscriptions",
              "manage_subscriptions",
              "view_invoices",
              "manage_invoices",
              "view_reports",
              "manage_users",
            ],
            createdAt: new Date().toISOString(),
          },
        ]
        localStorage.setItem("lumanet-users", JSON.stringify(defaultUsers))
      }
    }

    initializeUsers()

    // Check for existing session
    const savedUser = localStorage.getItem("lumanet-current-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error loading saved user:", error)
        localStorage.removeItem("lumanet-current-user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("lumanet-users") || "[]")
    const foundUser = users.find((u: User) => u.email === email && u.password === password)

    if (foundUser && foundUser.status === "active") {
      setUser(foundUser)
      localStorage.setItem("lumanet-current-user", JSON.stringify(foundUser))
      return true
    }
    return false
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("lumanet-current-user")
  }

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    if (user.role === "admin") return true
    return user.permissions.includes(permission)
  }

  return (
    <AuthContext.Provider value={{ user, login, signOut, hasPermission, loading }}>{children}</AuthContext.Provider>
  )
}
