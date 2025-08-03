import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Mail,
  Star,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

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

const simpleItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Search", url: "#Search", icon: Search },
  { title: "Settings", url: "#Settings", icon: Settings },
];

const collapsibleItems = [
  {
    title: "Inbox",
    icon: Inbox,
    subItems: [
      { title: "All Mail", url: "#All-Mail", icon: Mail },
      { title: "Starred", url: "#Started", icon: Star },
    ],
  },
  {
    title: "Calendar",
    icon: Calendar,
    subItems: [{ title: "Events", url: "#events", icon: Calendar }],
  },
];

export function AppSidebar() {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  const toggleOpen = (key: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
              {simpleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {collapsibleItems.map((section) => {
                const isOpen = openStates[section.title] || false;
                return (
                  <Collapsible
                    key={section.title}
                    open={isOpen}
                    onOpenChange={() => toggleOpen(section.title)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <section.icon className="w-4 h-4" />
                            <span>{section.title}</span>
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
                        {section.subItems.map((sub) => (
                          <SidebarMenuSubItem key={sub.title}>
                            <a
                              href={sub.url}
                              className="flex items-center gap-2"
                            >
                              <sub.icon className="w-4 h-4" />
                              <span>{sub.title}</span>
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
