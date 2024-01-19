import { Button, Flex, MultiSelect, PasswordInput, Select, Text, TextInput } from "@mantine/core";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useForm, yupResolver } from "@mantine/form";
import { toast } from "sonner";
import { Career } from "@/app/models/career.model";
import { getFacultyService } from "../../faculties/services/getFaculties.service";
import { editCareerService } from "../services/editCareer.service";
import { getPeriodsService } from "../../periods/services/getPeriods.service";
import { DataSelect } from "../../users/components/form-user";
import { CareerAcadPeriodReq } from "@/app/models/careerAcadPeriod.model";
import { saveCareerAcadPeriodService } from "../services/saveCareerAcadPeriod.service";

const initialValues: Career = {
    id: 0,
    faculty: "",
    name: "",
    academicPeriods: [],
}

const validationSchema = Yup.object<CareerAcadPeriodReq>().shape({
    academicPeriods: Yup.array().min(1, "El periodo académico es obligatorio").required("El periodo académico es obligatorio")
});

export default function FormCareerAcadPeriod({ onSubmitSuccess, onCancel, selectedCareer }:
    {
        onSubmitSuccess: () => void,
        onCancel: () => void,
        selectedCareer: Career | null
    }) {
    const [listFaculties, setListFaculties] = useState<DataSelect[]>([]);
    const [listAcademicPeriods, setListAcademicPeriods] = useState<DataSelect[]>([]);
    const listPeriods = useRef<string[]>([]);
    const [loading, setLoading] = useState(false);
    const idRef = useRef<number>(selectedCareer?.id || 0);

    const form = useForm({
        initialValues: idRef.current && selectedCareer !== null ?
            { ...selectedCareer, } :
            initialValues,
        validate: yupResolver(validationSchema)
    });

    const getFaculties = async () => {
        const res = await getFacultyService();
        if (res.data === null) return;
        const faculties: DataSelect[] = res.data.map((faculty) => ({ value: faculty.id.toString(), label: faculty.name }))
        setListFaculties(faculties);
    };

    const getAcademicPeriod = async () => {
        const res = await getPeriodsService();
        if (res.data === null) return;
        const academicPeriod: DataSelect[] = res.data.map((academicPeriod) => {
            if (selectedCareer!.academicPeriods != null && (selectedCareer!.academicPeriods as string[]).includes(academicPeriod.id.toString())) {

                listPeriods.current.push(academicPeriod.name)
                return { value: "", label: "", disabled: true }
            }

            return { value: academicPeriod.id.toString(), label: academicPeriod.name, disabled: false }

        });
        setListAcademicPeriods(academicPeriod);
    };

    const handleSubmit = async (formCareer: Career) => {
        setLoading(true)
        const careerPeriod: CareerAcadPeriodReq = { career: formCareer.id.toString(), academicPeriod: (formCareer.academicPeriods as string[])![0] }
        console.log(careerPeriod);

        if (idRef.current !== 0) {
            const res = await saveCareerAcadPeriodService(careerPeriod);
            if (res.message === null) return;
            setLoading(false)
            toast.success(res.message);
        }
        setLoading(false)
        onSubmitSuccess()
        onCancel();
    }

    useEffect(() => {
        getFaculties();
        getAcademicPeriod();
    }, []);

    return (
        <Flex direction="column" p="lg">
            <Text className="text-center font-bold text-blue-500" mb="lg">{idRef.current ? "Editar Carrera" : "Crear Carrera"}</Text>
            <form onSubmit={form.onSubmit(handleSubmit)} >
                <Flex direction="column" gap="md">

                    <TextInput
                        disabled
                        label="Nombre de Carrera"
                        {...form.getInputProps("name")}
                    />

                    <TextInput
                        disabled
                        label="Facultad"
                        {...form.getInputProps("faculty")}
                    />
                    {(selectedCareer?.academicPeriods?.length! > 0) &&
                        <TextInput
                            disabled
                            label="Periodos Registrados"
                            value={listPeriods.current.join(", ")}
                        />
                    }

                    <MultiSelect
                        comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
                        withAsterisk
                        maxValues={(selectedCareer?.academicPeriods!.length! + 1)}
                        label="Periodos Académicos"
                        placeholder="Seleccione"
                        data={listAcademicPeriods}
                        hidePickedOptions
                        {...form.getInputProps("academicPeriods")}
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