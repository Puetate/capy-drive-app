import { User } from "@/app/models/user.model";
import API from "../../../../../lib/axios/api";
import { ResponseRequest } from "@/app/models/responseRequest.model";

export async function getFacultiesService() {
    const url: string = "/faculty"
    const res = await API.get<ResponseRequest<User[]>>({ url });
    console.log(res);
    return res;
}