"use client"

import { useState, useEffect } from "react"
import { supabase, isDemoMode } from "@/lib/supabase"
import { useAuth } from "@/components/auth/auth-provider"
import type { Client, Subscription, Invoice, RevenueData, ExpenseCategory } from "@/app/page"

export function useDatabase() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Demo data storage
  const getStorageKey = (table: string) => `lumanet_${table}_${user?.id || "demo"}`

  const saveToLocalStorage = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data))
    }
  }

  const loadFromLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    }
    return []
  }

  // Initialize demo data
  useEffect(() => {
    if (isDemoMode && user) {
      initializeDemoData()
    }
  }, [user])

  const initializeDemoData = () => {
    // Initialize with sample data if not exists
    const clientsKey = getStorageKey("clients")
    const existingClients = loadFromLocalStorage(clientsKey)

    if (existingClients.length === 0) {
      const sampleClients = [
        {
          id: "1",
          name: "Amanda Souza",
          email: "amanda.souza@email.com",
          bi: "123456789LA041",
          status: "Ativo",
        },
        {
          id: "2",
          name: "João Pereira",
          email: "joao.pereira@email.com",
          bi: "987654321LA042",
          status: "Inativo",
        },
      ]
      saveToLocalStorage(clientsKey, sampleClients)
    }
  }

  // Generic save function
  const saveData = async (table: string, data: any, transform?: (data: any) => any) => {
    if (!user) return
    setLoading(true)
    setError(null)

    try {
      if (isDemoMode) {
        // Save to localStorage in demo mode
        const key = getStorageKey(table)
        const existing = loadFromLocalStorage(key)
        const updated = existing.filter((item: any) => item.id !== data.id)
        updated.push(data)
        saveToLocalStorage(key, updated)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 200))
      } else {
        // Save to Supabase in production
        const transformedData = transform ? transform(data) : data
        const { error } = await supabase.from(table).upsert({
          ...transformedData,
          user_id: user.id,
          updated_at: new Date().toISOString(),
        })
        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Generic load function
  const loadData = async (table: string, transform?: (data: any) => any): Promise<any[]> => {
    if (!user) return []
    setLoading(true)
    setError(null)

    try {
      if (isDemoMode) {
        // Load from localStorage in demo mode
        const key = getStorageKey(table)
        const data = loadFromLocalStorage(key)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 100))

        return transform ? data.map(transform) : data
      } else {
        // Load from Supabase in production
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        return transform ? (data || []).map(transform) : data || []
      }
    } catch (err: any) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  // Clients
  const saveClient = async (client: Client) => {
    await saveData("clients", client)
  }

  const loadClients = async (): Promise<Client[]> => {
    return await loadData("clients")
  }

  const deleteClient = async (clientId: string) => {
    if (!user) return
    setLoading(true)
    setError(null)

    try {
      if (isDemoMode) {
        const key = getStorageKey("clients")
        const existing = loadFromLocalStorage(key)
        const filtered = existing.filter((item: any) => item.id !== clientId)
        saveToLocalStorage(key, filtered)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 200))
      } else {
        const { error } = await supabase.from("clients").delete().eq("id", clientId).eq("user_id", user.id)
        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Subscriptions
  const saveSubscription = async (subscription: Subscription) => {
    await saveData("subscriptions", subscription, (data) => ({
      id: data.id,
      client_id: data.clientId,
      client_name: data.clientName,
      plan: data.plan,
      price: data.price,
      status: data.status,
      start_date: data.startDate,
      end_date: data.endDate,
    }))
  }

  const loadSubscriptions = async (): Promise<Subscription[]> => {
    return await loadData("subscriptions", (item) => ({
      id: item.id,
      clientId: item.client_id || item.clientId,
      clientName: item.client_name || item.clientName,
      plan: item.plan,
      price: item.price,
      status: item.status,
      startDate: item.start_date || item.startDate,
      endDate: item.end_date || item.endDate,
    }))
  }

  // Invoices
  const saveInvoice = async (invoice: Invoice) => {
    await saveData("invoices", invoice, (data) => ({
      id: data.id,
      client_id: data.clientId,
      client_name: data.clientName,
      amount: data.amount,
      status: data.status,
      due_date: data.dueDate,
      issue_date: data.issueDate,
      description: data.description,
    }))
  }

  const loadInvoices = async (): Promise<Invoice[]> => {
    return await loadData("invoices", (item) => ({
      id: item.id,
      clientId: item.client_id || item.clientId,
      clientName: item.client_name || item.clientName,
      amount: item.amount,
      status: item.status,
      dueDate: item.due_date || item.dueDate,
      issueDate: item.issue_date || item.issueDate,
      description: item.description,
    }))
  }

  // Revenue Data
  const saveRevenueData = async (revenueData: RevenueData) => {
    await saveData("revenue_data", revenueData, (data) => ({
      id: data.id,
      month: data.month,
      year: data.year,
      basic_plans: data.basicPlans,
      premium_plans: data.premiumPlans,
      enterprise_plans: data.enterprisePlans,
      total_revenue: data.totalRevenue,
      expenses: data.expenses,
      net_revenue: data.netRevenue,
      growth: data.growth,
    }))
  }

  const loadRevenueData = async (): Promise<RevenueData[]> => {
    return await loadData("revenue_data", (item) => ({
      id: item.id,
      month: item.month,
      year: item.year,
      basicPlans: item.basic_plans || item.basicPlans,
      premiumPlans: item.premium_plans || item.premiumPlans,
      enterprisePlans: item.enterprise_plans || item.enterprisePlans,
      totalRevenue: item.total_revenue || item.totalRevenue,
      expenses: item.expenses,
      netRevenue: item.net_revenue || item.netRevenue,
      growth: item.growth,
    }))
  }

  // Expenses
  const saveExpense = async (expense: ExpenseCategory) => {
    await saveData("expenses", expense)
  }

  const loadExpenses = async (): Promise<ExpenseCategory[]> => {
    return await loadData("expenses")
  }

  const deleteExpense = async (expenseId: string) => {
    if (!user) return
    setLoading(true)
    setError(null)

    try {
      if (isDemoMode) {
        const key = getStorageKey("expenses")
        const existing = loadFromLocalStorage(key)
        const filtered = existing.filter((item: any) => item.id !== expenseId)
        saveToLocalStorage(key, filtered)

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 200))
      } else {
        const { error } = await supabase.from("expenses").delete().eq("id", expenseId).eq("user_id", user.id)
        if (error) throw error
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error: isDemoMode ? null : error, // Hide errors in demo mode
    // Clients
    saveClient,
    loadClients,
    deleteClient,
    // Subscriptions
    saveSubscription,
    loadSubscriptions,
    // Invoices
    saveInvoice,
    loadInvoices,
    // Revenue Data
    saveRevenueData,
    loadRevenueData,
    // Expenses
    saveExpense,
    loadExpenses,
    deleteExpense,
  }
}
