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
import { useToast } from '@/hooks/use-toast'
import { Navigate } from 'react-router-dom'
import { User } from '@/lib/types'

export default function Usuarios() {
  const { user } = useAuth()
  const { users, addUser, deleteItem } = useData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  const handleSubmit = () => {
    if (!email.endsWith('@ast7.com.br')) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Domínio deve ser @ast7.com.br',
      })
      return
    }

    addUser({
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: 'user',
    })
    setIsDialogOpen(false)
    setName('')
    setEmail('')
    toast({ title: 'Usuário convidado' })
  }

  const handleDelete = (id: string) => {
    if (confirm('Remover usuário?')) {
      deleteItem('user', id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Gerenciar Usuários
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email Corporativo</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ast7.com.br"
                />
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
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Suporte AST7</TableCell>
              <TableCell>suporte@ast7.com.br</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell></TableCell>
            </TableRow>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell className="capitalize">{u.role}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(u.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
