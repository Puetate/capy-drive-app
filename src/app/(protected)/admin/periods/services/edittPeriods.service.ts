import { ResponseRequest } from "@/app/models/responseRequest.model";
import API from "@/lib/axios/api";
import { AcademicPeriod } from "@/app/models/academicPeriod.model";

export async function editPeriodsService(id: string, periods: AcademicPeriod) {
    const url = `/academic-period/${id}`;
    const res = await API.put<ResponseRequest<AcademicPeriod>>({ url: url, data: periods });
    return res;
}
