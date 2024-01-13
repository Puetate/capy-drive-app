import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Campus } from "@/app/models/campus.model";
import API from "@/lib/axios/api";

export async function editCampusService(id: string, campus: Campus) {
    const url = `/campus/${id}`;
    const res = await API.put<ResponseRequest<Campus>>({ url: url, data: campus });
    console.log(res);
    return res;
}
