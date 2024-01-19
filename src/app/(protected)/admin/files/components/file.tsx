"use client"
import ConfirmDialog from "@/app/(protected)/components/ConfirmDialog";
import { ActionIcon, Button, Modal, Tooltip } from "@mantine/core";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { IconFileTypePdf, IconTrash } from "@tabler/icons-react";
import { useContextMenu } from "mantine-contextmenu";
import { useRef, useState } from "react";
import { toast } from "sonner";
import useIsInCareer from "../hooks/use-is-in-career";
import { deleteFileService } from "../services/delete-file.service";
import { getFileByFileIdService } from "../services/get-file-by-file-id.service";
import { useDisclosure } from "@mantine/hooks";

interface FileProps {
  name?: string;
  fileId: number;
  blob?: Blob;
  onDeleteFile: () => void | Promise<void>;
}

export default function File({ name, fileId, onDeleteFile }: FileProps) {
  const isInCareers = useIsInCareer();
  const { showContextMenu } = useContextMenu();
  const [opened, { close, toggle }] = useDisclosure();
  const [openedDialog, { close: closeDialog, toggle: toggleDialog }] = useDisclosure();
  const [blob, setBlob] = useState<Blob>(new Blob());
  const workerRef = useRef<string>("https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js");

  const getFile = async (fileId: number) => {
    const res = await getFileByFileIdService({ fileId });
    console.log({res});
    
    setBlob(res);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteFile = async () => {
    const res = await deleteFileService({ fileId });
    if (res.httpStatus === "OK") {
      toggleDialog();
      await onDeleteFile();
      toast.success("Archivo eliminado correctamente");
    }
  };

  return (
    <>
      <div className="flex justify-between rounded-lg p-3 hover:bg-secondary-300">
        <button
          onClick={() => {
            getFile(fileId);
            toggle();
          }}
          onContextMenu={
            isInCareers
              ? showContextMenu([
                  {
                    key: "delete",
                    icon: <IconTrash color="red" />,
                    title: "Eliminar Archivo",
                    className: "border-2 border-black bg-secondary-600 p-2 text-white font-bold rounded-lg",
                    onClick: toggleDialog
                  }
                ])
              : () => {}
          }
          className="z-10 flex w-full  gap-4  bg-transparent  
        transition-colors duration-300 hover:underline"
        >
          <IconFileTypePdf color="red" />
          {name}
        </button>
        {isInCareers && (
          <ActionIcon color="red" onClick={toggleDialog}>
            <Tooltip label="Eliminar Archivo">
              <IconTrash />
            </Tooltip>
          </ActionIcon>
        )}

        <ConfirmDialog
          opened={openedDialog}
          message="¿Está seguro que desea eliminar este archivo?"
          onConfirm={handleDeleteFile}
          onClose={closeDialog}
        />
      </div>
      <Modal
        opened={opened}
        onClose={close}
        centered
        fullScreen
        title={<Button onClick={handleDownload}>Descargar</Button>}
        transitionProps={{ transition: "fade", duration: 200 }}
        classNames={{
          body: "bg-zinc-600",
          content: "overflow-hidden bg-zinc-600",
          header: "bg-zinc-600",
          close: "text-white hover:bg-slate-400"
        }}
      >
        <div className="h-[90vh]  rounded-lg">
          <Worker workerUrl={workerRef.current}>
            <Viewer fileUrl={window.URL.createObjectURL(blob)} />
          </Worker>
        </div>
      </Modal>
    </>
  );
}
