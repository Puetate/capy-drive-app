import { File } from "@/app/models/file.model";
import { ResponseRequest } from "@/app/models/responseRequest.model";
import API from "@/lib/axios/api";

interface ServiceProps {
  folderId: number;
  studentId: number;
}
export async function getFilesByFolderAndStudentIdService({ folderId, studentId }: ServiceProps) {
  const url = `files/${folderId}/${studentId}`;
  const res = await API.get<ResponseRequest<File[]>>({ url });
  return res.data.map((file) => ({ id: file.id, name: file.name ?? "Un archivo" }));
}
