import { Career } from "@/app/models/career.model";
import { ResponseRequest } from "@/app/models/responseRequest.model";
import API from "@/lib/axios/api";

export async function editCareerService(id: number, career: Career) {
    const url = `/career/${id}`;
    const res = await API.put<ResponseRequest<Career>>({ url: url, data: career })
    return res;
} 