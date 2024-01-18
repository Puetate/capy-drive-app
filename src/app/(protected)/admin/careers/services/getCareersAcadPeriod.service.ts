import API from "../../../../../lib/axios/api";
import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Career } from "@/app/models/career.model";

export async function getCareersAcadPeriodService() {
    const url: string = "/career/academic-period"
    const res = await API.get<ResponseRequest<Career[]>>({ url });
    return res;
}