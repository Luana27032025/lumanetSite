"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ClientsTable } from "@/components/clients-table"
import { AddClientModal } from "@/components/add-client-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Shield } from "lucide-react"
import { DashboardView } from "@/components/dashboard-view"
import { SubscriptionsView } from "@/components/subscriptions-view"
import { InvoicesView } from "@/components/invoices-view"
import { ReportsView } from "@/components/reports-view"
import { UsersView } from "@/components/users-view"
import { LoginForm } from "@/components/auth/login-form"
import { SaveIndicator } from "@/components/save-indicator"
import { useAuth } from "@/components/auth/auth-provider"
import { useDatabase } from "@/hooks/use-database"
import { DemoBanner } from "@/components/demo-banner"

export interface Client {
  id: string
  name: string
  email: string
  bi: string
  status: "Ativo" | "Inativo"
}

export interface Subscription {
  id: string
  clientId: string
  clientName: string
  plan: string
  price: number
  status: "Ativa" | "Cancelada" | "Suspensa"
  startDate: string
  endDate: string
}

export interface Invoice {
  id: string
  clientId: string
  clientName: string
  amount: number
  status: "Paga" | "Pendente" | "Vencida"
  dueDate: string
  issueDate: string
  description: string
}

export interface RevenueData {
  id: string
  month: string
  year: number
  basicPlans: number
  premiumPlans: number
  enterprisePlans: number
  totalRevenue: number
  expenses: number
  netRevenue: number
  growth: number
}

export interface ExpenseCategory {
  id: string
  name: string
  amount: number
  category: string
  date: string
}

export default function HomePage() {
  const { user, hasPermission } = useAuth()
  const {
    saveClient,
    loadClients,
    deleteClient,
    saveSubscription,
    loadSubscriptions,
    saveInvoice,
    loadInvoices,
    loading,
    error,
  } = useDatabase()

  const [clients, setClients] = useState<Client[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [initialData, setInitialData] = useState<{
    clients: Client[]
    subscriptions: Subscription[]
    invoices: Invoice[]
  }>({ clients: [], subscriptions: [], invoices: [] })

  // Load data on mount and when user changes
  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      const [clientsData, subscriptionsData, invoicesData] = await Promise.all([
        loadClients(),
        loadSubscriptions(),
        loadInvoices(),
      ])

      setClients(clientsData)
      setSubscriptions(subscriptionsData)
      setInvoices(invoicesData)
      setInitialData({
        clients: clientsData,
        subscriptions: subscriptionsData,
        invoices: invoicesData,
      })
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  // Check for unsaved changes
  useEffect(() => {
    const currentData = { clients, subscriptions, invoices }
    const hasChanges = JSON.stringify(currentData) !== JSON.stringify(initialData)
    setHasUnsavedChanges(hasChanges)
  }, [clients, subscriptions, invoices, initialData])

  // Save function
  const saveData = async () => {
    if (!hasUnsavedChanges) return

    try {
      // Save all changed data
      const currentData = { clients, subscriptions, invoices }
      const promises = []

      // Save clients that have changed
      for (const client of clients) {
        const initialClient = initialData.clients.find((c) => c.id === client.id)
        if (!initialClient || JSON.stringify(client) !== JSON.stringify(initialClient)) {
          promises.push(saveClient(client))
        }
      }

      // Save subscriptions that have changed
      for (const subscription of subscriptions) {
        const initialSubscription = initialData.subscriptions.find((s) => s.id === subscription.id)
        if (!initialSubscription || JSON.stringify(subscription) !== JSON.stringify(initialSubscription)) {
          promises.push(saveSubscription(subscription))
        }
      }

      // Save invoices that have changed
      for (const invoice of invoices) {
        const initialInvoice = initialData.invoices.find((i) => i.id === invoice.id)
        if (!initialInvoice || JSON.stringify(invoice) !== JSON.stringify(initialInvoice)) {
          promises.push(saveInvoice(invoice))
        }
      }

      await Promise.all(promises)
      setInitialData(currentData)
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error("Error saving data:", error)
      throw error
    }
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />
  }

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.bi.includes(searchTerm),
  )

  const handleAddClient = async (newClient: Omit<Client, "id">) => {
    if (!hasPermission("manage_clients")) {
      alert("Você não tem permissão para adicionar clientes.")
      return
    }

    const client: Client = {
      ...newClient,
      id: Date.now().toString(),
    }

    try {
      await saveClient(client)
      setClients([...clients, client])
      setIsAddModalOpen(false)
    } catch (error) {
      console.error("Error adding client:", error)
      alert("Erro ao adicionar cliente. Tente novamente.")
    }
  }

  const handleUpdateClient = async (updatedClient: Client) => {
    if (!hasPermission("manage_clients")) {
      alert("Você não tem permissão para editar clientes.")
      return
    }

    try {
      await saveClient(updatedClient)
      setClients(clients.map((client) => (client.id === updatedClient.id ? updatedClient : client)))
    } catch (error) {
      console.error("Error updating client:", error)
      alert("Erro ao atualizar cliente. Tente novamente.")
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!hasPermission("manage_clients")) {
      alert("Você não tem permissão para excluir clientes.")
      return
    }

    try {
      await deleteClient(clientId)
      setClients(clients.filter((client) => client.id !== clientId))
    } catch (error) {
      console.error("Error deleting client:", error)
      alert("Erro ao excluir cliente. Tente novamente.")
    }
  }

  const renderAccessDenied = (feature: string) => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Acesso Negado</h3>
        <p className="text-gray-600">Você não tem permissão para acessar {feature}.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <DemoBanner />
      <Header />

      <div className="flex">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        <main className="flex-1 p-6">
          {activeSection === "dashboard" &&
            (hasPermission("view_dashboard") ? (
              <DashboardView clients={clients} subscriptions={subscriptions} invoices={invoices} />
            ) : (
              renderAccessDenied("o dashboard")
            ))}

          {activeSection === "clientes" &&
            (hasPermission("view_clients") ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
                  {hasPermission("manage_clients") && (
                    <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Cliente
                    </Button>
                  )}
                </div>

                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <ClientsTable
                  clients={filteredClients}
                  onUpdateClient={handleUpdateClient}
                  onDeleteClient={handleDeleteClient}
                  canEdit={hasPermission("manage_clients")}
                  canDelete={hasPermission("manage_clients")}
                />
              </div>
            ) : (
              renderAccessDenied("a lista de clientes")
            ))}

          {activeSection === "assinaturas" &&
            (hasPermission("view_subscriptions") ? (
              <SubscriptionsView
                subscriptions={subscriptions}
                clients={clients}
                onUpdateSubscription={(updated) => {
                  if (!hasPermission("manage_subscriptions")) {
                    alert("Você não tem permissão para editar assinaturas.")
                    return
                  }
                  setSubscriptions(subscriptions.map((sub) => (sub.id === updated.id ? updated : sub)))
                }}
                onAddSubscription={(newSub) => {
                  if (!hasPermission("manage_subscriptions")) {
                    alert("Você não tem permissão para adicionar assinaturas.")
                    return
                  }
                  setSubscriptions([...subscriptions, { ...newSub, id: Date.now().toString() }])
                }}
                onDeleteSubscription={(id) => {
                  if (!hasPermission("manage_subscriptions")) {
                    alert("Você não tem permissão para excluir assinaturas.")
                    return
                  }
                  setSubscriptions(subscriptions.filter((sub) => sub.id !== id))
                }}
                canManage={hasPermission("manage_subscriptions")}
              />
            ) : (
              renderAccessDenied("as assinaturas")
            ))}

          {activeSection === "faturas" &&
            (hasPermission("view_invoices") ? (
              <InvoicesView
                invoices={invoices}
                clients={clients}
                onUpdateInvoice={(updated) => {
                  if (!hasPermission("manage_invoices")) {
                    alert("Você não tem permissão para editar faturas.")
                    return
                  }
                  setInvoices(invoices.map((inv) => (inv.id === updated.id ? updated : inv)))
                }}
                onAddInvoice={(newInv) => {
                  if (!hasPermission("manage_invoices")) {
                    alert("Você não tem permissão para adicionar faturas.")
                    return
                  }
                  setInvoices([...invoices, { ...newInv, id: Date.now().toString() }])
                }}
                onDeleteInvoice={(id) => {
                  if (!hasPermission("manage_invoices")) {
                    alert("Você não tem permissão para excluir faturas.")
                    return
                  }
                  setInvoices(invoices.filter((inv) => inv.id !== id))
                }}
                canManage={hasPermission("manage_invoices")}
              />
            ) : (
              renderAccessDenied("as faturas")
            ))}

          {activeSection === "relatorios" &&
            (hasPermission("view_reports") ? (
              <ReportsView clients={clients} subscriptions={subscriptions} invoices={invoices} />
            ) : (
              renderAccessDenied("os relatórios")
            ))}

          {activeSection === "usuarios" &&
            (hasPermission("manage_users") ? <UsersView /> : renderAccessDenied("a gestão de usuários"))}
        </main>
      </div>

      {/* Save Indicator */}
      <SaveIndicator onSave={saveData} hasUnsavedChanges={hasUnsavedChanges} />

      {hasPermission("manage_clients") && (
        <AddClientModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddClient={handleAddClient}
        />
      )}
    </div>
  )
}
