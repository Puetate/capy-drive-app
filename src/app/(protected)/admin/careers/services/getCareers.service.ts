import API from "../../../../../lib/axios/api";
import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Career } from "@/app/models/career.model";

export async function getCareersService() {
    const url: string = "/career"
    const res = await API.get<ResponseRequest<Career[]>>({ url });
    return res;
}