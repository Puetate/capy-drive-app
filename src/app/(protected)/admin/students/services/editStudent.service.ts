import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Student } from "@/app/models/student.model";
import API from "@/lib/axios/api";

export default async function editStudentService(id:number, student: Student) {
    const url = `/students/${id}`;
    const res = await API.put<ResponseRequest<Student>>({ url: url, data: student })
    return res
}