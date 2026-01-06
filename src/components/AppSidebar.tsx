import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import {
  Briefcase,
  Building2,
  DollarSign,
  Home,
  LifeBuoy,
  Monitor,
  Package,
  Settings,
  Users,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const { user } = useAuth()
  const { company } = useData()
  const location = useLocation()

  const items = [
    { title: 'Home', url: '/', icon: Home },
    { title: 'Clientes', url: '/clientes', icon: Users },
    { title: 'Softwares', url: '/softwares', icon: Monitor },
    { title: 'Serviços', url: '/servicos', icon: Package },
    { title: 'Ocorrências', url: '/ocorrencias', icon: LifeBuoy },
    { title: 'Financeiro', url: '/financeiro', icon: DollarSign },
    { title: 'Empresa', url: '/empresa', icon: Building2 },
  ]

  if (user?.role === 'admin') {
    items.push({ title: 'Usuários', url: '/usuarios', icon: Briefcase })
  }

  return (
    <Sidebar className="border-r border-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 font-bold text-lg w-full">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt="Logo"
              className="h-8 w-8 rounded object-cover"
            />
          ) : (
            <div className="h-8 w-8 bg-primary rounded flex items-center justify-center text-primary-foreground">
              A
            </div>
          )}
          <span className="truncate">{company.nome}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-2 gap-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.url}
                className={cn(
                  'w-full justify-start gap-3 px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md',
                  location.pathname === item.url &&
                    'bg-sidebar-accent text-sidebar-accent-foreground',
                )}
              >
                <Link to={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground text-center">v0.0.1</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
