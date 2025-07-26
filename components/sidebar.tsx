"use client"

import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, FileText, CreditCard, BarChart3 } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, hasPermission } = useAuth()

  if (!user) return null

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      permission: "view_dashboard",
    },
    {
      id: "clientes",
      label: "Clientes",
      icon: Users,
      permission: "view_clients",
    },
    {
      id: "assinaturas",
      label: "Assinaturas",
      icon: FileText,
      permission: "view_subscriptions",
    },
    {
      id: "faturas",
      label: "Faturas",
      icon: CreditCard,
      permission: "view_invoices",
    },
    {
      id: "relatorios",
      label: "Relatórios",
      icon: BarChart3,
      permission: "view_reports",
    },
  ]

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="flex-1 pt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const hasAccess = hasPermission(item.permission)
            const isActive = activeSection === item.id

            if (!hasAccess) return null

            return (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left font-normal px-6 py-3 rounded-none",
                    isActive
                      ? "bg-blue-800 text-white border-r-4 border-white"
                      : "text-blue-100 hover:bg-blue-800 hover:text-white",
                  )}
                  onClick={() => onSectionChange(item.id)}
                >
                  {isActive && <div className="w-2 h-2 bg-white rounded-full mr-3" />}
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
