import { Faculty } from "@/app/models/faculty.models";
import { ResponseRequest } from "@/app/models/responseRequest.model";
import API from "@/lib/axios/api";

export async function saveFacultyService(faculty: Faculty) {
    const url = "/faculty";
    const res = await API.post<ResponseRequest<Faculty>>({ url: url, data: faculty });
    return res;
}