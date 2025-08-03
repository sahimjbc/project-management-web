type UserRole =
  | "Super-Admin"
  | "Project-Manager"
  | "Team-Leader"
  | "Team-Member";
type UserPermission =
  | "master_maintenance"
  | "user_master_maintenance"
  | "customer_master_maintenance"
  | "collection_destination_master_maintenance"
  | "delivery_destination_master_maintenance"
  | "management_menu"
  | "delivery_schedule"
  | "delivery_completion_data_collection"
  | "shipping_menu"
  | "shipping_input"
  | "collection_request_list"
  | "collection"
  | "collection_center_qr"
  | "collection_center"
  | "sorting_qr"
  | "collection_sorting_check"
  | "loading_qr"
  | "distribution_center"
  | "arrival_qr"
  | "depot_loading_qr"
  | "delivery_completed_qr";

type AuthUser = {
  id: number;
  username: null | string;
  email: null | string;
  roles: UserRole[];
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
