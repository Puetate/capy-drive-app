import { Student } from "./student.model";

export interface ExcelStudents {
    career: string,
    academicPeriod: string,
    students: Student[]
}