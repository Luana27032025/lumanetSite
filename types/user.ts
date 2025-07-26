export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "admin" | "user"
  status: "active" | "inactive"
  permissions: Permission[]
  createdAt: string
}

export type Permission =
  | "view_dashboard"
  | "view_clients"
  | "manage_clients"
  | "view_subscriptions"
  | "manage_subscriptions"
  | "view_invoices"
  | "manage_invoices"
  | "view_reports"
  | "manage_users"

export const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  VIEW_CLIENTS: "view_clients",
  MANAGE_CLIENTS: "manage_clients",
  VIEW_SUBSCRIPTIONS: "view_subscriptions",
  MANAGE_SUBSCRIPTIONS: "manage_subscriptions",
  VIEW_INVOICES: "view_invoices",
  MANAGE_INVOICES: "manage_invoices",
  VIEW_REPORTS: "view_reports",
  MANAGE_USERS: "manage_users",
}

export const DEFAULT_ADMIN_PERMISSIONS = Object.values(PERMISSIONS)
export const DEFAULT_USER_PERMISSIONS = [
  PERMISSIONS.VIEW_DASHBOARD,
  PERMISSIONS.VIEW_CLIENTS,
  PERMISSIONS.VIEW_SUBSCRIPTIONS,
  PERMISSIONS.VIEW_INVOICES,
]
