import { Button, Flex, MultiSelect, PasswordInput, Select, Text, TextInput } from "@mantine/core";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useForm, yupResolver } from "@mantine/form";
import { toast } from "sonner";
import { Career } from "@/app/models/career.model";
import { getFacultyService } from "../../faculties/services/getFaculties.service";
import { editCareerService } from "../services/editCareer.service";
import { saveCareerService } from "../services/saveCareer.service";
import { Faculty } from "@/app/models/faculty.models";
import { getPeriodsService } from "../../periods/services/getPeriods.service";
import { AcademicPeriod } from "@/app/models/academicPeriod.model";
import { DataSelect } from "../../users/components/form-user";

const initialValues: Career = {
    id: 0,
    name: "",
    faculty: "",
}

const validationSchema = Yup.object<Career>().shape({
    name: Yup.string().required("El nombre es obligatorio"),
    faculty: Yup.string().required("La facultad es obligatoria")
});

export default function FormCareerAcadPeriod({ onSubmitSuccess, onCancel, selectedCareer }:
    {
        onSubmitSuccess: () => void,
        onCancel: () => void,
        selectedCareer: Career | null
    }) {
    const [listFaculties, setListFaculties] = useState<DataSelect[]>([]);
    const [listAcademicPeriods, setListAcademicPeriods] = useState<DataSelect[]>([]);
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
        const academicPeriod: DataSelect[] = res.data.map((academicPeriod) => ({ value: academicPeriod.id.toString(), label: academicPeriod.name }));
        setListAcademicPeriods(academicPeriod);
    };

    const handleSubmit = async (formCareer: Career) => {
        setLoading(true)
        if (idRef.current !== 0) {
            const res = await editCareerService(idRef.current, formCareer);
            if (res.message === null) return setLoading(false)
            toast.success(res.message);
        } else {
            const res = await saveCareerService(formCareer)
            if (res.message === null) return setLoading(false)
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

            <Text className="text-center" mb="lg">{idRef.current ? "Editar Carrera" : "Crear Carrera"}</Text>
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

                    <MultiSelect                        
                        comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
                        withAsterisk
                        label="Periodos Académicos"
                        placeholder="Seleccione"
                        data={listAcademicPeriods}
                        {...form.getInputProps("careers")}
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