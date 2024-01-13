import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Role } from "@/app/models/role.model";
import API from "../../../../../lib/axios/api";

export async function getRolesService() {
    const url: string = "/role"
    const res = await API.get<ResponseRequest<Role[]>>({ url });
    return res;
}