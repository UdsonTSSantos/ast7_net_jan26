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
import { Software } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

export default function Softwares() {
  const { softwares, addSoftware, deleteItem } = useData()
  const { user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm<Software>()
  const { toast } = useToast()

  const onSubmit = (data: Software) => {
    // Basic validation for negative numbers
    if (
      data.preco_unitario < 0 ||
      data.preco_rede < 0 ||
      data.preco_cloud < 0
    ) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Preços não podem ser negativos',
      })
      return
    }

    const newSoftware = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      preco_unitario: Number(data.preco_unitario),
      preco_rede: Number(data.preco_rede),
      preco_cloud: Number(data.preco_cloud),
    }
    addSoftware(newSoftware)
    setIsDialogOpen(false)
    reset()
    toast({ title: 'Software cadastrado com sucesso' })
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      deleteItem('software', id)
      toast({ title: 'Excluído com sucesso' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Softwares
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Novo Software
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Software</DialogTitle>
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
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco_unitario">Preço Unit.</Label>
                  <Input
                    type="number"
                    step="0.01"
                    id="preco_unitario"
                    {...register('preco_unitario', { required: true, min: 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preco_rede">Preço Rede</Label>
                  <Input
                    type="number"
                    step="0.01"
                    id="preco_rede"
                    {...register('preco_rede', { required: true, min: 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preco_cloud">Preço Cloud</Label>
                  <Input
                    type="number"
                    step="0.01"
                    id="preco_cloud"
                    {...register('preco_cloud', { required: true, min: 0 })}
                  />
                </div>
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
              <TableHead>Unitário</TableHead>
              <TableHead>Rede</TableHead>
              <TableHead>Cloud</TableHead>
              {user?.role === 'admin' && (
                <TableHead className="w-[50px]"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {softwares.map((sw) => (
              <TableRow key={sw.id}>
                <TableCell className="font-medium">{sw.nome}</TableCell>
                <TableCell>{sw.descricao}</TableCell>
                <TableCell>R$ {sw.preco_unitario}</TableCell>
                <TableCell>R$ {sw.preco_rede}</TableCell>
                <TableCell>R$ {sw.preco_cloud}</TableCell>
                {user?.role === 'admin' && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(sw.id)}
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
