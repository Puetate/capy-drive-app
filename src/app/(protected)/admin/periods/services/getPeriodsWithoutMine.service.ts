import { AcademicPeriod } from "@/app/models/academicPeriod.model";
import { ResponseRequest } from "@/app/models/responseRequest.model";
import API from "../../../../../lib/axios/api";

export async function getPeriodsWithoutMineService(careerID: string) {
    const url: string = `/academic-period/career/${careerID}`;
    const res = await API.get<ResponseRequest<AcademicPeriod[]>>({ url });
    return res;
}
