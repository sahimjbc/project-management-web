import { ChevronRight, ChevronDown } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useState } from "react";
import { TeamSwitcher } from "./team-switcher";
import { AppSidebarFooter } from "./app-sidebar-footer";

import { navLinks } from "@/lib/links";
import { useAtom } from "jotai/react";
import { authAtom } from "@/store";

export function AppSidebar() {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  const toggleOpen = (key: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const [auth] = useAtom(authAtom);
  if (!auth) {
    return null;
  }

  const authorizedGroups = navLinks.reduce<typeof navLinks>((acc, group) => {
    const authorizedLinks = group.links.filter((link) => {
      return auth.user.permissions.includes(link.id);
    });

    if (authorizedLinks.length) {
      acc.push({ ...group, links: authorizedLinks });
    }
    return acc;
  }, []);

  return (
    <Sidebar>
      <SidebarHeader>
        <img
          src="/project-management-logo.png"
          className="mx-auto h-15 w-auto"
          alt="Logo"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <TeamSwitcher />

              {authorizedGroups.map((group) => {
                const isGroupCollapsible = group.links.length > 0;
                const isOpen = openStates[group.key] || false;

                if (!isGroupCollapsible) {
                  const item = group.links[0];
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        <a href={item.path} className="flex items-center gap-2">
                          {item.icon && <item.icon className="w-4 h-4" />}
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <Collapsible
                    key={group.key}
                    open={isOpen}
                    onOpenChange={() => toggleOpen(group.key)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            {group.icon && <group.icon className="w-4 h-4" />}
                            <span>{group.group}</span>
                          </div>
                          {isOpen ? (
                            <ChevronDown className="w-4 h-4 transition-transform" />
                          ) : (
                            <ChevronRight className="w-4 h-4 transition-transform" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </SidebarMenuItem>
                    <CollapsibleContent className="pl-4">
                      <SidebarMenuSub>
                        {group.links.map((item) => (
                          <SidebarMenuSubItem key={item.id}>
                            <a
                              href={item.path}
                              className="flex items-center gap-2"
                            >
                              {item.icon && <item.icon className="w-4 h-4" />}
                              <span>{item.label}</span>
                            </a>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
