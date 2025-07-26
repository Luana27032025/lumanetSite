"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { AddInvoiceModal } from "@/components/add-invoice-modal"
import { EditInvoiceModal } from "@/components/edit-invoice-modal"
import type { Invoice, Client } from "@/app/page"

interface InvoicesViewProps {
  invoices: Invoice[]
  clients: Client[]
  onUpdateInvoice: (invoice: Invoice) => void
  onAddInvoice: (invoice: Omit<Invoice, "id">) => void
  onDeleteInvoice: (invoiceId: string) => void
  canManage: boolean
}

export function InvoicesView({
  invoices,
  clients,
  onUpdateInvoice,
  onAddInvoice,
  onDeleteInvoice,
  canManage,
}: InvoicesViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteClick = (invoiceId: string) => {
    if (confirm("Tem certeza que deseja excluir esta fatura?")) {
      onDeleteInvoice(invoiceId)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paga":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paga</Badge>
      case "Pendente":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>
      case "Vencida":
        return <Badge variant="destructive">Vencida</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Faturas</h1>
        {canManage && (
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Fatura
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
              <TableHead className="font-semibold text-gray-700">Valor</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700">Data Vencimento</TableHead>
              <TableHead className="font-semibold text-gray-700">Data Emissão</TableHead>
              <TableHead className="font-semibold text-gray-700">Descrição</TableHead>
              {canManage && <TableHead className="text-right font-semibold text-gray-700">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">{invoice.clientName}</TableCell>
                <TableCell className="text-gray-600">
                  Kz {invoice.amount.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-gray-600">{new Date(invoice.dueDate).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell className="text-gray-600">
                  {new Date(invoice.issueDate).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="text-gray-600 max-w-xs truncate">{invoice.description}</TableCell>
                {canManage && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingInvoice(invoice)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(invoice.id)}
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
          <AddInvoiceModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddInvoice={onAddInvoice}
            clients={clients}
          />

          {editingInvoice && (
            <EditInvoiceModal
              invoice={editingInvoice}
              isOpen={!!editingInvoice}
              onClose={() => setEditingInvoice(null)}
              onUpdateInvoice={onUpdateInvoice}
              clients={clients}
            />
          )}
        </>
      )}
    </div>
  )
}
