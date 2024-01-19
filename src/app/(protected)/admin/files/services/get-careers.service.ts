import { Career } from "@/app/models/career.model";
import { ResponseRequest } from "@/app/models/responseRequest.model";
import API from "@/lib/axios/api";

export async function getCareersService() {
  const url = "career";
  const res = await API.get<ResponseRequest<Career[]>>({ url });
  return res;
}
