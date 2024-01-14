import { AcademicPeriod } from "./academicPeriod.model";

export interface TemplateModel {
    id:number,
    templateName: string,
    folders: string[],
    period: AcademicPeriod | string
}
