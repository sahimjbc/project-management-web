import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { authAtom } from "@/store";
import { Navigate, Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai/react";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const [auth] = useAtom(authAtom);

  if (!auth) {
    return <Navigate to="/login" replace />;
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
      </main>
      <Outlet />
    </SidebarProvider>
  );
}
