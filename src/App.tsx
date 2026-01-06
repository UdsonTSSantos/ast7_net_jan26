import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/AuthContext'
import { DataProvider } from '@/contexts/DataContext'

import Login from './pages/Login'
import AppLayout from './components/AppLayout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Clientes from './pages/clientes/Clientes'
import ClienteDetail from './pages/clientes/ClienteDetail'
import Softwares from './pages/softwares/Softwares'
import Servicos from './pages/servicos/Servicos'
import Ocorrencias from './pages/ocorrencias/Ocorrencias'
import Financeiro from './pages/financeiro/Financeiro'
import Empresa from './pages/empresa/Empresa'
import Usuarios from './pages/usuarios/Usuarios'

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
  >
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/:id" element={<ClienteDetail />} />
              <Route path="/softwares" element={<Softwares />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/ocorrencias" element={<Ocorrencias />} />
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/empresa" element={<Empresa />} />
              <Route path="/usuarios" element={<Usuarios />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
