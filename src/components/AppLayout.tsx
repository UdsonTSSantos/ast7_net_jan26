import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { AppSidebar } from '@/components/AppSidebar'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/AuthContext'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'

export default function AppLayout() {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const pathSegments = location.pathname.split('/').filter(Boolean)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 w-full overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="w-[1px] h-6 bg-border mx-2" />
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.map((segment, index) => {
                  const href = `/${pathSegments.slice(0, index + 1).join('/')}`
                  const isLast = index === pathSegments.length - 1
                  return (
                    <div key={segment} className="flex items-center">
                      <BreadcrumbSeparator />
                      <BreadcrumbItem className="capitalize ml-2">
                        {isLast ? (
                          <BreadcrumbPage>{segment}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://img.usecurling.com/ppl/thumbnail?gender=male&seed=${user?.id}`}
                        alt={user?.name}
                      />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
