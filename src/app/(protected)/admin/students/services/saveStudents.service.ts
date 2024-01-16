import { ExcelStudents } from "@/app/models/excelStudents.model";
import { ResponseRequest } from "@/app/models/responseRequest.model";
import API from "@/lib/axios/api";

export default async function saveStudentsService(excelStudents: ExcelStudents) {
    const url = "/students";
    const res = await API.post<ResponseRequest<ExcelStudents>>({ url: url, data: excelStudents })
    return res
}