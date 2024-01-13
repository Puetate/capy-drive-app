import { ResponseRequest } from "@/app/models/responseRequest.model";
import { User } from "@/app/models/user.model";
import API from "@/lib/axios/api";

export async function saveUserService(user: User) {
    const url = "/users";
    const res = await API.post<ResponseRequest<User>>({ url: url, data: user });
    return res;
}