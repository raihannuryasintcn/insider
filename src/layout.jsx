import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppBreadcrumb } from "@/components/app-breadcrumb"

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* sidebar inset agar layout benar */}
      <SidebarInset> 
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <AppBreadcrumb />
        </header>
        <main className="p-4 w-full h-[calc(100vh-50px)]">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}