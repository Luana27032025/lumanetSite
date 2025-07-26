"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Target, Calendar, AlertTriangle } from "lucide-react"
import type { RevenueData } from "@/app/page"

interface RevenueProjectionsProps {
  revenueData: RevenueData[]
}

export function RevenueProjections({ revenueData }: RevenueProjectionsProps) {
  const [projectionParams, setProjectionParams] = useState({
    months: 6,
    growthRate: 10,
    newClientsPerMonth: 50,
    churnRate: 5,
  })

  const [scenario, setScenario] = useState<"conservative" | "realistic" | "optimistic">("realistic")

  const calculateProjections = () => {
    if (revenueData.length === 0) return []

    const lastPeriod = revenueData[revenueData.length - 1]
    const projections = []

    let currentRevenue = lastPeriod.totalRevenue
    let currentClients =
      lastPeriod.basicPlans.plan2Mbps.quantity +
      lastPeriod.basicPlans.plan4Mbps.quantity +
      lastPeriod.premiumPlans.plan6Mbps.quantity +
      lastPeriod.premiumPlans.plan8Mbps.quantity +
      lastPeriod.enterprisePlans.plan10Mbps.quantity

    const scenarioMultipliers = {
      conservative: 0.7,
      realistic: 1.0,
      optimistic: 1.3,
    }

    const multiplier = scenarioMultipliers[scenario]

    for (let i = 1; i <= projectionParams.months; i++) {
      // Calcular novos clientes considerando churn
      const newClients = Math.round(projectionParams.newClientsPerMonth * multiplier)
      const lostClients = Math.round(((currentClients * projectionParams.churnRate) / 100) * multiplier)
      currentClients = currentClients + newClients - lostClients

      // Calcular crescimento da receita
      const monthlyGrowth = (projectionParams.growthRate / 100) * multiplier
      currentRevenue = currentRevenue * (1 + monthlyGrowth / 12)

      // Estimar despesas (assumindo 60% da receita)
      const estimatedExpenses = currentRevenue * 0.6
      const netRevenue = currentRevenue - estimatedExpenses

      projections.push({
        month: i,
        totalRevenue: currentRevenue,
        netRevenue: netRevenue,
        totalClients: currentClients,
        newClients: newClients,
        lostClients: lostClients,
        growth: monthlyGrowth * 12, // Anualizado
      })
    }

    return projections
  }

  const projections = calculateProjections()
  const totalProjectedRevenue = projections.reduce((sum, proj) => sum + proj.totalRevenue, 0)
  const averageMonthlyGrowth =
    projections.length > 0 ? projections.reduce((sum, proj) => sum + proj.growth, 0) / projections.length : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900">Projeções de Receita</h2>
      </div>

      {/* Parâmetros de Projeção */}
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros de Projeção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="months">Período (meses)</Label>
              <Input
                id="months"
                type="number"
                value={projectionParams.months}
                onChange={(e) =>
                  setProjectionParams({
                    ...projectionParams,
                    months: Number.parseInt(e.target.value) || 6,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="growthRate">Taxa de Crescimento (%/ano)</Label>
              <Input
                id="growthRate"
                type="number"
                value={projectionParams.growthRate}
                onChange={(e) =>
                  setProjectionParams({
                    ...projectionParams,
                    growthRate: Number.parseFloat(e.target.value) || 10,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="newClients">Novos Clientes/Mês</Label>
              <Input
                id="newClients"
                type="number"
                value={projectionParams.newClientsPerMonth}
                onChange={(e) =>
                  setProjectionParams({
                    ...projectionParams,
                    newClientsPerMonth: Number.parseInt(e.target.value) || 50,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="churnRate">Taxa de Churn (%/mês)</Label>
              <Input
                id="churnRate"
                type="number"
                step="0.1"
                value={projectionParams.churnRate}
                onChange={(e) =>
                  setProjectionParams({
                    ...projectionParams,
                    churnRate: Number.parseFloat(e.target.value) || 5,
                  })
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="scenario">Cenário</Label>
            <Select
              value={scenario}
              onValueChange={(value: "conservative" | "realistic" | "optimistic") => setScenario(value)}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservador</SelectItem>
                <SelectItem value="realistic">Realista</SelectItem>
                <SelectItem value="optimistic">Otimista</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resumo das Projeções */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total Projetada</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Kz {totalProjectedRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Próximos {projectionParams.months} meses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{averageMonthlyGrowth.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Por ano</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cenário Atual</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scenario === "conservative" ? "Conservador" : scenario === "realistic" ? "Realista" : "Otimista"}
            </div>
            <p className="text-xs text-muted-foreground">
              Multiplicador: {scenario === "conservative" ? "0.7x" : scenario === "realistic" ? "1.0x" : "1.3x"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projeções Detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle>Projeções Mensais Detalhadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projections.map((projection) => (
              <div key={projection.month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Mês {projection.month}</h3>
                  <p className="text-sm text-gray-600">
                    Clientes: {projection.totalClients}
                    <span className="text-green-600"> (+{projection.newClients})</span>
                    <span className="text-red-600"> (-{projection.lostClients})</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    Kz {projection.totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600">
                    Líquida: Kz {projection.netRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Alertas e Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projectionParams.churnRate > 10 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">⚠️ Taxa de Churn Alta</p>
                <p className="text-red-700 text-sm">
                  Taxa de churn de {projectionParams.churnRate}% está acima do recomendado (5-8%). Considere melhorar a
                  retenção de clientes.
                </p>
              </div>
            )}

            {projectionParams.growthRate > 25 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium">⚠️ Crescimento Muito Otimista</p>
                <p className="text-yellow-700 text-sm">
                  Taxa de crescimento de {projectionParams.growthRate}% pode ser muito otimista. Considere um cenário
                  mais conservador.
                </p>
              </div>
            )}

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">💡 Recomendação</p>
              <p className="text-blue-700 text-sm">
                Para atingir essas projeções, foque em: reduzir churn, aumentar conversão de leads, e otimizar preços
                dos planos premium.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
