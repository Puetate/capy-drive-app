import { AcademicPeriod } from "./academicPeriod.model";

export interface TemplateModel {
    id:number,
    name: string,
    createdAt?:string,
    folders: string[],
    period: AcademicPeriod | string | number
}
