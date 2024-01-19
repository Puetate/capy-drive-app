import { Template } from "@/app/models/template.model";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FileSystemStore {
  studentId: number;
  setStudentId: (studentId: number) => void;
  folderId: number;
  setFolderId: (folderId: number) => void;
  templates: Template[];
  setTemplates: (templates: Template[]) => void;
}

export const useFileSystemStore = create<FileSystemStore>((set) => ({
  studentId: 0,
  setStudentId: (studentId) => set(() => ({ studentId })),
  folderId: 0,
  setFolderId: (folderId) => set(() => ({ folderId })),
  templates: [],
  setTemplates: (templates) => set(() => ({ templates }))
}));

export type Breadcrumb = {
  title: string;
  href: string;
};

export interface BreadcrumbStore {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  addBreadcrumb: (breadcrumb: Breadcrumb) => void;
}

export const useBreadcrumbStore = create(
  persist<BreadcrumbStore>(
    (set) => ({
      breadcrumbs: [],
      setBreadcrumbs: (breadcrumbs) => set(() => ({ breadcrumbs })),
      addBreadcrumb: (breadcrumb) => set((state) => ({ breadcrumbs: [...state.breadcrumbs, breadcrumb] }))
    }),
    { name: "breadcrumbs" }
  )
);
