import { ResponseRequest } from "@/app/models/responseRequest.model";
import API from "@/lib/axios/api";

interface ServiceProps {
  formData: FormData;
}

export async function saveFileService({ formData }: ServiceProps) {
  const url = "/files";
  const res = await API.post<ResponseRequest<null>>({ url, data: formData });
  return res;
}
