"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { User, Permission } from "@/types/user"

interface EditUserModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onUpdateUser: (user: User) => void
}

const availablePermissions: { id: Permission; label: string; description: string }[] = [
  { id: "view_dashboard", label: "Ver Dashboard", description: "Acesso à página inicial" },
  { id: "view_clients", label: "Ver Clientes", description: "Visualizar lista de clientes" },
  { id: "manage_clients", label: "Gerenciar Clientes", description: "Adicionar, editar e excluir clientes" },
  { id: "view_subscriptions", label: "Ver Assinaturas", description: "Visualizar assinaturas" },
  {
    id: "manage_subscriptions",
    label: "Gerenciar Assinaturas",
    description: "Adicionar, editar e excluir assinaturas",
  },
  { id: "view_invoices", label: "Ver Faturas", description: "Visualizar faturas" },
  { id: "manage_invoices", label: "Gerenciar Faturas", description: "Adicionar, editar e excluir faturas" },
  { id: "view_reports", label: "Ver Relatórios", description: "Acesso aos relatórios do sistema" },
  { id: "manage_users", label: "Gerenciar Usuários", description: "Adicionar, editar e excluir usuários" },
]

export function EditUserModal({ user, isOpen, onClose, onUpdateUser }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as "admin" | "user",
    status: "active" as "active" | "inactive",
    permissions: [] as Permission[],
  })

  const isDefaultAdmin = user?.email === "admin@lumanet.ao"

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        permissions: user.permissions,
      })
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // If admin role, grant all permissions
    const finalPermissions = formData.role === "admin" ? availablePermissions.map((p) => p.id) : formData.permissions

    onUpdateUser({
      ...user,
      ...formData,
      permissions: finalPermissions,
    })
    onClose()
  }

  const handlePermissionChange = (permission: Permission, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission],
      })
    } else {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter((p) => p !== permission),
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>Altere os dados do usuário.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isDefaultAdmin}
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
                disabled={isDefaultAdmin}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Função</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "user") => setFormData({ ...formData, role: value })}
                disabled={isDefaultAdmin}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
                disabled={isDefaultAdmin}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === "user" && !isDefaultAdmin && (
              <div className="grid gap-2">
                <Label>Permissões</Label>
                <div className="space-y-3 max-h-48 overflow-y-auto border rounded-md p-3">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={formData.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={permission.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.label}
                        </label>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isDefaultAdmin && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  Este é o usuário administrador padrão. Algumas configurações não podem ser alteradas.
                </p>
              </div>
            )}
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
