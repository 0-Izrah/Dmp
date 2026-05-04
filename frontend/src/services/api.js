import axios from "axios";

function getFingerprint() {
    let fp = localStorage.getItem("dmp-fingerprint");
    if (!fp) {
        fp = crypto.randomUUID();
        localStorage.setItem("dmp-fingerprint", fp);
    }
    return fp;
}

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // We still keep the fingerprint logic for non-admin actions if needed, 
    // although for Phase 9 we might just use it for analytics/guest tracking
    config.headers["x-fingerprint"] = getFingerprint();
    return config;
});

export default API;
export { getFingerprint };

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
