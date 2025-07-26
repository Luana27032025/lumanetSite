"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { AddSubscriptionModal } from "@/components/add-subscription-modal"
import { EditSubscriptionModal } from "@/components/edit-subscription-modal"
import type { Subscription, Client } from "@/app/page"

interface SubscriptionsViewProps {
  subscriptions: Subscription[]
  clients: Client[]
  onUpdateSubscription: (subscription: Subscription) => void
  onAddSubscription: (subscription: Omit<Subscription, "id">) => void
  onDeleteSubscription: (subscriptionId: string) => void
  canManage: boolean
}

export function SubscriptionsView({
  subscriptions,
  clients,
  onUpdateSubscription,
  onAddSubscription,
  onDeleteSubscription,
  canManage,
}: SubscriptionsViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)

  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.plan.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteClick = (subscriptionId: string) => {
    if (confirm("Tem certeza que deseja excluir esta assinatura?")) {
      onDeleteSubscription(subscriptionId)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ativa":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativa</Badge>
      case "Cancelada":
        return <Badge variant="destructive">Cancelada</Badge>
      case "Suspensa":
        return <Badge variant="secondary">Suspensa</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Assinaturas</h1>
        {canManage && (
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Assinatura
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

      <div className="bg-white rounded-lg shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">Cliente</TableHead>
              <TableHead className="font-semibold text-gray-700">Plano</TableHead>
              <TableHead className="font-semibold text-gray-700">Preço</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700">Data Início</TableHead>
              <TableHead className="font-semibold text-gray-700">Data Fim</TableHead>
              {canManage && <TableHead className="text-right font-semibold text-gray-700">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.map((subscription) => (
              <TableRow key={subscription.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">{subscription.clientName}</TableCell>
                <TableCell className="text-gray-600">{subscription.plan}</TableCell>
                <TableCell className="text-gray-600">
                  Kz {subscription.price.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                <TableCell className="text-gray-600">
                  {new Date(subscription.startDate).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="text-gray-600">
                  {new Date(subscription.endDate).toLocaleDateString("pt-BR")}
                </TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSubscription(subscription)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(subscription.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {canManage && (
        <>
          <AddSubscriptionModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddSubscription={onAddSubscription}
            clients={clients}
          />

          {editingSubscription && (
            <EditSubscriptionModal
              subscription={editingSubscription}
              isOpen={!!editingSubscription}
              onClose={() => setEditingSubscription(null)}
              onUpdateSubscription={onUpdateSubscription}
              clients={clients}
            />
          )}
        </>
      )}
    </div>
  )
}
