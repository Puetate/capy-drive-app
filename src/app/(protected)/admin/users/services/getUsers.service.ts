import { ResponseRequest } from "@/app/models/responseRequest.model";
import { User } from "@/app/models/user.model";
import API from "../../../../../lib/axios/api";

export async function getUsersService(userID: string) {
    const url: string = `/users/all/${userID}`
    console.log(url);

    const res = await API.get<ResponseRequest<User[]>>({ url });
    return res;
}