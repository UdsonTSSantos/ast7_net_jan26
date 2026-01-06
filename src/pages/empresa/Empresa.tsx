import { useData } from '@/contexts/DataContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

export default function Empresa() {
  const { company, updateCompany } = useData()
  const { toast } = useToast()

  const [nome, setNome] = useState(company.nome)
  const [cnpj, setCnpj] = useState(company.cnpj)
  const [logoUrl, setLogoUrl] = useState(company.logoUrl || '')

  const handleSave = () => {
    updateCompany({ nome, cnpj, logoUrl })
    toast({ title: 'Dados da empresa atualizados' })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Configurações da Empresa
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Identidade Visual</CardTitle>
          <CardDescription>
            Gerencie o nome e logo da empresa no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Empresa</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">URL do Logo (Simulando Upload)</Label>
            <Input
              id="logo"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
            />
            {logoUrl && (
              <div className="mt-4 p-4 border rounded flex justify-center bg-gray-50">
                <img
                  src={logoUrl}
                  alt="Preview"
                  className="h-16 object-contain"
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} className="bg-slate-900">
            Salvar Alterações
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
