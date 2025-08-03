import api from "@/lib/api";
import { m } from "@/paraglide/messages";
import type { LoginForm } from "@/routes/login";
import { authAtom } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai/react";
import { RESET } from "jotai/utils";
import { toast } from "sonner";
import type { XiorError } from "xior";

type UserActions = "view" | "create" | "edit" | "delete";
type UserMenu = "users" | "projects" | "dashboard" | "settings" | "reports" | "roles" | "permissions" ;

type LoginResponse = {
  refresh_token: string;
  access_token: string;
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    is_verified: boolean;
    phone: string | null;
    avatar: string | null;
    permissions: {
      id: number;
      action_name: UserActions;
      menu_name: UserMenu;
    }[];
  };
};


export function useLogin() {
    const [, setAuth] = useAtom(authAtom);

    return useMutation<
        LoginResponse,
        XiorError<APIErrorResponse>,
        LoginForm,
        { toastId: number | string }
    >({
        mutationFn: async (data: LoginForm) => {
            return await api
                .post("/login", data)
                .then((response) => response.data);
        },
        onMutate: () => {
            const toastId = toast.loading(m["login.logging in"](), {
                description: m["login.logging in"](),
            });
            return {
                toastId,
            };
        },
        onSuccess: (data, _, context) => {
            toast.success(m["login.logged in"](), { id: context.toastId });
           const mergedUserPermission = data.user.permissions.map((per) => {
             return `${per.menu_name}.${per.action_name}` as UserPermission;
           });
           console.log(mergedUserPermission);
            setAuth({
              user: {
                ...data.user,
                permissions: mergedUserPermission,
              },
              token: data.access_token,
            });
        },
        onError: (error, _, context) => {
            console.error("Login error:", error.response);
            toast.error(m["login.login failed"](), {
                id: context?.toastId,
                description: error.response?.data.message,
            });
        },
    });
}

export function useLogout() {
    const [, setAuth] = useAtom(authAtom);

    return useMutation<void, Error>({
        mutationFn: async () => {
            return await api.post("/logout").then((response) => response.data);
        },
        onMutate: () => {
            setAuth(RESET);
        },
        onError: (error) => {
            console.error("Logout error:", error);
        },
    });
}