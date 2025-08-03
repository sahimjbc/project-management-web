import { m } from "@/paraglide/messages";
import { useForm } from "react-hook-form";
import { createFileRoute } from "@tanstack/react-router";
import { useLogin } from "@/api/auth.api";
import { cn } from "@/lib/utils";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: m["login.page title"](),
      },
    ],
  }),
});

function RouteComponent() {
  const login = useLogin();

  const navigate = Route.useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Project Management Logo"
          src="/project-management-logo.png"
          className="mx-auto h-20 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          {m["login.sign-in your account"]()}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={handleSubmit((data) => {
            login.mutate(data, {
              onSuccess: () => {
                navigate({
                  to: "/",
                  replace: true,
                });
              },
              onError: (error) => {
                console.error("Login failed:", error);
              },
            });
          })}
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-900"
            >
              {m["login.Username"]()}
            </label>
            <div className="mt-2">
              <input
                type="text"
                className={cn(
                  "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6",
                  errors.username && "border-red-500"
                )}
                placeholder={m["login.Username"]()}
                {...register("username")}
              />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                {m["login.password"]()}
              </label>
              {/* <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  {m["login.Forgot password"]()}
                </a>
              </div> */}
            </div>
            <div className="mt-3">
              <input
                type="password"
                className={cn(
                  "block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6",
                  errors.password && "border-red-500"
                )}
                placeholder={m["login.password"]()}
                {...register("password")}
              />
            </div>
          </div>

          <div className="mt-3">
            <button className="flex w-full justify-center rounded-md bg-indigo-950 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              {m["login.login"]()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const loginSchema = z.object({
  username: z.string().trim().min(1, {
    message: m["login.Username is required"](),
  }),
  password: z.string().trim().min(1, {
    message: m["login.password is required"](),
  }),
});

export type LoginForm = z.infer<typeof loginSchema>;
