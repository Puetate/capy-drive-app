import { ResponseRequest } from "@/app/models/responseRequest.model";
import { TemplateModel } from "@/app/models/templateModel.model";
import API from "@/lib/axios/api";

export default async function getTemplatesService() {
    const url = "/template";
    const res = await API.get<ResponseRequest<TemplateModel>>({ url: url })
    return res
}