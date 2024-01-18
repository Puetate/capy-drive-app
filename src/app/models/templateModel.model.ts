import { AcademicPeriod } from "./academicPeriod.model";
export interface Folders {
    name: string
}
export interface TemplateModel {
    id: number,
    name: string,
    createdAt?: string,
    folders: string[] | Folders[],
    academicPeriod: AcademicPeriod | string | number,
    career?: string | number,
    academicPeriods?: AcademicPeriod[],
    
}
