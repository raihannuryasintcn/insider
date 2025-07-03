import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppBreadcrumb } from "@/components/app-breadcrumb"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset> 
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <AppBreadcrumb />
        </header>
        <main className="w-full px-4  py-4 h-[calc(100vh-50px)]">
          {/* area konten utama yang diisi oleh rute yang cocok melalui `Outlet`. */}
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}