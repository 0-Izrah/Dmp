import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const API = axios.create({
    baseURL,
});

let sessionPromise = null;

async function initSession() {
    let token = localStorage.getItem("token");
    if (token) return token;

    if (!sessionPromise) {
        sessionPromise = (async () => {
            const migrateFp = localStorage.getItem("dmp-fingerprint");
            const params = migrateFp ? { migrate_fingerprint: migrateFp } : {};
            
            // Use raw axios to avoid circular interceptors
            const res = await axios.get(`${baseURL}/auth/session`, { params });
            const newToken = res.data.token;
            
            localStorage.setItem("token", newToken);
            if (migrateFp) {
                localStorage.removeItem("dmp-fingerprint");
            }
            return newToken;
        })();
    }
    
    token = await sessionPromise;
    sessionPromise = null;
    return token;
}

API.interceptors.request.use(async (config) => {
    // Avoid intercepting auth endpoints to prevent loops
    if (config.url.includes('/auth/session') || config.url.includes('/auth/login')) {
        return config;
    }
    
    const token = await initSession();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

export default API;

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            if (window.location.pathname.startsWith("/manage")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);
