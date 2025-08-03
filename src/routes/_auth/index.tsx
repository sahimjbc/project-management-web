import { m } from '@/paraglide/messages';
import { authAtom } from '@/store';
import { createFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai/react';

export const Route = createFileRoute("/_auth/")({
  component: RouteComponent,
  head: () => ({
      meta: [
        {
          title: m["dashboard.page title"](),
        },
      ],
    }),
});

function RouteComponent() {
  const [auth] = useAtom(authAtom);

    if (!auth) {
        return <div className="p-4">Loading...</div>;
    }
  
  return (
    <div>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur
      dignissimos eligendi earum? Amet rem, nisi eius recusandae reiciendis
      animi dolore laboriosam eos possimus, labore doloremque, culpa est quasi
      deserunt ipsa!Lorem ipsum, dolor sit amet consectetur adipisicing elit.
      Aspernatur dignissimos eligendi earum? Amet rem, nisi eius recusandae
      reiciendis animi dolore laboriosam eos possimus, labore doloremque, culpa
      est quasi deserunt ipsa!Lorem ipsum, dolor sit amet consectetur
      adipisicing elit. Aspernatur dignissimos eligendi earum? Amet rem, nisi
      eius recusandae reiciendis animi dolore laboriosam eos possimus, labore
      doloremque, culpa est quasi deserunt ipsa!Lorem ipsum, dolor sit amet
      consectetur adipisicing elit. Aspernatur dignissimos eligendi earum? Amet
      rem, nisi eius recusandae reiciendis animi dolore laboriosam eos possimus,
      labore doloremque, culpa est quasi deserunt ipsa!Lorem ipsum, dolor sit
      amet consectetur adipisicing elit. Aspernatur dignissimos eligendi earum?
      Amet rem, nisi eius recusandae reiciendis animi dolore laboriosam eos
      possimus, labore doloremque, culpa est quasi deserunt ipsa!Lorem ipsum,
      dolor sit amet consectetur adipisicing elit. Aspernatur dignissimos
      eligendi earum? Amet rem, nisi eius recusandae reiciendis animi dolore
      laboriosam eos possimus, labore doloremque, culpa est quasi deserunt
      ipsa!Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur
      dignissimos eligendi earum? Amet rem, nisi eius recusandae reiciendis
      animi dolore laboriosam eos possimus, labore doloremque, culpa est quasi
      deserunt ipsa!Lorem ipsum, dolor sit amet consectetur adipisicing elit.
      Aspernatur dignissimos eligendi earum? Amet rem, nisi eius recusandae
      reiciendis animi dolore laboriosam eos possimus, labore doloremque, culpa
      est quasi deserunt ipsa!Lorem ipsum, dolor sit amet consectetur
      adipisicing elit. Aspernatur dignissimos eligendi earum? Amet rem, nisi
      eius recusandae reiciendis animi dolore laboriosam eos possimus, labore
      doloremque, culpa est quasi deserunt ipsa!Lorem ipsum, dolor sit amet
      consectetur adipisicing elit. Aspernatur dignissimos eligendi earum? Amet
      rem, nisi eius recusandae reiciendis animi dolore laboriosam eos possimus,
      labore doloremque, culpa est quasi deserunt ipsa!Lorem ipsum, dolor sit
      amet consectetur adipisicing elit. Aspernatur dignissimos eligendi earum?
      Amet rem, nisi eius recusandae reiciendis animi dolore laboriosam eos
      possimus, labore doloremque, culpa est quasi deserunt ipsa!Lorem ipsum,
      dolor sit amet consectetur adipisicing elit. Aspernatur dignissimos
      eligendi earum? Amet rem, nisi eius recusandae reiciendis animi dolore
      laboriosam eos possimus, labore doloremque, culpa est quasi deserunt
      ipsa!Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur
      dignissimos eligendi earum? Amet rem, nisi eius recusandae reiciendis
      animi dolore laboriosam eos possimus, labore doloremque, culpa est quasi
      deserunt ipsa!
    </div>
  );
}
