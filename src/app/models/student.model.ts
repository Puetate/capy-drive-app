import { AcademicPeriod } from "./academicPeriod.model";

export interface Student {
    id: number,
    names: string,
    surnames: string,
    fullName?: string,
    dni: string,
    phone: string,
    email: string,
    career: string,
    academicPeriods?: string[] | AcademicPeriod[] | string
}