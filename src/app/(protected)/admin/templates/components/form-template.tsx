import { Button, Flex, MultiSelect, PasswordInput, Select, TagsInput, Text, TextInput } from "@mantine/core";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useForm, yupResolver } from "@mantine/form";
import { toast } from "sonner";
import { Role } from "@/app/models/role.model";
import { TemplateModel } from "@/app/models/templateModel.model";
import saveTemplateService from "../services/saveTemplate.service";
import editTemplateService from "../services/editTemplate.service";
import { AcademicPeriod } from "@/app/models/academicPeriod.model";

interface AcademicPeriodData {
    value: string;
    label: string;
}

const periods: AcademicPeriod[] = [
    { id: 1, name: 'Período 1', dateStart: '2024-01-01', dateEnd: '2024-05-31' },
    { id: 2, name: 'Período 2', dateStart: '2024-06-01', dateEnd: '2024-10-31' },
    { id: 3, name: 'Período 3', dateStart: '2024-11-01', dateEnd: '2025-03-31' },
    { id: 4, name: 'Período 4', dateStart: '2025-04-01', dateEnd: '2025-08-31' },
    { id: 5, name: 'Período 5', dateStart: '2025-09-01', dateEnd: '2025-12-31' }
];

const initialValues: TemplateModel = {
    id: 0,
    templateName: "",
    folders: [],
    period: ""
}

const validationSchema = Yup.object<TemplateModel>().shape({
    templateName: Yup.string().required("El nombre de la plantilla es obligatorio"),
    period: Yup.number().required("El periodo académico es obligatorio"),
    folders: Yup.array().required("Las carpetas son obligatorias").min(1, "Debe ingresar al menos una carpeta"),
});

export default function FormTemplate({ onSubmitSuccess, onCancel, selectedTemplate }:
    {
        onSubmitSuccess: () => void,
        onCancel: () => void,
        selectedTemplate: TemplateModel | null
    }) {
    const [listAcademicPeriods, setListAcademicPeriods] = useState<AcademicPeriodData[]>([]);
    const [loading, setLoading] = useState(false);
    const idRef = useRef<number>(selectedTemplate?.id || 0);

    const form = useForm({
        initialValues: idRef.current && selectedTemplate !== null ?
            { ...selectedTemplate } :
            initialValues,
        validate: yupResolver(validationSchema)
    });

    const getAcademicPeriods = async () => {
        /* const res = await getAcademicPeriodsService();
        if (res.data === null) return; */
        const academicPeriods: AcademicPeriodData[] = periods.map((period) => ({ value: period.id.toString(), label: period.name }))
        setListAcademicPeriods(academicPeriods);

    };

    const handleSubmit = async (formTemplate: TemplateModel) => {
        setLoading(true)
        if (idRef.current !== 0) {
            const res = await editTemplateService(idRef.current, formTemplate);
            if (res.message === null) return setLoading(false)
            toast.success(res.message);
        } else {
            const res = await saveTemplateService(formTemplate)
            if (res.message === null) return setLoading(false)
            toast.success(res.message);
        }
        setLoading(false)
        onSubmitSuccess()
        onCancel();
    }

    useEffect(() => {
        getAcademicPeriods();
    }, []);


    return (
        <Flex direction="column" p="lg">

            <Text className="text-center" mb="lg">{idRef.current ? "Editar Plantilla" : "Crear Plantilla"}</Text>
            <form onSubmit={form.onSubmit(handleSubmit)} >
                <Flex direction="column" gap="md">
                    <TextInput
                        maxLength={50}
                        withAsterisk
                        disabled={(idRef.current != 0) ? true : false}
                        label="Nombre de la plantilla"
                        {...form.getInputProps("templateName")}
                    />

                    <Select
                        withAsterisk
                        label="Periodo Académico"
                        placeholder="Seleccione"
                        data={listAcademicPeriods}
                        {...form.getInputProps("period")}
                    />

                    <TagsInput
                        label="Presione enter para ingresar una carpeta"
                        placeholder="Ingresar Carpeta"
                        maxTags={10}
                        clearable
                        {...form.getInputProps("folders")}
                    />

                </Flex>
                <Flex justify="space-between" mt="lg">
                    <Button variant="white" onClick={onCancel}>Cancelar</Button>
                    <Button loading={loading} type="submit">Aceptar</Button>
                </Flex>
            </form>
        </Flex>
    )
}