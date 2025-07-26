"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react"
import type { RevenueData, ExpenseCategory } from "@/app/page"

interface RevenueAnalyticsProps {
  revenueData: RevenueData[]
  expenses: ExpenseCategory[]
}

export function RevenueAnalytics({ revenueData, expenses }: RevenueAnalyticsProps) {
  const totalRevenue = revenueData.reduce((sum, data) => sum + data.totalRevenue, 0)
  const totalExpenses = revenueData.reduce((sum, data) => sum + data.expenses, 0)
  const totalNetRevenue = totalRevenue - totalExpenses
  const averageGrowth = revenueData.reduce((sum, data) => sum + data.growth, 0) / revenueData.length

  const totalClients = revenueData.reduce((sum, data) => {
    return (
      sum +
      data.basicPlans.plan2Mbps.quantity +
      data.basicPlans.plan4Mbps.quantity +
      data.premiumPlans.plan6Mbps.quantity +
      data.premiumPlans.plan8Mbps.quantity +
      data.enterprisePlans.plan10Mbps.quantity
    )
  }, 0)

  const averageRevenuePerClient = totalClients > 0 ? totalRevenue / totalClients : 0

  const planAnalysis = {
    basic2Mbps: {
      totalClients: revenueData.reduce((sum, data) => sum + data.basicPlans.plan2Mbps.quantity, 0),
      totalRevenue: revenueData.reduce((sum, data) => sum + data.basicPlans.plan2Mbps.total, 0),
    },
    basic4Mbps: {
      totalClients: revenueData.reduce((sum, data) => sum + data.basicPlans.plan4Mbps.quantity, 0),
      totalRevenue: revenueData.reduce((sum, data) => sum + data.basicPlans.plan4Mbps.total, 0),
    },
    premium6Mbps: {
      totalClients: revenueData.reduce((sum, data) => sum + data.premiumPlans.plan6Mbps.quantity, 0),
      totalRevenue: revenueData.reduce((sum, data) => sum + data.premiumPlans.plan6Mbps.total, 0),
    },
    premium8Mbps: {
      totalClients: revenueData.reduce((sum, data) => sum + data.premiumPlans.plan8Mbps.quantity, 0),
      totalRevenue: revenueData.reduce((sum, data) => sum + data.premiumPlans.plan8Mbps.total, 0),
    },
    enterprise10Mbps: {
      totalClients: revenueData.reduce((sum, data) => sum + data.enterprisePlans.plan10Mbps.quantity, 0),
      totalRevenue: revenueData.reduce((sum, data) => sum + data.enterprisePlans.plan10Mbps.total, 0),
    },
  }

  const profitMargin = totalRevenue > 0 ? (totalNetRevenue / totalRevenue) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900">Análises de Receita</h2>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Kz {totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Últimos {revenueData.length} períodos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Líquida</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Kz {totalNetRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Margem: {profitMargin.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Receita média: Kz {averageRevenuePerClient.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento Médio</CardTitle>
            {averageGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${averageGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {averageGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Por período</p>
          </CardContent>
        </Card>
      </div>

      {/* Análise por Planos */}
      <Card>
        <CardHeader>
          <CardTitle>Análise por Planos de Internet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Básico 2Mbps</h3>
              <p className="text-xl font-bold text-blue-600">{planAnalysis.basic2Mbps.totalClients}</p>
              <p className="text-sm text-blue-700">clientes</p>
              <p className="text-sm font-medium">
                Kz {planAnalysis.basic2Mbps.totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900">Básico 4Mbps</h3>
              <p className="text-xl font-bold text-green-600">{planAnalysis.basic4Mbps.totalClients}</p>
              <p className="text-sm text-green-700">clientes</p>
              <p className="text-sm font-medium">
                Kz {planAnalysis.basic4Mbps.totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900">Premium 6Mbps</h3>
              <p className="text-xl font-bold text-purple-600">{planAnalysis.premium6Mbps.totalClients}</p>
              <p className="text-sm text-purple-700">clientes</p>
              <p className="text-sm font-medium">
                Kz {planAnalysis.premium6Mbps.totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-900">Premium 8Mbps</h3>
              <p className="text-xl font-bold text-orange-600">{planAnalysis.premium8Mbps.totalClients}</p>
              <p className="text-sm text-orange-700">clientes</p>
              <p className="text-sm font-medium">
                Kz {planAnalysis.premium8Mbps.totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900">Enterprise 10Mbps</h3>
              <p className="text-xl font-bold text-red-600">{planAnalysis.enterprise10Mbps.totalClients}</p>
              <p className="text-sm text-red-700">clientes</p>
              <p className="text-sm font-medium">
                Kz {planAnalysis.enterprise10Mbps.totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Receita */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Receita por Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueData.map((data) => (
              <div key={data.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">
                    {data.month} {data.year}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Crescimento: {data.growth >= 0 ? "+" : ""}
                    {data.growth}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    Kz {data.totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600">
                    Líquida: Kz {data.netRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análise de Despesas */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Despesas Fixas</h3>
              <div className="space-y-2">
                {expenses
                  .filter((expense) => expense.type === "fixed")
                  .map((expense) => (
                    <div key={expense.id} className="flex justify-between p-2 bg-red-50 rounded">
                      <span className="text-sm">{expense.name}</span>
                      <span className="text-sm font-medium">
                        Kz {expense.amount.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Despesas Variáveis</h3>
              <div className="space-y-2">
                {expenses
                  .filter((expense) => expense.type === "variable")
                  .map((expense) => (
                    <div key={expense.id} className="flex justify-between p-2 bg-yellow-50 rounded">
                      <span className="text-sm">{expense.name}</span>
                      <span className="text-sm font-medium">
                        Kz {expense.amount.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
