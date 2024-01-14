import { ResponseRequest } from "@/app/models/responseRequest.model";
import { TemplateModel } from "@/app/models/templateModel.model";
import API from "@/lib/axios/api";

export default async function saveTemplateService(template: TemplateModel) {
    const url = "/template";
    const res = await API.post<ResponseRequest<TemplateModel>>({ url: url, data: template })
    return res
}