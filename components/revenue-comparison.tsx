"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GitCompare, TrendingUp, TrendingDown, BarChart } from "lucide-react"
import type { RevenueData } from "@/app/page"

interface RevenueComparisonProps {
  revenueData: RevenueData[]
}

export function RevenueComparison({ revenueData }: RevenueComparisonProps) {
  const [comparisonType, setComparisonType] = useState<"month" | "year" | "plan">("month")
  const [selectedPeriod1, setSelectedPeriod1] = useState("")
  const [selectedPeriod2, setSelectedPeriod2] = useState("")

  const getComparisonData = () => {
    if (!selectedPeriod1 || !selectedPeriod2) return null

    const period1 = revenueData.find((data) => `${data.month}-${data.year}` === selectedPeriod1)
    const period2 = revenueData.find((data) => `${data.month}-${data.year}` === selectedPeriod2)

    if (!period1 || !period2) return null

    const calculateDifference = (value1: number, value2: number) => {
      const diff = value1 - value2
      const percentage = value2 !== 0 ? (diff / value2) * 100 : 0
      return { absolute: diff, percentage }
    }

    return {
      period1,
      period2,
      totalRevenue: calculateDifference(period1.totalRevenue, period2.totalRevenue),
      netRevenue: calculateDifference(period1.netRevenue, period2.netRevenue),
      expenses: calculateDifference(period1.expenses, period2.expenses),
      totalClients: calculateDifference(
        period1.basicPlans.plan2Mbps.quantity +
          period1.basicPlans.plan4Mbps.quantity +
          period1.premiumPlans.plan6Mbps.quantity +
          period1.premiumPlans.plan8Mbps.quantity +
          period1.enterprisePlans.plan10Mbps.quantity,
        period2.basicPlans.plan2Mbps.quantity +
          period2.basicPlans.plan4Mbps.quantity +
          period2.premiumPlans.plan6Mbps.quantity +
          period2.premiumPlans.plan8Mbps.quantity +
          period2.enterprisePlans.plan10Mbps.quantity,
      ),
      planComparison: {
        basic2Mbps: calculateDifference(period1.basicPlans.plan2Mbps.total, period2.basicPlans.plan2Mbps.total),
        basic4Mbps: calculateDifference(period1.basicPlans.plan4Mbps.total, period2.basicPlans.plan4Mbps.total),
        premium6Mbps: calculateDifference(period1.premiumPlans.plan6Mbps.total, period2.premiumPlans.plan6Mbps.total),
        premium8Mbps: calculateDifference(period1.premiumPlans.plan8Mbps.total, period2.premiumPlans.plan8Mbps.total),
        enterprise10Mbps: calculateDifference(
          period1.enterprisePlans.plan10Mbps.total,
          period2.enterprisePlans.plan10Mbps.total,
        ),
      },
    }
  }

  const comparisonData = getComparisonData()

  const formatDifference = (diff: { absolute: number; percentage: number }, isMonetary = true) => {
    const prefix = diff.absolute >= 0 ? "+" : ""
    const color = diff.absolute >= 0 ? "text-green-600" : "text-red-600"
    const icon = diff.absolute >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />

    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span>
          {prefix}
          {isMonetary
            ? `Kz ${diff.absolute.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}`
            : diff.absolute.toFixed(0)}
        </span>
        <span className="text-sm">
          ({prefix}
          {diff.percentage.toFixed(1)}%)
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <GitCompare className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900">Comparação de Receitas</h2>
      </div>

      {/* Controles de Comparação */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Períodos para Comparação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Período 1</label>
              <Select value={selectedPeriod1} onValueChange={setSelectedPeriod1}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o primeiro período" />
                </SelectTrigger>
                <SelectContent>
                  {revenueData.map((data) => (
                    <SelectItem key={data.id} value={`${data.month}-${data.year}`}>
                      {data.month} {data.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Período 2</label>
              <Select value={selectedPeriod2} onValueChange={setSelectedPeriod2}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o segundo período" />
                </SelectTrigger>
                <SelectContent>
                  {revenueData.map((data) => (
                    <SelectItem key={data.id} value={`${data.month}-${data.year}`}>
                      {data.month} {data.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  /* Trigger comparison */
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!selectedPeriod1 || !selectedPeriod2}
              >
                <BarChart className="w-4 h-4 mr-2" />
                Comparar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados da Comparação */}
      {comparisonData && (
        <>
          {/* Comparação Geral */}
          <Card>
            <CardHeader>
              <CardTitle>
                Comparação: {comparisonData.period1.month} {comparisonData.period1.year} vs{" "}
                {comparisonData.period2.month} {comparisonData.period2.year}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Receita Total</h3>
                  <p className="text-lg font-bold mb-1">
                    Kz {comparisonData.period1.totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">vs</p>
                  <p className="text-lg font-bold mb-2">
                    Kz {comparisonData.period2.totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                  </p>
                  {formatDifference(comparisonData.totalRevenue)}
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Receita Líquida</h3>
                  <p className="text-lg font-bold mb-1">
                    Kz {comparisonData.period1.netRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">vs</p>
                  <p className="text-lg font-bold mb-2">
                    Kz {comparisonData.period2.netRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                  </p>
                  {formatDifference(comparisonData.netRevenue)}
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Despesas</h3>
                  <p className="text-lg font-bold mb-1">
                    Kz {comparisonData.period1.expenses.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">vs</p>
                  <p className="text-lg font-bold mb-2">
                    Kz {comparisonData.period2.expenses.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                  </p>
                  {formatDifference(comparisonData.expenses)}
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Total de Clientes</h3>
                  <p className="text-lg font-bold mb-1">
                    {(
                      comparisonData.period1.basicPlans.plan2Mbps.quantity +
                      comparisonData.period1.basicPlans.plan4Mbps.quantity +
                      comparisonData.period1.premiumPlans.plan6Mbps.quantity +
                      comparisonData.period1.premiumPlans.plan8Mbps.quantity +
                      comparisonData.period1.enterprisePlans.plan10Mbps.quantity
                    ).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">vs</p>
                  <p className="text-lg font-bold mb-2">
                    {(
                      comparisonData.period2.basicPlans.plan2Mbps.quantity +
                      comparisonData.period2.basicPlans.plan4Mbps.quantity +
                      comparisonData.period2.premiumPlans.plan6Mbps.quantity +
                      comparisonData.period2.premiumPlans.plan8Mbps.quantity +
                      comparisonData.period2.enterprisePlans.plan10Mbps.quantity
                    ).toLocaleString()}
                  </p>
                  {formatDifference(comparisonData.totalClients, false)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparação por Planos */}
          <Card>
            <CardHeader>
              <CardTitle>Comparação por Planos de Internet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 text-sm">Básico 2Mbps</h4>
                    <p className="text-sm font-bold">
                      Kz{" "}
                      {comparisonData.period1.basicPlans.plan2Mbps.total.toLocaleString("pt-AO", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-600">vs</p>
                    <p className="text-sm font-bold">
                      Kz{" "}
                      {comparisonData.period2.basicPlans.plan2Mbps.total.toLocaleString("pt-AO", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <div className="mt-1">{formatDifference(comparisonData.planComparison.basic2Mbps)}</div>
                  </div>

                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 text-sm">Básico 4Mbps</h4>
                    <p className="text-sm font-bold">
                      Kz{" "}
                      {comparisonData.period1.basicPlans.plan4Mbps.total.toLocaleString("pt-AO", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-600">vs</p>
                    <p className="text-sm font-bold">
                      Kz{" "}
                      {comparisonData.period2.basicPlans.plan4Mbps.total.toLocaleString("pt-AO", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <div className="mt-1">{formatDifference(comparisonData.planComparison.basic4Mbps)}</div>
                  </div>

                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 text-sm">Premium 6Mbps</h4>
                    <p className="text-sm font-bold">
                      Kz{" "}
                      {comparisonData.period1.premiumPlans.plan6Mbps.total.toLocaleString("pt-AO", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-600">vs</p>
                    <p className="text-sm font-bold">
                      Kz{" "}
                      {comparisonData.period2.premiumPlans.plan6Mbps.total.toLocaleString("pt-AO", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <div className="mt-1">{formatDifference(comparisonData.planComparison.premium6Mbps)}</div>
                  </div>

                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-900 text-sm">Premium 8Mbps</h4>
                    <p className="text-sm font-bold">
                      Kz{" "}
                      {comparisonData.period1.premiumPlans.plan8Mbps.total.toLocaleString("pt-AO", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-600">vs</p>
                    <p className="text-sm font-bold">
                      Kz{" "}
                      {comparisonData.period2.premiumPlans.plan8Mbps.total.toLocaleString("pt-AO", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <div className="mt-1">{formatDifference(comparisonData.planComparison.premium8Mbps)}</div>
                  </div>

                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-900 text-sm">Enterprise 10Mbps</h4>
                    <p className="text-sm font-bold">
                      Kz{" "}
                      {comparisonData.period1.enterprisePlans.plan10Mbps.total.toLocaleString("pt-AO", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-600">vs</p>
                    <p className="text-sm font-bold">
                      Kz{" "}
                      {comparisonData.period2.enterprisePlans.plan10Mbps.total.toLocaleString("pt-AO", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <div className="mt-1">{formatDifference(comparisonData.planComparison.enterprise10Mbps)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights da Comparação */}
          <Card>
            <CardHeader>
              <CardTitle>Insights da Comparação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {comparisonData.totalRevenue.percentage > 10 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">📈 Crescimento Excelente</p>
                    <p className="text-green-700 text-sm">
                      A receita cresceu {comparisonData.totalRevenue.percentage.toFixed(1)}% entre os períodos. Mantenha
                      as estratégias atuais!
                    </p>
                  </div>
                )}

                {comparisonData.totalRevenue.percentage < -5 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">📉 Queda na Receita</p>
                    <p className="text-red-700 text-sm">
                      A receita caiu {Math.abs(comparisonData.totalRevenue.percentage).toFixed(1)}% entre os períodos.
                      Revise as estratégias de marketing e retenção.
                    </p>
                  </div>
                )}

                {comparisonData.expenses.percentage > 15 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-medium">⚠️ Aumento de Despesas</p>
                    <p className="text-yellow-700 text-sm">
                      As despesas aumentaram {comparisonData.expenses.percentage.toFixed(1)}%. Analise os custos
                      operacionais para otimização.
                    </p>
                  </div>
                )}

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 font-medium">💡 Recomendação</p>
                  <p className="text-blue-700 text-sm">
                    {comparisonData.totalRevenue.percentage > 0
                      ? "Continue investindo nos planos que apresentaram maior crescimento."
                      : "Foque em estratégias de recuperação e análise de mercado para reverter a tendência."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Histórico de Comparações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueData.map((data, index) => {
              if (index === 0) return null
              const previousData = revenueData[index - 1]
              const growth = ((data.totalRevenue - previousData.totalRevenue) / previousData.totalRevenue) * 100

              return (
                <div key={data.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold">
                      {data.month} {data.year}
                    </h3>
                    <p className="text-sm text-gray-600">
                      vs {previousData.month} {previousData.year}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      Kz {data.totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                    </p>
                    <div
                      className={`flex items-center gap-1 text-sm ${growth >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>
                        {growth >= 0 ? "+" : ""}
                        {growth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
