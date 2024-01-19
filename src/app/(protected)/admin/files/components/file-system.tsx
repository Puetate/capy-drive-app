"use client";
import { Career } from "@/app/models/career.model";
import { cn } from "@/lib/utils/cn";
import { Breadcrumbs, Button, Card, Loader, Modal, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconFolder } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useAppStore } from "../../../store/app.store";
import useIsInCareer from "../hooks/use-is-in-career";
import { getCareersService } from "../services/get-careers.service";
import { getFilesByFolderAndStudentIdService } from "../services/get-files-by-folder-and-student-id";
import { getStudentsByCareerIdService } from "../services/get-students-by-career-id.service";
import { getTemplatesByStudentIdService } from "../services/get-templates-by-student-id.service";
import { useBreadcrumbStore, useFileSystemStore } from "../store/file-system.store";
import File from "./file";
import Folder from "./folder";
import FormFile from "./form-file";

enum fileAcceptedTypes {
  student = "student",
  template = "template",
  folder = "folder",
  file = "file"
}

export default function FileSystem() {
  const router = useRouter();
  const params = useSearchParams();
  const [opened, { close, toggle }] = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const [folders, setFolders] = useState<ReactNode[]>([]);
  const [careersSelect, setCareersSelect] = useState<Array<{ value: string; label: string }>>([]);
  // const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const breadcrumbs = useBreadcrumbStore((state) => state.breadcrumbs);
  const setBreadcrumbs = useBreadcrumbStore((state) => state.setBreadcrumbs);
  const addBreadcrumb = useBreadcrumbStore((state) => state.addBreadcrumb);
  const currentCareer = useAppStore((state) => state.currentCareer);
  const setCurrentCareer = useAppStore((state) => state.setCurrentCareer);
  const setFolderId = useFileSystemStore((state) => state.setFolderId);
  const setStudentId = useFileSystemStore((state) => state.setStudentId);

  const isInCareers = useIsInCareer();
  const careersRef = useRef<Career[]>([]);

  const id = params.get("id");
  const type = params.get("type");

  const validateParam = useCallback(() => {
    try {
      z.coerce.number().nullable().parse(id);
      z.nativeEnum(fileAcceptedTypes).parse(type);
      return true;
    } catch (error) {
      setFolders([]);
      return false;
    }
  }, [id, type]);

  const generateFolders = (folders: { id: number; name: string }[]) => {
    if (type === null) return [];
    const nextType: Record<string, string> = {
      student: "template",
      template: "folder",
      folder: "file"
    };
    const folderId = params.get("folder") ?? "";
    const studentId = params.get("student") ?? "";
    return folders.map((folder) => {
      const href: string = `?id=${folder.id}&type=${nextType[type]}&folder=${
        type === "folder" ? folder.id : folderId
      }&student=${type === "student" ? folder.id : studentId}`;
      return (
        <Folder
          key={folder.name}
          href={href}
          onClick={() => {
            addBreadcrumb({ title: folder.name, href });
            if (type === "student") setStudentId(folder.id);
            if (type === "folder") setFolderId(folder.id);
          }}
        >
          <IconFolder fill="goldenrod" color="goldenrod" />
          <Folder.Text>{folder.name}</Folder.Text>
        </Folder>
      );
    });
  };

  const generateFiles = (files: { id: number; name: string }[]) => {
    return files.map((file) => {
      return <File key={file.id} fileId={file.id} name={file.name} onDeleteFile={getFiles} />;
    });
  };

  const getStudents = async () => {
    if (!currentCareer) return;
    setLoading(true);
    const careerId = currentCareer.id;
    const res = await getStudentsByCareerIdService({ careerId });
    const folders = generateFolders(res);
    setFolders(folders);
    setLoading(false);
  };

  const getTemplates = async () => {
    const student = params.get("student")
    if (student === null) return;
    setLoading(true);
    const studentId = parseInt(student);
    const res = await getTemplatesByStudentIdService({ studentId });
    const folders = generateFolders(res.data);
    setFolders(folders);
    setLoading(false);
    return res.data;
  };

  const getFolders = async () => {
    if (id === null) return;
    setLoading(true);
    const templateId = parseInt(id);
    const templates = await getTemplates();
    const res = templates?.filter((template) => template.id === templateId);
    if (res === undefined || res.length === 0) return;
    const folders = generateFolders(res[0].folders);
    setFolders(folders);
    setLoading(false);
  };

  const getFiles = async () => {
    const student = params.get("student");
    if (id === null || student === null) return;
    setLoading(true);
    const folderId = parseInt(id);
    const studentId = parseInt(student);
    const res = await getFilesByFolderAndStudentIdService({ folderId, studentId });
    const files = generateFiles(res);
    setFolders(files);
    setLoading(false);
  };

  const getCareers = async () => {
    const res = await getCareersService();
    const comboBoxData = res.data.map((combo) => ({ value: combo.id.toString(), label: combo.name }));
    careersRef.current = res.data;
    setCareersSelect(comboBoxData);
  };

  const folderType: Record<string, () => Promise<void | any>> = {
    student: getStudents,
    template: getTemplates,
    folder: getFolders,
    file: getFiles
  };

  const handleSubmitSuccess = async () => {
    await folderType.file();
    close();
  };

  useEffect(() => {
    getCareers();
  }, []);

  useEffect(() => {
    if (!validateParam()) return;
    folderType[type as string]();
  }, [id, type, validateParam, currentCareer]);

  useEffect(() => {
    if (!currentCareer) return;
    console.log({ currentCareer });

    if (breadcrumbs.length === 0 || type === "student")
      setBreadcrumbs([{ title: currentCareer.name, href: "?type=student" }]);
  }, [currentCareer, type]);

  useEffect(() => {
    if (!currentCareer) return;
    if (type === "student") setBreadcrumbs([{ title: currentCareer?.name, href: "?type=student" }]);
  }, [type]);

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <Select
          label="Carrera"
          data={careersSelect}
          placeholder="Carrera"
          value={currentCareer?.id.toString()}
          onChange={(value) => {
            if (value === null) return;
            setCurrentCareer(careersRef.current.find((c) => c.id === parseInt(value)));
            router.push("/admin/files?type=student");
          }}
        />
        {type === "file" && isInCareers && (
          <Button className="mt-3" onClick={toggle}>
            Agregar archivo
          </Button>
        )}
      </div>
      <Card className="h-full rounded-lg bg-white">
        <Card.Section className="p-5">
          {breadcrumbs.length > 0 && (
            <Breadcrumbs classNames={{ separator: "text-black" }}>
              {breadcrumbs.map((item, index) => (
                <Link
                  className="text-black hover:text-secondary-800"
                  onClick={() => {
                    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
                    setBreadcrumbs(newBreadcrumbs);
                  }}
                  key={item.href}
                  href={item.href}
                >
                  {item.title}
                </Link>
              ))}
            </Breadcrumbs>
          )}
        </Card.Section>
        <Card.Section className="relative flex h-full max-h-[calc(100vh-10rem)] flex-col overflow-y-auto px-5 pb-5">
          <div
            className={cn(
              loading ? "h-0 overflow-hidden opacity-0" : "opacity-100",
              "transition-opacity duration-100"
            )}
          >
            {folders.length === 0 ? <p>No hay archivos disponibles</p> : folders}
          </div>
          {loading ? <Loader className="absolute left-[50%] top-[50%]" /> : null}
        </Card.Section>
        <Modal
          title="Agregar archivo"
          size="xl"
          className="h-full"
          centered
          onClose={close}
          opened={opened}
          withCloseButton={false}
        >
          <FormFile onSubmitSuccess={handleSubmitSuccess} onCancel={close} />
        </Modal>
      </Card>
    </div>
  );
}
