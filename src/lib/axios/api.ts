import axios from "./config/axios.config";

const API = {
  get,
  post,
  put,
  patch,
  del,
  axios
};

export interface RequestParams {
  url: string;
  params?: object;
  data?: object | string;
  headers?: object;
}

function get<T>(params: RequestParams): Promise<T> {
  return axios<T>({
    url: params.url,
    method: "GET",
    params: params.params,
    data: params.data,
    headers: params.headers
  }).then((res) => res.data);
}

function post<T>(params: RequestParams): Promise<T> {
  return axios<T>({
    url: params.url,
    method: "POST",
    params: params.params,
    data: params.data,
    headers: params.headers
  }).then((res) => res.data);
}

function put<T>(params: RequestParams): Promise<T> {
  return axios<T>({
    url: params.url,
    method: "PUT",
    params: params.params,
    data: params.data,
    headers: params.headers
  }).then((res) => res.data);
}

function patch<T>(params: RequestParams): Promise<T> {
  return axios<T>({
    url: params.url,
    method: "PATCH",
    params: params.params,
    data: params.data,
    headers: params.headers
  }).then((res) => res.data);
}

function del<T>(params: RequestParams): Promise<T> {
  return axios<T>({
    url: params.url,
    method: "DELETE",
    params: params.params,
    data: params.data,
    headers: params.headers
  }).then((res) => res.data);
}

export default API;
