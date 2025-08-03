type UserRole =
  | "Super-Admin"
  | "Project-Manager"
  | "Team-Leader"
  | "Team-Member";
type UserPermission =
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "dashboard.view"
  | "settings.view"
  | "settings.edit"
  | "projects.view"
  | "projects.create"
  | "projects.edit"
  | "projects.delete"
  | "reports.view"
  | "reports.create"
  | "reports.edit"
  | "reports.delete"
  | "roles.view"
  | "roles.create"
  | "roles.edit"
  | "roles.delete"
  | "permissions.view"
  | "permissions.create"
  | "permissions.edit"
  | "permissions.delete";

type AuthUser = {
  id: number;
  username: null | string;
  email: null | string;
  role: UserRole;
  permissions: UserPermission[];
  is_verified: boolean;
  phone: null | string;
  avatar: null | string;
};

type APIErrorResponse = {
  message: string;
};

type MutationContext = {
  toastId: number | string;
};
