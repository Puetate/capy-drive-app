import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Career } from "@/app/models/career.model";
import API from "@/lib/axios/api";
import { AcademicPeriod } from "@/app/models/academicPeriod.model";
import { CareerAcadPeriodReq } from "@/app/models/careerAcadPeriod.model";

export async function saveCareerAcadPeriodService(career: CareerAcadPeriodReq) {
    const url = "/career-academic-period";
    const res = await API.post<ResponseRequest<Career>>({ url: url, data: career });
    return res;
}