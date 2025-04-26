import axios from "axios";

// const baseUrl = "http://localhost:8000/";

function baseUrl() {
    const serverIP = window.location.hostname; // This will give the current hostname or IP if you're not using a domain
    // console.log("Current Server IP:", serverIP);
    return "http://" + serverIP + ":8000/";
}

const AxiosInstance = axios.create({
    baseURL: baseUrl(),
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

export const uploadFile = async (name, url, isPost, file) => {
    try {
        const formData = new FormData();
        formData.append(name, file); // "print" should match the backend field name

        const response = isPost
            ? await AxiosInstance.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            : await AxiosInstance.put(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

        return response.data;
    } catch (error) {
        console.error("File upload failed:", error);
        throw error;
    }
};

export default AxiosInstance;