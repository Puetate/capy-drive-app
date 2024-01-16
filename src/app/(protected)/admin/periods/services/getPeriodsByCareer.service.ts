import { AcademicPeriod } from "@/app/models/academicPeriod.model";
import API from "../../../../../lib/axios/api";
import { ResponseRequest } from "@/app/models/responseRequest.model";

export interface CareerAcademicPeriod {
    id: string,
    name: string,
    academicPeriods: AcademicPeriod[],
}
export async function getPeriodsByCareerService(careerID: string) {
    const url: string = `/career-academic-period/by-career/${careerID}`;
    const res = await API.get<ResponseRequest<CareerAcademicPeriod>>({ url });
    return res;
}
