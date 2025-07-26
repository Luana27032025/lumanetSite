"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  CreditCard,
  Wifi,
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import type { Client, Subscription, Invoice } from "@/app/page"

interface DashboardViewProps {
  clients: Client[]
  subscriptions: Subscription[]
  invoices: Invoice[]
}

export function DashboardView({ clients, subscriptions, invoices }: DashboardViewProps) {
  const activeClients = clients.filter((client) => client.status === "Ativo").length
  const totalRevenue = invoices
    .filter((invoice) => invoice.status === "Paga")
    .reduce((sum, invoice) => sum + invoice.amount, 0)
  const pendingInvoices = invoices.filter((invoice) => invoice.status === "Pendente").length
  const activeSubscriptions = subscriptions.filter((sub) => sub.status === "Ativa").length

  const recentActivities = [
    {
      id: 1,
      action: "Novo cliente cadastrado",
      client: "Amanda Souza",
      time: "2 horas atrás",
      type: "success",
      icon: CheckCircle,
    },
    {
      id: 2,
      action: "Fatura paga",
      client: "João Pereira",
      time: "4 horas atrás",
      type: "success",
      icon: DollarSign,
    },
    {
      id: 3,
      action: "Assinatura renovada",
      client: "Maria Oliveira",
      time: "1 dia atrás",
      type: "info",
      icon: Activity,
    },
    {
      id: 4,
      action: "Cliente desativado",
      client: "Lucas Santos",
      time: "2 dias atrás",
      type: "warning",
      icon: AlertCircle,
    },
    {
      id: 5,
      action: "Pagamento em atraso",
      client: "Ana Lima",
      time: "3 dias atrás",
      type: "error",
      icon: XCircle,
    },
  ]

  const plans = [
    {
      name: "Básico 2Mbps",
      price: 15650,
      subscribers: 45,
      growth: 12,
      color: "bg-blue-500",
      category: "Básico",
    },
    {
      name: "Básico 4Mbps",
      price: 28952.05,
      subscribers: 32,
      growth: 8,
      color: "bg-blue-600",
      category: "Básico",
    },
    {
      name: "Premium 6Mbps",
      price: 39907.05,
      subscribers: 28,
      growth: 15,
      color: "bg-green-500",
      category: "Premium",
    },
    {
      name: "Premium 8Mbps",
      price: 53210,
      subscribers: 18,
      growth: 22,
      color: "bg-green-600",
      category: "Premium",
    },
    {
      name: "Enterprise 10Mbps",
      price: 66512.05,
      subscribers: 12,
      growth: 35,
      color: "bg-purple-600",
      category: "Enterprise",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-500"
      case "info":
        return "text-blue-500"
      case "warning":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const clientGrowth = 15.2
  const revenueGrowth = 23.1
  const subscriptionGrowth = 8.7

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard LUMANET</h1>
            <p className="text-blue-100 text-lg">Visão geral completa do sistema de gestão</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Última atualização</p>
            <p className="text-white font-semibold">{new Date().toLocaleString("pt-BR")}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Clientes Ativos</CardTitle>
            <Users className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-white">{activeClients}</div>
            <div className="flex items-center space-x-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-200" />
              <span className="text-sm text-blue-100">+{clientGrowth}% este mês</span>
            </div>
            <p className="text-xs text-blue-100 mt-1">de {clients.length} clientes totais</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Assinaturas Ativas</CardTitle>
            <Wifi className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-white">{activeSubscriptions}</div>
            <div className="flex items-center space-x-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-200" />
              <span className="text-sm text-green-100">+{subscriptionGrowth}% este mês</span>
            </div>
            <p className="text-xs text-green-100 mt-1">planos em funcionamento</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Receita Total</CardTitle>
            <DollarSign className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-white">
              Kz {totalRevenue.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-200" />
              <span className="text-sm text-purple-100">+{revenueGrowth}% este mês</span>
            </div>
            <p className="text-xs text-purple-100 mt-1">faturas pagas este mês</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Faturas Pendentes</CardTitle>
            <CreditCard className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-white">{pendingInvoices}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Clock className="h-4 w-4 text-orange-200" />
              <span className="text-sm text-orange-100">aguardando pagamento</span>
            </div>
            <p className="text-xs text-orange-100 mt-1">requer atenção</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-gray-800">Atividades Recentes</CardTitle>
            </div>
            <CardDescription>Últimas ações no sistema LUMANET</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <Icon className={`h-4 w-4 ${getActivityIcon(activity.type)}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.client}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Plans Overview */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Wifi className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-gray-800">Planos de Internet</CardTitle>
            </div>
            <CardDescription>Performance dos pacotes disponíveis</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{plan.name}</p>
                      <p className="text-sm text-gray-600">
                        Kz {plan.price.toLocaleString("pt-AO", { minimumFractionDigits: 2 })}/mês
                      </p>
                    </div>
                    <Badge variant="secondary" className={`${plan.color} text-white border-0`}>
                      {plan.category}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Assinantes: {plan.subscribers}</span>
                      <span className="text-green-600 font-medium">+{plan.growth}%</span>
                    </div>
                    <Progress value={(plan.subscribers / 50) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-gray-800">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">87.5%</div>
            <p className="text-sm text-gray-600">Leads convertidos em clientes</p>
            <Progress value={87.5} className="mt-4" />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-gray-800">Satisfação do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">9.2/10</div>
            <p className="text-sm text-gray-600">Avaliação média dos clientes</p>
            <Progress value={92} className="mt-4" />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-gray-800">Uptime da Rede</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">99.8%</div>
            <p className="text-sm text-gray-600">Disponibilidade do serviço</p>
            <Progress value={99.8} className="mt-4" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
