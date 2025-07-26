"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import type { Client } from "@/app/page"

interface EditClientModalProps {
  client: Client
  isOpen: boolean
  onClose: () => void
  onUpdateClient: (client: Client) => void
}

export function EditClientModal({ client, isOpen, onClose, onUpdateClient }: EditClientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bi: "",
    status: "Ativo" as "Ativo" | "Inativo",
  })

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        bi: client.bi,
        status: client.status,
      })
    }
  }, [client])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateClient({ ...client, ...formData })
    onClose()
  }

  const formatBI = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()

    if (cleaned.length <= 9) {
      return cleaned
    } else if (cleaned.length <= 11) {
      return cleaned.slice(0, 9) + cleaned.slice(9)
    } else {
      return cleaned.slice(0, 9) + cleaned.slice(9, 11) + cleaned.slice(11, 14)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>Altere os dados do cliente.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bi">BI (Bilhete de Identidade)</Label>
              <Input
                id="bi"
                value={formData.bi}
                onChange={(e) => setFormData({ ...formData, bi: formatBI(e.target.value) })}
                placeholder="123456789LA041"
                maxLength={14}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "Ativo" | "Inativo") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
