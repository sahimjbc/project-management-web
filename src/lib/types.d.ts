type UserRole =
  | "Super-Admin"
  | "Project-Manager"
  | "Team-Leader"
  | "Team-Member";
type UserPermission =
  | "users"
  | "dashboard"
  | "settings"
  | "projects"
  | "reports"
  | "roles";

type AuthUser = {
  id: number;
  username: null | string;
  email: null | string;
  roles: UserRole[];
  permissions: UserPermission[];
  is_varified: null | boolean;
  phone: null | string;
  avatar: null | string;
};

type APIErrorResponse = {
  message: string;
};

type MutationContext = {
  toastId: number | string;
};
