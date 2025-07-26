"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, FileText } from "lucide-react"
import type { Client, Subscription, Invoice } from "@/app/page"

interface ReportsViewProps {
  clients: Client[]
  subscriptions: Subscription[]
  invoices: Invoice[]
}

export function ReportsView({ clients, subscriptions, invoices }: ReportsViewProps) {
  const totalRevenue = invoices
    .filter((invoice) => invoice.status === "Paga")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  const pendingRevenue = invoices
    .filter((invoice) => invoice.status === "Pendente")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  const activeClients = clients.filter((client) => client.status === "Ativo").length
  const activeSubscriptions = subscriptions.filter((sub) => sub.status === "Ativa").length

  const monthlyData = [
    { month: "Jan", revenue: 450000, clients: 45 },
    { month: "Fev", revenue: 520000, clients: 52 },
    { month: "Mar", revenue: 480000, clients: 48 },
    { month: "Abr", revenue: 610000, clients: 61 },
    { month: "Mai", revenue: 580000, clients: 58 },
    { month: "Jun", revenue: 720000, clients: 72 },
  ]

  const planDistribution = [
    { plan: "Básico 2Mbps", count: 25, percentage: 35 },
    { plan: "Básico 4Mbps", count: 18, percentage: 25 },
    { plan: "Premium 6Mbps", count: 15, percentage: 21 },
    { plan: "Premium 8Mbps", count: 10, percentage: 14 },
    { plan: "Enterprise 10Mbps", count: 4, percentage: 5 },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600 mt-2">Análise detalhada do desempenho do sistema</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Kz {totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">+20.1% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Pendente</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Kz {pendingRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando pagamento</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground">+12% crescimento mensal</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Taxa de retenção: 95%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <CardTitle>Performance Mensal</CardTitle>
            </div>
            <CardDescription>Receita e crescimento de clientes por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <div className="text-right">
                      <div className="font-semibold">Kz {data.revenue.toLocaleString("pt-AO")}</div>
                      <div className="text-xs text-gray-500">{data.clients} clientes</div>
                    </div>
                  </div>
                  <Progress value={(data.revenue / 800000) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle>Distribuição de Planos</CardTitle>
            </div>
            <CardDescription>Popularidade dos planos de internet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planDistribution.map((plan, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{plan.plan}</span>
                    <div className="text-right">
                      <span className="font-semibold">{plan.count} clientes</span>
                      <span className="text-xs text-gray-500 ml-2">({plan.percentage}%)</span>
                    </div>
                  </div>
                  <Progress value={plan.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">87.5%</div>
            <p className="text-sm text-gray-600">Leads convertidos em clientes</p>
            <Progress value={87.5} className="mt-4" />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Churn Rate</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">2.3%</div>
            <p className="text-sm text-gray-600">Taxa de cancelamento mensal</p>
            <Progress value={2.3} className="mt-4" />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">ARPU</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">Kz 42.5K</div>
            <p className="text-sm text-gray-600">Receita média por usuário</p>
            <Progress value={75} className="mt-4" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
