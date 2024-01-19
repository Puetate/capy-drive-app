import { Button, CloseButton, Flex, Group, Text, TextInput, rem } from "@mantine/core";
import { Dropzone, PDF_MIME_TYPE } from "@mantine/dropzone";
import { useForm, zodResolver } from "@mantine/form";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { saveFileService } from "../services/save-file.service";

const fileSchema = z.object({
  description: z.string().min(5, "La descripción es muy corta"),
  file: z
    .instanceof(File)
    .nullable()
    .refine((file) => file != null, "El archivo es obligatorio")
});

export type FileSchema = z.infer<typeof fileSchema>;

const initialValues: FileSchema = {
  description: "",
  file: null
};

interface FormFileProps {
  onSubmitSuccess: () => void | Promise<void>;
  onCancel: () => void;
}

export default function FormFile({ onCancel, onSubmitSuccess }: FormFileProps) {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues,
    validate: zodResolver(fileSchema)
  });

  const handleSubmit = async (values: FileSchema) => {
    setLoading(true);
    const folder = params.get("folder");
    const student = params.get("student");
    if (folder === null || student === null || values.file === null) return onCancel();
    const formData = new FormData();
    formData.append("description", values.description);
    formData.append("folder", folder);
    formData.append("student", student);
    formData.append("file", values.file ?? "");
    const res = await saveFileService({ formData });
    if (res.httpStatus === "CREATED") {
      onSubmitSuccess();
      toast.success("Archivo creado exitosamente");
    }
    setLoading(false);
  };

  const selectedFile = form.values.file !== null && (
    <Text key={form.values.file.name} className="flex items-center justify-center gap-2">
      <b>{form.values.file.name}</b> ({(form.values.file.size / 1024).toFixed(2)} kb)
      <CloseButton size="xs" onClick={() => form.setFieldValue("file", null)} />
    </Text>
  );

  return (
    <form className="flex flex-col gap-5 p-4" onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput placeholder="Descripción" label="Descripción" {...form.getInputProps("description")} />
      <Dropzone
        acceptColor="blue"
        title="Archivo"
        multiple={false}
        maxSize={4 * 1024 ** 2}
        onDrop={(file) => form.setFieldValue("file", file[0])}
        onReject={(errors) => {
          if (errors.length === 0) return;
          const message =
            errors[0].errors[0].code === "file-too-large"
              ? "El tamaño debe ser menor a 4mb"
              : "Solo se acepta archivos con formato PDF";
          form.setFieldError("file", message);
        }}
        accept={PDF_MIME_TYPE}
      >
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
          <Dropzone.Accept>
            <IconUpload
              style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-blue-6)" }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }}
              stroke={1.5}
            />
          </Dropzone.Idle>
        </Group>
        <div className="text-center">
          {form.errors.file ? (
            <Text size="xl" c="red" inline>
              {form.errors.file}
            </Text>
          ) : (
            <Text size="xl" inline>
              Arrastre un archivo o haga click para seleccionar un archivo
            </Text>
          )}
        </div>
      </Dropzone>
      {selectedFile && (
        <div className="flex flex-col items-center gap-2">
          <Text className="mb-2 mt-2 text-center">Archivo seleccionado:</Text>
          {selectedFile}
        </div>
      )}
      <Flex justify="space-between" mt="lg">
        <Button variant="white" onClick={onCancel}>
          Cancelar
        </Button>
        <Button loading={loading} type="submit">
          Aceptar
        </Button>
      </Flex>
    </form>
  );
}
