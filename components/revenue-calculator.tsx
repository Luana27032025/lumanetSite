"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calculator, Plus, Trash2 } from "lucide-react"
import type { RevenueData, ExpenseCategory } from "@/app/page"

interface RevenueCalculatorProps {
  onAddRevenueData: (data: Omit<RevenueData, "id">) => void
  expenses: ExpenseCategory[]
  onUpdateExpenses: (expenses: ExpenseCategory[]) => void
}

const planPrices = {
  plan2Mbps: 15650.0,
  plan4Mbps: 28952.05,
  plan6Mbps: 39907.05,
  plan8Mbps: 53210.0,
  plan10Mbps: 66512.05,
}

export function RevenueCalculator({ onAddRevenueData, expenses, onUpdateExpenses }: RevenueCalculatorProps) {
  const [formData, setFormData] = useState({
    month: "",
    year: new Date().getFullYear(),
    quantities: {
      plan2Mbps: 0,
      plan4Mbps: 0,
      plan6Mbps: 0,
      plan8Mbps: 0,
      plan10Mbps: 0,
    },
  })

  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    type: "fixed" as "fixed" | "variable",
    description: "",
  })

  const calculateRevenue = () => {
    const basicPlans = {
      plan2Mbps: {
        quantity: formData.quantities.plan2Mbps,
        price: planPrices.plan2Mbps,
        total: formData.quantities.plan2Mbps * planPrices.plan2Mbps,
      },
      plan4Mbps: {
        quantity: formData.quantities.plan4Mbps,
        price: planPrices.plan4Mbps,
        total: formData.quantities.plan4Mbps * planPrices.plan4Mbps,
      },
    }

    const premiumPlans = {
      plan6Mbps: {
        quantity: formData.quantities.plan6Mbps,
        price: planPrices.plan6Mbps,
        total: formData.quantities.plan6Mbps * planPrices.plan6Mbps,
      },
      plan8Mbps: {
        quantity: formData.quantities.plan8Mbps,
        price: planPrices.plan8Mbps,
        total: formData.quantities.plan8Mbps * planPrices.plan8Mbps,
      },
    }

    const enterprisePlans = {
      plan10Mbps: {
        quantity: formData.quantities.plan10Mbps,
        price: planPrices.plan10Mbps,
        total: formData.quantities.plan10Mbps * planPrices.plan10Mbps,
      },
    }

    const totalRevenue =
      basicPlans.plan2Mbps.total +
      basicPlans.plan4Mbps.total +
      premiumPlans.plan6Mbps.total +
      premiumPlans.plan8Mbps.total +
      enterprisePlans.plan10Mbps.total

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const netRevenue = totalRevenue - totalExpenses

    return {
      basicPlans,
      premiumPlans,
      enterprisePlans,
      totalRevenue,
      expenses: totalExpenses,
      netRevenue,
      growth: 0, // Será calculado baseado em dados históricos
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.month) {
      const calculatedData = calculateRevenue()
      onAddRevenueData({
        month: formData.month,
        year: formData.year,
        ...calculatedData,
      })

      // Reset form
      setFormData({
        month: "",
        year: new Date().getFullYear(),
        quantities: {
          plan2Mbps: 0,
          plan4Mbps: 0,
          plan6Mbps: 0,
          plan8Mbps: 0,
          plan10Mbps: 0,
        },
      })
    }
  }

  const addExpense = () => {
    if (newExpense.name && newExpense.amount) {
      const expense: ExpenseCategory = {
        id: Date.now().toString(),
        name: newExpense.name,
        amount: Number.parseFloat(newExpense.amount),
        type: newExpense.type,
        description: newExpense.description,
      }
      onUpdateExpenses([...expenses, expense])
      setNewExpense({ name: "", amount: "", type: "fixed", description: "" })
    }
  }

  const removeExpense = (id: string) => {
    onUpdateExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const currentCalculation = calculateRevenue()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calculator className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900">Calculadora de Receita</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Cálculo */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Período</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="month">Mês</Label>
                  <Select value={formData.month} onValueChange={(value) => setFormData({ ...formData, month: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Janeiro">Janeiro</SelectItem>
                      <SelectItem value="Fevereiro">Fevereiro</SelectItem>
                      <SelectItem value="Março">Março</SelectItem>
                      <SelectItem value="Abril">Abril</SelectItem>
                      <SelectItem value="Maio">Maio</SelectItem>
                      <SelectItem value="Junho">Junho</SelectItem>
                      <SelectItem value="Julho">Julho</SelectItem>
                      <SelectItem value="Agosto">Agosto</SelectItem>
                      <SelectItem value="Setembro">Setembro</SelectItem>
                      <SelectItem value="Outubro">Outubro</SelectItem>
                      <SelectItem value="Novembro">Novembro</SelectItem>
                      <SelectItem value="Dezembro">Dezembro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="year">Ano</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Quantidade de Clientes por Plano</h3>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label>Básico 2Mbps (Kz 15.650,00)</Label>
                    <Input
                      type="number"
                      value={formData.quantities.plan2Mbps}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantities: { ...formData.quantities, plan2Mbps: Number.parseInt(e.target.value) || 0 },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Básico 4Mbps (Kz 28.952,05)</Label>
                    <Input
                      type="number"
                      value={formData.quantities.plan4Mbps}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantities: { ...formData.quantities, plan4Mbps: Number.parseInt(e.target.value) || 0 },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Premium 6Mbps (Kz 39.907,05)</Label>
                    <Input
                      type="number"
                      value={formData.quantities.plan6Mbps}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantities: { ...formData.quantities, plan6Mbps: Number.parseInt(e.target.value) || 0 },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Premium 8Mbps (Kz 53.210,00)</Label>
                    <Input
                      type="number"
                      value={formData.quantities.plan8Mbps}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantities: { ...formData.quantities, plan8Mbps: Number.parseInt(e.target.value) || 0 },
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Enterprise 10Mbps (Kz 66.512,05)</Label>
                    <Input
                      type="number"
                      value={formData.quantities.plan10Mbps}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantities: { ...formData.quantities, plan10Mbps: Number.parseInt(e.target.value) || 0 },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Calcular Receita
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Resultado do Cálculo */}
        <Card>
          <CardHeader>
            <CardTitle>Resultado do Cálculo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Receita Bruta</h4>
                <p className="text-2xl font-bold text-blue-600">
                  Kz {currentCalculation.totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-900">Total de Despesas</h4>
                <p className="text-2xl font-bold text-red-600">
                  Kz {currentCalculation.expenses.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Receita Líquida</h4>
                <p className="text-2xl font-bold text-green-600">
                  Kz {currentCalculation.netRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold">Detalhamento por Plano:</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Básico 2Mbps:</span>
                  <span>
                    Kz{" "}
                    {currentCalculation.basicPlans.plan2Mbps.total.toLocaleString("pt-AO", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Básico 4Mbps:</span>
                  <span>
                    Kz{" "}
                    {currentCalculation.basicPlans.plan4Mbps.total.toLocaleString("pt-AO", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Premium 6Mbps:</span>
                  <span>
                    Kz{" "}
                    {currentCalculation.premiumPlans.plan6Mbps.total.toLocaleString("pt-AO", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Premium 8Mbps:</span>
                  <span>
                    Kz{" "}
                    {currentCalculation.premiumPlans.plan8Mbps.total.toLocaleString("pt-AO", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Enterprise 10Mbps:</span>
                  <span>
                    Kz{" "}
                    {currentCalculation.enterprisePlans.plan10Mbps.total.toLocaleString("pt-AO", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestão de Despesas */}
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Despesas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Nome da despesa"
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Valor"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            />
            <Select
              value={newExpense.type}
              onValueChange={(value: "fixed" | "variable") => setNewExpense({ ...newExpense, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixa</SelectItem>
                <SelectItem value="variable">Variável</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addExpense} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-2">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{expense.name}</span>
                  <span className="ml-2 text-sm text-gray-500">({expense.type === "fixed" ? "Fixa" : "Variável"})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    Kz {expense.amount.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExpense(expense.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
