import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Faculty } from "@/app/models/faculty.models";
import API from "@/lib/axios/api";

export async function deleteFacultiesService(id: number) {
    const url = `/faculty/${id}`;
    const res = await API.del<ResponseRequest<Faculty>>({ url: url})
    return res
} 