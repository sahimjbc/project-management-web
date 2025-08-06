import { m } from "@/paraglide/messages";
import {
  File,
  FileInput,
  FolderIcon,
  FolderOpen,
  Home,
  User,
  UserCheck,
  UserCog,
  UserLock,
  UserPen,
  UserSearch,
} from "lucide-react";
import type { ComponentType } from "react";

interface NavLink {
  label: string;
  path: string;
  icon?: ComponentType<{ className?: string }>;
  external?: boolean;
  id: UserPermission;
}

interface NavGroup {
  key: string;
  group: string;
  links: NavLink[];
  icon?: ComponentType<{ className?: string }>;
}

export const navLinks: NavGroup[] = [
  {
    key: "dashboard",
    group: m["links.dashboard"](),
    icon: Home,
    links: [
      {
        label: m["links.dashboard"](),
        path: "/",
        id: "dashboard.view",
        icon: Home,
      },
    ],
  },
  {
    key: "users",
    group: m["links.users"](),
    icon: User,
    links: [
      {
        label: m["links.user list"](),
        path: "/users/",
        id: "users.view",
        icon: User,
      },
      {
        label: m["links.user create"](),
        path: "/users/create-user/",
        id: "users.create",
        icon: UserPen,
      },
    ],
  },
  {
    key: "projects",
    group: m["links.projects"](),
    icon: FolderIcon,
    links: [
      {
        label: m["links.project list"](),
        path: "/projects/",
        id: "projects.view",
        icon: FolderIcon,
      },
      {
        label: m["links.project create"](),
        path: "/projects/create-project/",
        id: "projects.create",
        icon: FolderOpen,
      },
    ],
  },
  {
    key: "roles",
    group: m["links.roles"](),
    icon: UserLock,
    links: [
      {
        label: m["links.roles list"](),
        path: "/roles/",
        id: "roles.view",
        icon: UserCheck,
      },
      {
        label: m["links.roles create"](),
        path: "/roles/create-role/",
        id: "roles.create",
        icon: UserCog,
      },
      {
        label: m["links.permissions list"](),
        path: "/permissions/",
        id: "permissions.view",
        icon: UserSearch,
      },
    ],
  },
  {
    key: "reports",
    group: m["links.reports"](),
    icon: FileInput,
    links: [
      {
        label: m["links.reports list"](),
        path: "/reports/",
        id: "reports.view",
        icon: File,
      },
    ],
  },
];
