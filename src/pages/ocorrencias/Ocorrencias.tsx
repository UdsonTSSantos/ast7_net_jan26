import { useState } from 'react'
import { useData } from '@/contexts/DataContext'
import { Button } from '@/components/ui/button'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Plus, CheckCircle, Clock } from 'lucide-react'
import { format, isPast } from 'date-fns'

export default function Ocorrencias() {
  const { occurrences, clients, addOccurrence, updateOccurrence } = useData()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  // New Occurrence State
  const [clientId, setClientId] = useState('')
  const [solicitante, setSolicitante] = useState('')
  const [telefone, setTelefone] = useState('')
  const [descricao, setDescricao] = useState('')
  const [prazo, setPrazo] = useState('')

  const filteredOccurrences = occurrences
    .filter((o) => (filterStatus === 'all' ? true : o.status === filterStatus))
    .sort(
      (a, b) =>
        new Date(b.data_abertura).getTime() -
        new Date(a.data_abertura).getTime(),
    )

  const handleCreate = () => {
    addOccurrence({
      id: Math.random().toString(36).substr(2, 9),
      clientId,
      solicitante,
      telefone,
      descricao,
      status: 'aberta',
      data_abertura: new Date().toISOString(),
      prazo_cliente: new Date(prazo).toISOString(),
    })
    setIsDialogOpen(false)
    toast({ title: 'Ocorrência criada com sucesso' })
  }

  const handleStatusChange = (
    id: string,
    newStatus: 'aberta' | 'finalizada' | 'aguardando_retorno',
  ) => {
    const occ = occurrences.find((o) => o.id === id)
    if (occ) {
      updateOccurrence({ ...occ, status: newStatus })
      toast({ title: 'Status atualizado' })
    }
  }

  const getStatusBadge = (status: string, prazo: string) => {
    const isLate = isPast(new Date(prazo)) && status === 'aberta'

    let badge = <Badge variant="secondary">{status}</Badge>
    if (status === 'aberta')
      badge = (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">Aberta</Badge>
      )
    if (status === 'finalizada')
      badge = (
        <Badge className="bg-emerald-500 hover:bg-emerald-600">
          Finalizada
        </Badge>
      )
    if (status === 'aguardando_retorno')
      badge = (
        <Badge className="bg-blue-500 hover:bg-blue-600">Aguardando</Badge>
      )

    if (isLate) {
      return (
        <div className="flex items-center gap-2">
          {badge}{' '}
          <Badge variant="destructive" className="animate-pulse">
            Vencida
          </Badge>
        </div>
      )
    }
    return badge
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Ocorrências
        </h1>
        <div className="flex gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="aberta">Abertas</SelectItem>
              <SelectItem value="finalizada">Finalizadas</SelectItem>
              <SelectItem value="aguardando_retorno">Aguardando</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" /> Nova Ocorrência
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Abrir Ocorrência</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Select onValueChange={setClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nome_empresa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Solicitante</Label>
                  <Input
                    value={solicitante}
                    onChange={(e) => setSolicitante(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prazo</Label>
                  <Input
                    type="date"
                    value={prazo}
                    onChange={(e) => setPrazo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Input
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead className="w-[150px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOccurrences.map((occ) => {
              const client = clients.find((c) => c.id === occ.clientId)
              return (
                <TableRow key={occ.id}>
                  <TableCell className="font-medium">
                    {client?.nome_empresa}
                  </TableCell>
                  <TableCell>{occ.solicitante}</TableCell>
                  <TableCell>{occ.descricao}</TableCell>
                  <TableCell>
                    {getStatusBadge(occ.status, occ.prazo_cliente)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(occ.prazo_cliente), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {occ.status === 'aberta' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleStatusChange(occ.id, 'finalizada')
                          }
                          title="Finalizar"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleStatusChange(occ.id, 'aguardando_retorno')
                          }
                          title="Aguardar"
                        >
                          <Clock className="h-4 w-4 text-blue-600" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
            {filteredOccurrences.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-muted-foreground"
                >
                  Nenhuma ocorrência encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
