import { Faculty } from "./faculty.models";

export interface Career {
    id: number,
    name: string,
    faculty: Faculty | string,
}
