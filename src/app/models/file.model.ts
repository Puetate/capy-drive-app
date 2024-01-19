import { Folder } from "./folder.model";
import { Student } from "./student.model";

export interface File {
  id: number;
  name: null;
  url: string;
  description: string;
  issueDate: string;
  student: Student;
  folder: Folder;
}
