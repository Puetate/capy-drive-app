import { ResponseRequest } from "@/app/models/responseRequest.model";
import { Student } from "@/app/models/student.model";
import API from "@/lib/axios/api";

interface ServiceProps {
  careerId: number;
}

export async function getStudentsByCareerIdService({ careerId }: ServiceProps) {
  try {
    const url = `/students/${careerId}`;
    const res = await API.get<ResponseRequest<Student[]>>({ url });
    return res.data.map((student) => ({ name: `${student.names} ${student.surnames}`, id: student.id }));
  } catch (error) {
    return [];
  }
}
