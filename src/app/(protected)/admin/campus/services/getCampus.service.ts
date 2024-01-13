import { Campus } from "@/app/models/campus.model";
import API from "../../../../../lib/axios/api";
import { ResponseRequest } from "@/app/models/responseRequest.model";

export async function getCampusService() {
    const url: string = "/campus";
    const res = await API.get<ResponseRequest<Campus[]>>({ url });
    return res;
}
