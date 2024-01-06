import { API_URL } from "@/constants/constants";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import { toast } from "sonner";

export const axiosConfig = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

axiosConfig.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const session = await getSession();
  const token = session?.token;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosConfig.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    let errorMessage: string = "";
    errorMessage =
      error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK"
        ? "Error de conexión, revise su conexión a internet"
        : error.response?.data.error;
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default axiosConfig;
