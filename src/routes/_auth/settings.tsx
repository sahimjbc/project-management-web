import { m } from '@/paraglide/messages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute("/_auth/settings")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: m["settings.page title"](),
      },
    ],
  }),
});

function RouteComponent() {
  return <div>Hello "/_auth/settings"!</div>
}
