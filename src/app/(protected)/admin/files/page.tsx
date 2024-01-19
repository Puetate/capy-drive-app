"use client";
import dynamic from "next/dynamic";

const FileSystemDynamic = dynamic(() => import("./components/file-system"));

export default function FilesPage() {
  return <FileSystemDynamic />;
}
