import API from "@/lib/axios/api";

interface ServiceProps {
  fileId: number;
}

export async function getFileByFileIdService({ fileId }: ServiceProps) {
  const url = `/files/file/${fileId}`;
  const res = await API.get<Blob>({ url, responseType: "blob" });
  return res;
}
