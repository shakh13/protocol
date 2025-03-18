import axios from "axios";

const baseUrl = "http://localhost:8000/";

const AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    }
});


AxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        } else {
            config.headers.Authorization = "";
        }
        return config;
    },
);

AxiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // localStorage.removeItem("token");
            // localStorage.removeItem("isAdmin");
            localStorage.clear();
        }
    }
);

export default AxiosInstance;