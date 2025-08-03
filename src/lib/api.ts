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

// api.interceptors.response.use(
//     (config) => {
//         return config;
//     },
//     async (error) => {
//         if (error instanceof XiorError) {
//             if (error.response?.status === 401) {
//                 console.error("Unauthorized request, redirecting to login.");
//                 //clear auth store
//                 store.set(authAtom, null);
//                 // Redirect to login page
//                 window.location.href = "/login";
//             } else if (error.response?.status === 403) {
//                 console.error("Forbidden request, redirecting to login.");
//             }
//             console.error(`Request error:`, error);
//         }

//         if (error?.response?.status === 401) {
//             localStorage.removeItem("REQUEST_TOKEN");
//         }

//         return Promise.reject(error);
//     }
// );

export default api;
