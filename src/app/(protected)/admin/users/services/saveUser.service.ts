import { ResponseRequest } from "@/app/models/responseRequest.model";
import { User } from "@/app/models/user.model";
import API from "@/lib/axios/api";
import { encriptar } from "@/lib/utils/aes";

export async function saveUserService(user: User) {
    const url = "/users";
    const password = encriptar(user.email);
    const res = await API.post<ResponseRequest<User>>({ url: url, data: {...user, password} });
    return res;
}