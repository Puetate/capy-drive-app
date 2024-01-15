import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Career } from "@/app/models/career.model";
import API from "@/lib/axios/api";

export async function saveCareerService(career: Career) {
    const url = "/career";
    const res = await API.post<ResponseRequest<Career>>({ url: url, data: career });
    return res;
}