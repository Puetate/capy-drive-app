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

interface FacultyData {
    value: string;
    label: string;
}

const initialValues: Career = {
    id: 0,
    name: "",
    faculty: "",
}

const validationSchema = Yup.object<Career>().shape({
    name: Yup.string().required("El nombre es obligatorio"),
    faculty: Yup.string().required("La facultad es obligatoria")
});

export default function FormCareer({ onSubmitSuccess, onCancel, selectedCareer }:
    {
        onSubmitSuccess: () => void,
        onCancel: () => void,
        selectedCareer: Career | null
    }) {
    const [listFaculties, setListFaculties] = useState<FacultyData[]>([]);
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
        const faculties: FacultyData[] = res.data.map((faculty) => ({ value: faculty.id.toString(), label: faculty.name }))
        setListFaculties(faculties);

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
    }, []);

    return (
        <Flex direction="column" p="lg">

            <Text className="text-center font-bold text-blue-500" mb="lg">{idRef.current ? "Editar Carrera" : "Crear Carrera"}</Text>
            <form onSubmit={form.onSubmit(handleSubmit)} >
                <Flex direction="column" gap="md">

                    <TextInput
                        withAsterisk
                        maxLength={50}
                        label="Nombre de Carrera"
                        {...form.getInputProps("name")}
                    />

                    <Select
                        comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}

                        withAsterisk
                        label="Facultad"
                        placeholder="Seleccione"
                        data={listFaculties}
                        {...form.getInputProps("faculty")}
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