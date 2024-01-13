import { ResponseRequest } from "@/app/models/responseRequest.model";
import { User } from "@/app/models/user.model";
import API from "@/lib/axios/api";

export async function editUserService(id: string, user: User) {
    const url = `/users/${id}`;
    const res = await API.put<ResponseRequest<User>>({ url: url, data: user })
    return res
} 