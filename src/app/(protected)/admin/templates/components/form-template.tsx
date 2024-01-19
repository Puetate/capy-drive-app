import { Button, Flex, MultiSelect, PasswordInput, Select, TagsInput, Text, TextInput } from "@mantine/core";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useForm, yupResolver } from "@mantine/form";
import { toast } from "sonner";
import { Folders, TemplateModel } from "@/app/models/templateModel.model";
import saveTemplateService from "../services/saveTemplate.service";
import editTemplateService from "../services/editTemplate.service";
import { getPeriodsService } from "../../periods/services/getPeriods.service";
import { DataSelect } from "../../users/components/form-user";
import { getCareersService } from "../../careers/services/getCareers.service";
import { Faculty } from "@/app/models/faculty.models";
import { getPeriodsByCareerService } from "../../periods/services/getPeriodsByCareer.service";

const initialValues: TemplateModel = {
    id: 0,
    name: "",
    folders: [],
    academicPeriod: "",
    career: ""
}

const validationSchema = Yup.object<TemplateModel>().shape({
    name: Yup.string().required("El nombre de la plantilla es obligatorio"),
    academicPeriod: Yup.string().required("El periodo académico es obligatorio"),
    folders: Yup.array().required("Las carpetas son obligatorias").min(1, "Debe ingresar al menos una carpeta"),
    career: Yup.string().required("La carrera es obligatoria"),
});

export default function FormTemplate({ onSubmitSuccess, onCancel, selectedTemplate }:
    {
        onSubmitSuccess: () => void,
        onCancel: () => void,
        selectedTemplate: TemplateModel | null
    }) {
    const [loading, setLoading] = useState(false);
    const [listAcademicPeriods, setListAcademicPeriods] = useState<DataSelect[]>([]);
    const [listCareers, setListCareers] = useState<DataSelect[]>([]);
    const [valueCareer, setValueCareer] = useState<string | null>('');
    const idRef = useRef<number>(selectedTemplate?.id || 0);

    const form = useForm({
        initialValues: idRef.current && selectedTemplate !== null ?
            { ...selectedTemplate } :
            initialValues,
        validate: yupResolver(validationSchema)
    });

    const getAcademicPeriods = async (careerID: string) => {
        const res = await getPeriodsByCareerService(careerID);
        if (res.data === null) return;
        const periods: DataSelect[] = res.data.academicPeriods.map((periods) => ({ value: periods.id.toString(), label: periods.name }))
        setListAcademicPeriods(periods);
    };

    const getCareers = async () => {
        const res = await getCareersService();
        if (res.data === null) return;
        const careers: DataSelect[] = res.data.map((career) => ({ value: career.id.toString(), label: `${(career.faculty as Faculty).name} - ${career.name}` }))
        setListCareers(careers);

    };

    const handleSubmit = async (formTemplate: TemplateModel) => {
        setLoading(true)
        const { folders: foldersName } = formTemplate;
        const folders: Folders[] = (foldersName as string[]).map((folderName) => ({ name: folderName }))
        const template: TemplateModel = { ...formTemplate, folders }

        if (idRef.current !== 0) {
            const res = await editTemplateService(idRef.current, template);
            if (res.message === null) return setLoading(false)
            toast.success(res.message);
        } else {
            const res = await saveTemplateService(template);
            if (res.message === null) return setLoading(false)
            toast.success(res.message);
        }
        setLoading(false)
        onSubmitSuccess()
        onCancel();
    }

    const onChangeSelect = (selectedOption: DataSelect) => {
        if (selectedOption === null) {
            setListAcademicPeriods([]);
            return;
        }

        setValueCareer(selectedOption.value.toString());
        getAcademicPeriods(selectedOption.value);
    }

    useEffect(() => {
        getCareers();
    }, []);

    useEffect(() => {
        if (valueCareer) {
            getAcademicPeriods(valueCareer);
        } else {
            setListAcademicPeriods([])
        }
    }, [valueCareer]);


    return (
        <Flex direction="column" p="lg">

            <Text className="text-center font-bold text-blue-500" mb="lg">{idRef.current ? "Editar Plantilla" : "Crear Plantilla"}</Text>
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
                        className="text-black"
                        withAsterisk
                        label="Carrera"
                        placeholder="Seleccione"
                        data={listCareers}
                        {...form.getInputProps("career")}
                        onChange={(e) => {
                            setValueCareer(e)
                            if (form.getInputProps("career").onChange)
                                form.getInputProps("career").onChange(e)
                        }
                        }
                    />
                    <Select
                        comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
                        withAsterisk
                        disabled={(listAcademicPeriods.length === 0) ? true : false}
                        label="Periodo Académico"
                        placeholder="Seleccione"
                        data={listAcademicPeriods}
                        {...form.getInputProps("academicPeriod")}
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