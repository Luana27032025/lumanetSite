"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { EditClientModal } from "@/components/edit-client-modal"
import type { Client } from "@/app/page"

interface ClientsTableProps {
  clients: Client[]
  onUpdateClient: (client: Client) => void
  onDeleteClient: (clientId: string) => void
  canEdit?: boolean
  canDelete?: boolean
}

export function ClientsTable({
  clients,
  onUpdateClient,
  onDeleteClient,
  canEdit = true,
  canDelete = true,
}: ClientsTableProps) {
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const handleDeleteClick = (clientId: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      onDeleteClient(clientId)
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">Nome</TableHead>
              <TableHead className="font-semibold text-gray-700">E-mail</TableHead>
              <TableHead className="font-semibold text-gray-700">CPF</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              {(canEdit || canDelete) && (
                <TableHead className="text-right font-semibold text-gray-700">Ações</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">{client.name}</TableCell>
                <TableCell className="text-gray-600">{client.email}</TableCell>
                <TableCell className="text-gray-600">{client.bi}</TableCell>
                <TableCell>
                  <Badge
                    variant={client.status === "Ativo" ? "default" : "secondary"}
                    className={
                      client.status === "Ativo"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {client.status}
                  </Badge>
                </TableCell>
                {(canEdit || canDelete) && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingClient(client)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(client.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingClient && (
        <EditClientModal
          client={editingClient}
          isOpen={!!editingClient}
          onClose={() => setEditingClient(null)}
          onUpdateClient={onUpdateClient}
        />
      )}
    </>
  )
}
