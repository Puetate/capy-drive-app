import { AcademicPeriod } from "@/app/models/academicPeriod.model";
import API from "../../../../../lib/axios/api";
import { ResponseRequest } from "@/app/models/responseRequest.model";

export async function getPeriodsService() {
    const url: string = "/academic-period";
    const res = await API.get<ResponseRequest<AcademicPeriod[]>>({ url });
    return res;
}
