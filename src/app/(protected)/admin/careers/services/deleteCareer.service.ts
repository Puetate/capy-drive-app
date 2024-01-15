import { ResponseRequest } from "@/app/models/responseRequest.model";
import { User } from "@/app/models/user.model";
import API from "@/lib/axios/api";

export async function deleteCareerService(id: number) {
    const url = `/career/${id}`;
    const res = await API.del<ResponseRequest<User>>({ url: url})
    return res
} 