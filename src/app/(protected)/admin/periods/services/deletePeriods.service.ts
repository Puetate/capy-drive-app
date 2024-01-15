import { AcademicPeriod } from "@/app/models/academicPeriod.model";
import { ResponseRequest } from "@/app/models/responseRequest.model";
import API from "@/lib/axios/api";

export async function deletePeriodsService(id: number) {
  const url = `/academic-period/${id}`;
  const res = await API.del<ResponseRequest<AcademicPeriod>>({ url: url });
  return res;
} 