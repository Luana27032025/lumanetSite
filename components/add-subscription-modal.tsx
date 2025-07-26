"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Subscription, Client } from "@/app/page"

interface AddSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSubscription: (subscription: Omit<Subscription, "id">) => void
  clients: Client[]
}

const plans = [
  { name: "Básico 2Mbps", price: 15650 },
  { name: "Básico 4Mbps", price: 28952.05 },
  { name: "Premium 6Mbps", price: 39907.05 },
  { name: "Premium 8Mbps", price: 53210 },
  { name: "Enterprise 10Mbps", price: 66512.05 },
]

export function AddSubscriptionModal({ isOpen, onClose, onAddSubscription, clients }: AddSubscriptionModalProps) {
  const [formData, setFormData] = useState({
    clientId: "",
    plan: "",
    status: "Ativa" as "Ativa" | "Cancelada" | "Suspensa",
    startDate: "",
    endDate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedClient = clients.find((c) => c.id === formData.clientId)
    const selectedPlan = plans.find((p) => p.name === formData.plan)

    if (!selectedClient || !selectedPlan) return

    onAddSubscription({
      ...formData,
      clientName: selectedClient.name,
      price: selectedPlan.price,
    })

    setFormData({
      clientId: "",
      plan: "",
      status: "Ativa",
      startDate: "",
      endDate: "",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Assinatura</DialogTitle>
          <DialogDescription>Preencha os dados da nova assinatura.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client">Cliente</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients
                    .filter((client) => client.status === "Ativo")
                    .map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="plan">Plano</Label>
              <Select
                value={formData.plan}
                onValueChange={(value) => setFormData({ ...formData, plan: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.name} value={plan.name}>
                      {plan.name} - Kz {plan.price.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "Ativa" | "Cancelada" | "Suspensa") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativa">Ativa</SelectItem>
                  <SelectItem value="Suspensa">Suspensa</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">Data de Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
