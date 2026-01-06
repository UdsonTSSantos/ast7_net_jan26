import { useParams } from 'react-router-dom'
import { useData } from '@/contexts/DataContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
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
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'

export default function ClienteDetail() {
  const { id } = useParams<{ id: string }>()
  const {
    clients,
    clientSoftwares,
    softwares,
    occurrences,
    addClientSoftware,
    addOccurrence,
  } = useData()
  const { toast } = useToast()

  const client = clients.find((c) => c.id === id)
  const mySoftwares = clientSoftwares.filter((cs) => cs.clientId === id)
  const myOccurrences = occurrences.filter((o) => o.clientId === id)

  const [softwareModalOpen, setSoftwareModalOpen] = useState(false)
  const [occurrenceModalOpen, setOccurrenceModalOpen] = useState(false)

  const [selectedSoftwareId, setSelectedSoftwareId] = useState('')
  const [selectedLicenceType, setSelectedLicenceType] = useState<
    'unitario' | 'rede' | 'cloud'
  >('unitario')
  const [licenceValue, setLicenceValue] = useState(0)

  // Occurrence Form State
  const [solicitante, setSolicitante] = useState('')
  const [telefone, setTelefone] = useState('')
  const [descricao, setDescricao] = useState('')
  const [prazo, setPrazo] = useState('')

  if (!client) return <div>Cliente não encontrado</div>

  const handleSoftwareSelect = (swId: string) => {
    setSelectedSoftwareId(swId)
    const sw = softwares.find((s) => s.id === swId)
    if (sw) {
      updateValue(sw, selectedLicenceType)
    }
  }

  const handleTypeSelect = (type: 'unitario' | 'rede' | 'cloud') => {
    setSelectedLicenceType(type)
    const sw = softwares.find((s) => s.id === selectedSoftwareId)
    if (sw) {
      updateValue(sw, type)
    }
  }

  const updateValue = (sw: any, type: string) => {
    if (type === 'unitario') setLicenceValue(sw.preco_unitario)
    if (type === 'rede') setLicenceValue(sw.preco_rede)
    if (type === 'cloud') setLicenceValue(sw.preco_cloud)
  }

  const handleAddSoftware = () => {
    if (!selectedSoftwareId) return
    addClientSoftware({
      id: Math.random().toString(36).substr(2, 9),
      clientId: client.id,
      softwareId: selectedSoftwareId,
      tipo_licenca: selectedLicenceType,
      valor_pago: licenceValue,
      data_aquisicao: new Date().toISOString(),
    })
    setSoftwareModalOpen(false)
    toast({ title: 'Software vinculado com sucesso' })
  }

  const handleAddOccurrence = () => {
    addOccurrence({
      id: Math.random().toString(36).substr(2, 9),
      clientId: client.id,
      solicitante,
      telefone,
      descricao,
      status: 'aberta',
      data_abertura: new Date().toISOString(),
      prazo_cliente: new Date(prazo).toISOString(),
    })
    setOccurrenceModalOpen(false)
    toast({ title: 'Ocorrência criada com sucesso' })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberta':
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Aberta</Badge>
        )
      case 'finalizada':
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600">
            Finalizada
          </Badge>
        )
      case 'aguardando_retorno':
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Aguardando</Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {client.nome_empresa}
        </h1>
        <div className="flex gap-2">
          <Dialog open={softwareModalOpen} onOpenChange={setSoftwareModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Vincular Software
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Vincular Software</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Software</Label>
                  <Select onValueChange={handleSoftwareSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um software" />
                    </SelectTrigger>
                    <SelectContent>
                      {softwares.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Licença</Label>
                  <Select
                    value={selectedLicenceType}
                    onValueChange={(val: any) => handleTypeSelect(val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unitario">Unitário</SelectItem>
                      <SelectItem value="rede">Rede</SelectItem>
                      <SelectItem value="cloud">Cloud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor Pago (R$)</Label>
                  <Input
                    type="number"
                    value={licenceValue}
                    onChange={(e) => setLicenceValue(Number(e.target.value))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddSoftware}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={occurrenceModalOpen}
            onOpenChange={setOccurrenceModalOpen}
          >
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
                  <Label>Solicitante</Label>
                  <Input
                    value={solicitante}
                    onChange={(e) => setSolicitante(e.target.value)}
                    placeholder="Nome de quem pediu"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(00) 00000-0000"
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
                    placeholder="Descreva o problema"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddOccurrence}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Softwares Adquiridos</CardTitle>
            <CardDescription>Licenças ativas para este cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Software</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mySoftwares.map((cs) => {
                  const sw = softwares.find((s) => s.id === cs.softwareId)
                  return (
                    <TableRow key={cs.id}>
                      <TableCell>{sw?.nome}</TableCell>
                      <TableCell className="capitalize">
                        {cs.tipo_licenca}
                      </TableCell>
                      <TableCell>R$ {cs.valor_pago}</TableCell>
                    </TableRow>
                  )
                })}
                {mySoftwares.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Nenhum software.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Ocorrências</CardTitle>
            <CardDescription>Chamados técnicos</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myOccurrences.map((occ) => (
                  <TableRow key={occ.id}>
                    <TableCell>
                      {format(new Date(occ.data_abertura), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{occ.solicitante}</TableCell>
                    <TableCell>{getStatusBadge(occ.status)}</TableCell>
                  </TableRow>
                ))}
                {myOccurrences.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Nenhuma ocorrência.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
