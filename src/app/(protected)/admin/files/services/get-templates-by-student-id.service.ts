import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Template } from "@/app/models/template.model";
import API from "@/lib/axios/api";

interface ServiceProps {
  studentId: number;
}

export async function getTemplatesByStudentIdService({ studentId }: ServiceProps) {
  const url = `templates/student/${studentId}`;
  const res = await API.get<ResponseRequest<Template[]>>({ url });
  return res;
}

// export default async function editTemplateService(id: number, template: TemplateModel) {
//   const url = `/template/${id}`;
//   const res = await API.put<ResponseRequest<TemplateModel>>({ url: url, data: template });
//   return res;
// }
