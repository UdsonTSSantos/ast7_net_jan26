import { useData } from '@/contexts/DataContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { DollarSign, AlertCircle, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Index() {
  const { clientSoftwares, occurrences, softwares } = useData()

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  // Calculate Total Revenue
  const totalRevenue = clientSoftwares
    .filter((cs) => {
      const date = new Date(cs.data_aquisicao)
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      )
    })
    .reduce((sum, item) => sum + item.valor_pago, 0)

  // Calculate Active Occurrences
  const activeOccurrences = occurrences.filter(
    (o) => o.status === 'aberta',
  ).length

  // Prepare Chart Data
  const salesBySoftware = softwares.map((software) => {
    const count = clientSoftwares.filter(
      (cs) =>
        cs.softwareId === software.id &&
        new Date(cs.data_aquisicao).getMonth() === currentMonth &&
        new Date(cs.data_aquisicao).getFullYear() === currentYear,
    ).length
    return {
      name: software.nome,
      vendas: count,
    }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Dashboard
      </h1>
      <p className="text-muted-foreground">
        Visão geral de {format(new Date(), 'MMMM yyyy', { locale: ptBR })}
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Mensal
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R${' '}
              {totalRevenue.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Referente a licenças vendidas este mês
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ocorrências Ativas
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOccurrences}</div>
            <p className="text-xs text-muted-foreground">
              Chamados aguardando resolução
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Vendas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientSoftwares.length}</div>
            <p className="text-xs text-muted-foreground">
              Licenças ativas totais
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sistemas Vendidos (Mês Atual)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{
                vendas: {
                  label: 'Vendas',
                  color: 'hsl(var(--chart-1))',
                },
              }}
              className="h-[300px] w-full"
            >
              <BarChart data={salesBySoftware}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="vendas"
                  fill="var(--color-vendas)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
