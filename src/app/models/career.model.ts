import { AcademicPeriod } from "./academicPeriod.model";
import { Faculty } from "./faculty.models";

export interface Career {
    id: number,
    name: string,
    faculty: Faculty | string,
    academicPeriods?: AcademicPeriod[] | string[] | string,
}
