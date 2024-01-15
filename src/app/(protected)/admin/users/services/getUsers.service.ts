import { User } from "@/app/models/user.model";
import API from "../../../../../lib/axios/api";
import { ResponseRequest } from "@/app/models/responseRequest.model";

export async function getUsersService() {
    const url: string = "/users/all/14"
    const res = await API.get<ResponseRequest<User[]>>({ url });
    return res;
}