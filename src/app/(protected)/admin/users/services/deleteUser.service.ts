import { ResponseRequest } from "@/app/models/responseRequest.model";
import { User } from "@/app/models/user.model";
import API from "@/lib/axios/api";

export async function deleteUserService(id: number) {
    const url = `/users/{id}?id=${id}`;
    const res = await API.del<ResponseRequest<User>>({ url: url})
    return res
} 