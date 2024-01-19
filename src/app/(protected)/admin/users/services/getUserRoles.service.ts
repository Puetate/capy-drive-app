import { User } from "@/app/models/user.model";
import API from "../../../../../lib/axios/api";
import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Role } from "@/app/models/role.model";

export async function getUserRolesService(userID:string) {
    const url: string = `/users/role/${userID}`
    const res = await API.get<ResponseRequest<Role[]>>({ url });
    return res;
}