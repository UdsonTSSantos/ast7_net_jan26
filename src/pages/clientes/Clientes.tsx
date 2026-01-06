import { useState } from 'react'
import { useData } from '@/contexts/DataContext'
import { Link } from 'react-router-dom'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Search, Eye } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Client } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

export default function Clientes() {
  const { clients, addClient } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm<Client>()
  const { toast } = useToast()

  const filteredClients = clients.filter(
    (client) =>
      client.nome_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contato_empresa.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const onSubmit = (data: Client) => {
    const newClient = { ...data, id: Math.random().toString(36).substr(2, 9) }
    addClient(newClient)
    setIsDialogOpen(false)
    reset()
    toast({ title: 'Cliente cadastrado com sucesso' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Clientes
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome_empresa">Nome da Empresa</Label>
                <Input
                  id="nome_empresa"
                  {...register('nome_empresa', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contato_empresa">Contato</Label>
                <Input
                  id="contato_empresa"
                  {...register('contato_empresa', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  {...register('whatsapp', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { required: true })}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por empresa ou contato..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {client.nome_empresa}
                </TableCell>
                <TableCell>{client.contato_empresa}</TableCell>
                <TableCell>{client.whatsapp}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/clientes/${client.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredClients.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center h-24 text-muted-foreground"
                >
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
