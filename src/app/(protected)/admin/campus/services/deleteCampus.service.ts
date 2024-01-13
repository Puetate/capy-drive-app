import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Campus } from "@/app/models/campus.model";
import API from "@/lib/axios/api";

export async function deleteCampusService(id: number) {
  const url = `/campus/${id}`;
  const res = await API.del<ResponseRequest<Campus>>({ url: url });
  return res;
} 