import { ResponseRequest } from "@/app/models/responseRequest.model";
import { TemplateModel } from "@/app/models/templateModel.model";
import API from "@/lib/axios/api";

export default async function editTemplateService(id:number, template: TemplateModel) {
    const url = `/templates/${id}`;
    const res = await API.put<ResponseRequest<TemplateModel>>({ url: url, data: template })
    return res
}