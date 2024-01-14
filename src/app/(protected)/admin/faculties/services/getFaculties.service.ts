import API from "../../../../../lib/axios/api";
import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Faculty } from "@/app/models/faculty.models";

export async function getFacultyService() {
    const url: string = "/faculty"
    const res = await API.get<ResponseRequest<Faculty[]>>({ url });
    return res;
}