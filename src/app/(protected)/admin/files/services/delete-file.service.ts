import { ResponseRequest } from "@/app/models/responseRequest.model";
import API from "@/lib/axios/api";

interface ServiceProps {
  fileId: number;
}

export async function deleteFileService({ fileId }: ServiceProps) {
  const url = `/files/${fileId}`;
  const res = await API.del<ResponseRequest<null>>({ url });
  return res;
}
