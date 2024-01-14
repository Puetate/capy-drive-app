import { Faculty } from "@/app/models/faculty.models";
import { ResponseRequest } from "@/app/models/responseRequest.model";
import { User } from "@/app/models/user.model";
import API from "@/lib/axios/api";

export async function editFacultyService(id: string, faculty: Faculty) {
    const url = `/faculty/${id}`;
    console.log(id,faculty);
    const res = await API.put<ResponseRequest<Faculty>>({ url: url, data: faculty })
    return res
} 