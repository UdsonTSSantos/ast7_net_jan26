import { useState } from 'react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
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
import { Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Service } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

export default function Servicos() {
  const { services, addService, deleteItem } = useData()
  const { user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm<Service>()
  const { toast } = useToast()

  const onSubmit = (data: Service) => {
    if (data.preco < 0) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Preço não pode ser negativo',
      })
      return
    }
    const newService = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      preco: Number(data.preco),
    }
    addService(newService)
    setIsDialogOpen(false)
    reset()
    toast({ title: 'Serviço cadastrado com sucesso' })
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      deleteItem('service', id)
      toast({ title: 'Excluído com sucesso' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Serviços
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Serviço</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" {...register('nome', { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  {...register('descricao', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  id="preco"
                  {...register('preco', { required: true, min: 0 })}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Preço</TableHead>
              {user?.role === 'admin' && (
                <TableHead className="w-[50px]"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((svc) => (
              <TableRow key={svc.id}>
                <TableCell className="font-medium">{svc.nome}</TableCell>
                <TableCell>{svc.descricao}</TableCell>
                <TableCell>R$ {svc.preco}</TableCell>
                {user?.role === 'admin' && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(svc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
