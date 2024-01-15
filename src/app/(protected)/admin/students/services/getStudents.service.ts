import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Student } from "@/app/models/student.model";
import { TemplateModel } from "@/app/models/templateModel.model";
import API from "@/lib/axios/api";

export default async function getStudentsService() {
    const url = "/students/1";
    const res = await API.get<ResponseRequest<Student[]>>({ url: url })
    return res
}