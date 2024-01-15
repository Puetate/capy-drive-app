import { Button, Flex, MultiSelect, PasswordInput, Select, TagsInput, Text, TextInput } from "@mantine/core";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useForm, yupResolver } from "@mantine/form";
import { toast } from "sonner";
import { TemplateModel } from "@/app/models/templateModel.model";
import saveTemplateService from "../services/saveTemplate.service";
import editTemplateService from "../services/editTemplate.service";
import { getPeriodsService } from "../../periods/services/getPeriods.service";

interface AcademicPeriodData {
    value: string;
    label: string;
}

const initialValues: TemplateModel = {
    id: 0,
    name: "",
    folders: [],
    period: 0,
}

const validationSchema = Yup.object<TemplateModel>().shape({
    name: Yup.string().required("El nombre de la plantilla es obligatorio"),
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
        const res = await getPeriodsService();
        if (res.data === null) return;
        const periods: AcademicPeriodData[] = res.data.map((periods) => ({ value: periods.id.toString(), label: periods.name }))
        setListAcademicPeriods(periods);
    };

    const handleSubmit = async (formTemplate: TemplateModel) => {
        setLoading(true)

        let periodsId: number;

        if (typeof formTemplate.period === "string") {
            periodsId = parseInt(formTemplate.period, 10);
        } else if (typeof formTemplate.period === "number") {
            periodsId = formTemplate.period;
        } else {
            periodsId = formTemplate.period?.id || 0;
        }

        const templateModel: TemplateModel = {
            ...formTemplate,
            period: periodsId,
        };

        if (idRef.current !== 0) {

            const res = await editTemplateService(idRef.current, templateModel);
            if (res.message === null) return setLoading(false)
            toast.success(res.message);
        } else {
            const res = await saveTemplateService(templateModel);
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
                        {...form.getInputProps("name")}
                    />

                    <Select
                        comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}

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