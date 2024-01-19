import { Folder } from "./folder.model";

export interface Template {
  id: number;
  name: string;
  createdAt: string;
  folders: Folder[];
}
