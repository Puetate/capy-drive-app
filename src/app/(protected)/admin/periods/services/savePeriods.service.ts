import { AcademicPeriod } from "@/app/models/academicPeriod.model";
import { ResponseRequest } from "@/app/models/responseRequest.model";
import API from "@/lib/axios/api";

export async function savePeriodsService(periods: AcademicPeriod) {
    const url = "/academic-period";
    const res = await API.post<ResponseRequest<AcademicPeriod>>({ url: url, data: periods });
    return res;
}
