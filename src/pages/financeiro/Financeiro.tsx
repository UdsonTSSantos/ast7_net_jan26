import { useState } from 'react'
import { useData } from '@/contexts/DataContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { Expense } from '@/lib/types'

export default function Financeiro() {
  const { expenses, addExpense } = useData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const [fornecedor, setFornecedor] = useState('')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState(0)
  const [vencimento, setVencimento] = useState('')
  const [pagamento, setPagamento] = useState('')
  const [metodo, setMetodo] = useState<
    'nubank_pf' | 'nubank_pj' | 'mercado_pago' | 'outro'
  >('outro')

  const totalExpenses = expenses.reduce((sum, item) => sum + item.valor, 0)

  const handleSubmit = () => {
    addExpense({
      id: Math.random().toString(36).substr(2, 9),
      fornecedor,
      descricao,
      valor,
      data_vencimento: new Date(vencimento).toISOString(),
      data_pagamento: pagamento ? new Date(pagamento).toISOString() : null,
      metodo_pagamento: metodo,
    })
    setIsDialogOpen(false)
    toast({ title: 'Despesa salva com sucesso' })
    // Reset form
    setFornecedor('')
    setDescricao('')
    setValor(0)
    setVencimento('')
    setPagamento('')
  }

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'nubank_pf':
        return 'Nubank PF'
      case 'nubank_pj':
        return 'Nubank PJ'
      case 'mercado_pago':
        return 'Mercado Pago'
      default:
        return 'Outro'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Financeiro
          </h1>
          <p className="text-muted-foreground">
            Total de Despesas: R$ {totalExpenses.toFixed(2)}
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Nova Despesa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lançar Despesa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Fornecedor</Label>
                <Input
                  value={fornecedor}
                  onChange={(e) => setFornecedor(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={valor}
                  onChange={(e) => setValor(Number(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vencimento</Label>
                  <Input
                    type="date"
                    value={vencimento}
                    onChange={(e) => setVencimento(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pagamento (Opcional)</Label>
                  <Input
                    type="date"
                    value={pagamento}
                    onChange={(e) => setPagamento(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Método</Label>
                <Select
                  value={metodo}
                  onValueChange={(val: any) => setMetodo(val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nubank_pf">Nubank PF</SelectItem>
                    <SelectItem value="nubank_pj">Nubank PJ</SelectItem>
                    <SelectItem value="mercado_pago">Mercado Pago</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Método</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell className="font-medium">{exp.fornecedor}</TableCell>
                <TableCell>{exp.descricao}</TableCell>
                <TableCell>
                  {format(new Date(exp.data_vencimento), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {exp.data_pagamento ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">
                      Pago
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pendente</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    {getMethodLabel(exp.metodo_pagamento)}
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold">
                  R$ {exp.valor.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
