import { atomWithStorage } from "jotai/utils";

type Auth = {
    user: AuthUser;
    token: string;
};

export const authAtom = atomWithStorage<Auth | null>("auth", null, undefined, {
  getOnInit: true,
});