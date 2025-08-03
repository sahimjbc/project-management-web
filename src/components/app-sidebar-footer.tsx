import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, ChevronsUpDown } from "lucide-react";
import { useLogout } from "@/api/auth.api";
import { useAtom } from "jotai/react";
import { authAtom } from "@/store";
import { Link } from "@tanstack/react-router";
import { m } from "@/paraglide/messages";

export function AppSidebarFooter() {
  const [auth] = useAtom(authAtom);
  const logout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center justify-between gap-2 rounded-md px-3 py-2 hover:bg-muted transition">
          <div className="flex items-center gap-2">
            <img
              src={auth?.user?.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="w-6 h-6 rounded-full"
            />
            <div className="flex flex-col text-left text-xs">
              <span className="font-medium text-black">
                {auth?.user?.username ?? "Unknown"}
              </span>
              <span className="text-muted-foreground">
                {auth?.user?.email ?? "-"}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="flex items-center gap-2">
          <img
            src={auth?.user?.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-6 h-6 rounded-full"
          />
          {auth?.user?.username ?? "Unknown"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <Link to="/settings/" className="flex-1">
            {m["links.settings"]()}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => logout.mutate()}
          className="text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
