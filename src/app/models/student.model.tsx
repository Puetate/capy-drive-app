export interface Student {
    id: number,
    names: string,
    surnames: string,
    fullName?: string,
    dni: string,
    phone: string,
    email: string,
    career: string,
    periods?: string[]
}