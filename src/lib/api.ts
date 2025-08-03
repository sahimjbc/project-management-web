import { authAtom } from "@/store";
import config from "@/lib/config";
import xior, { merge } from "xior";
import { getDefaultStore } from "jotai/vanilla";

const store = getDefaultStore();

const api = xior.create({
    baseURL: config.API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

api.interceptors.request.use((config) => {
    const auth = store.get(authAtom);
    const header = config.headers || {};
    if (header["Content-Type"] === "multipart/form-data") {
        delete config.headers["Content-Type"];
    }

    if (auth?.token) {
        header["Authorization"] = `Bearer ${auth.token}`;
    }

    if (auth) {
        return merge(config, {
            headers: header,
        });
    }
    return config;
});

export default api;
