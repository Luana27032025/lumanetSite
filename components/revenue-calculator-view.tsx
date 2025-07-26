"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, BarChart3, TrendingUp, GitCompare } from "lucide-react"
import { RevenueCalculator } from "./revenue-calculator"
import { RevenueAnalytics } from "./revenue-analytics"
import { RevenueProjections } from "./revenue-projections"
import { RevenueComparison } from "./revenue-comparison"
import type { RevenueData, ExpenseCategory, Client, Subscription, Invoice } from "@/app/page"

interface RevenueCalculatorViewProps {
  revenueData: RevenueData[]
  expenses: ExpenseCategory[]
  onAddRevenueData: (data: Omit<RevenueData, "id">) => void
  onUpdateExpenses: (expenses: ExpenseCategory[]) => void
  clients: Client[]
  subscriptions: Subscription[]
  invoices: Invoice[]
}

export function RevenueCalculatorView({
  revenueData,
  expenses,
  onAddRevenueData,
  onUpdateExpenses,
  clients,
  subscriptions,
  invoices,
}: RevenueCalculatorViewProps) {
  const [activeTab, setActiveTab] = useState("calculator")

  // Calcular métricas rápidas baseadas nos dados reais
  const totalRevenue = revenueData.reduce((sum, data) => sum + data.totalRevenue, 0)
  const totalClients = clients.length
  const activeClients = clients.filter((c) => c.status === "Ativo").length
  const activeSubscriptions = subscriptions.filter((s) => s.status === "Ativa").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">Calculadora de Receita</h2>
        </div>
        <div className="text-sm text-gray-600">Sistema integrado de análise financeira LUMANET</div>
      </div>

      {/* Cards de Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Receita Total</p>
              <p className="text-xl font-bold text-blue-600">
                Kz {totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Clientes Ativos</p>
              <p className="text-xl font-bold text-green-600">
                {activeClients} / {totalClients}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Assinaturas Ativas</p>
              <p className="text-xl font-bold text-purple-600">{activeSubscriptions}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Períodos Analisados</p>
              <p className="text-xl font-bold text-orange-600">{revenueData.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes funcionalidades */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Calculadora
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Análises
          </TabsTrigger>
          <TabsTrigger value="projections" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Projeções
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <GitCompare className="w-4 h-4" />
            Comparações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-6">
          <RevenueCalculator
            onAddRevenueData={onAddRevenueData}
            expenses={expenses}
            onUpdateExpenses={onUpdateExpenses}
          />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <RevenueAnalytics revenueData={revenueData} expenses={expenses} />
        </TabsContent>

        <TabsContent value="projections" className="mt-6">
          <RevenueProjections revenueData={revenueData} />
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <RevenueComparison revenueData={revenueData} />
        </TabsContent>
      </Tabs>

      {/* Integração com dados do sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Integração com Sistema Principal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Dados de Clientes</h3>
              <p className="text-sm text-blue-700">
                A calculadora utiliza automaticamente os dados de clientes cadastrados no sistema para análises mais
                precisas.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Assinaturas Ativas</h3>
              <p className="text-sm text-green-700">
                As informações de assinaturas são sincronizadas para calcular receitas baseadas em dados reais.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Histórico de Faturas</h3>
              <p className="text-sm text-purple-700">
                O histórico de faturas alimenta as análises de performance e projeções futuras.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
