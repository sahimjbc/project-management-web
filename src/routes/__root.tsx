import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { HeadContent } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 1 }, // 5 minutes
  },
});

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <RootLayout />
    </QueryClientProvider>
  ),
  context: () => ({
    queryClient,
  }),
  notFoundComponent: () => (
    <div className="w-screen min-h-[80dvh] flex flex-col gap-4 items-center justify-center text-center p-4">
      <h1 className="text-5xl font-bold">404 - Not Found</h1>
      <div>
        <p>The page you are looking for does not exist.</p>
        <p>
          Please check the URL or return to the{" "}
          <Link to="/" className="text-blue-500 underline">
            home page
          </Link>
          .
        </p>
        <p>If you believe this is an error, please contact support.</p>
      </div>
    </div>
  ),
});

function RootLayout() {
  return (
    <div>
      <HeadContent />
      {/* <header className="p-4 bg-primary flex items-center justify-between">
                <Link to="/" className="flex items-center gap-4">
                    <img
                        title="メニューへ移動"
                        src="/kouraku_logo.png"
                        width={40}
                        height={40}
                        className="transition-transform duration-300 hover:rotate-45 hover:scale-150"
                        alt="kouraku logo"
                    />
                    <img
                        title="メニューへ移動"
                        src="/kouraku_text_logo.png"
                        alt="kouraku text logo"
                        width={220}
                        className="hidden sm:block transition-transform duration-300 hover:scale-110"
                    />
                </Link>

                {auth && (
                    <div className="text-white flex items-center gap-2">
                        <h5>
                            {auth.user.username} : {auth.user.user_name}
                        </h5>
                        <Button
                            variant="destructive"
                            onClick={() => logout.mutate()}
                        >
                            {m.logout()}
                        </Button>
                    </div>
                )}
            </header> */}
      <Outlet />
      <Toaster richColors />
    </div>
  );
}
