import { Sidebar } from "@/components/Sidebar"
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context"
import { cn } from "@/lib/utils"

interface PageLayoutProps {
  children: React.ReactNode
}

function PageLayoutContent({ children }: PageLayoutProps) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main 
        className={cn(
          "flex-1 relative overflow-hidden transition-all duration-300 ease-in-out",
          // Adjust left margin for mobile menu button
          "lg:ml-0"
        )}
      >
        {/* Gradient background matching the Sapphire Executive design */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10 -z-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/10 via-transparent to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-secondary/20 via-transparent to-transparent rounded-full blur-3xl -z-10" />
        
        {/* Content */}
        <div className="p-6 md:p-10 pt-16 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  )
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <SidebarProvider>
      <PageLayoutContent>{children}</PageLayoutContent>
    </SidebarProvider>
  )
}
