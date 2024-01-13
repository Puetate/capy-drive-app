import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Campus } from "@/app/models/campus.model";
import API from "@/lib/axios/api";

export async function saveCampusService(user: Campus) {
    const url = "/campus";
    const res = await API.post<ResponseRequest<Campus>>({ url: url, data: user });
    return res;
}
