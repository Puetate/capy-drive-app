import { Student } from "@/app/models/student.model";

export default function FormStudent({ onSubmitSuccess, onCancel, selectedStudent }:
    {
        onSubmitSuccess: () => void,
        onCancel: () => void,
        selectedStudent: Student | null
    }) {
    return (<></>);
}