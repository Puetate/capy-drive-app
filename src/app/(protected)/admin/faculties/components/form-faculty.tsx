"use client"
import { Button, Flex, MultiSelect, PasswordInput, Select, Text, TextInput } from "@mantine/core";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useForm, yupResolver } from "@mantine/form";
import { Faculty } from "@/app/models/faculty.models";
import { editFacultyService } from "../services/editFaculties.service";
import { saveFacultyService } from "../services/saveFaculties.service";
import { toast } from "sonner";
import { getCampusService } from "../../campus/services/getCampus.service";

interface CampusData {
    value: string;
    label: string;
}

const initialValues: Faculty = {
    id: 0,
    name: "",
    campus: 0,
}

const validationSchema = Yup.object<Faculty>().shape({
    name: Yup.string().required("El nombre de la facultad es obligatorio"),
    campus: Yup.string().required("El campus es obligatorio").min(1, "Debe elegir un campus"),
});

export default function FormFaculty({ onSubmitSuccess, onCancel, selectedFaculty }:
    {
        onSubmitSuccess: () => void,
        onCancel: () => void,
        selectedFaculty: Faculty | null
    }) {
    const [listCampus, setListCampus] = useState<CampusData[]>([]);
    const [loading, setLoading] = useState(false);
    const idRef = useRef<number>(selectedFaculty?.id as number || 0);

    const form = useForm({
        initialValues: idRef.current && selectedFaculty !== null ?
            { ...selectedFaculty } :
            initialValues,
        validate: yupResolver(validationSchema)
    });

    const getCampus = async () => {
        const res = await getCampusService();
        if (res.data === null) return;
        const campus: CampusData[] = res.data.map((campus) => ({ value: campus.id.toString(), label: campus.name }))
        setListCampus(campus);

    };

    const handleSubmit = async (formFaculty: Faculty) => {
        setLoading(true)
        let campusId: number;

        if (typeof formFaculty.campus === "string") {
            campusId = parseInt(formFaculty.campus, 10);
        } else if (typeof formFaculty.campus === "number") {
            campusId = formFaculty.campus;
        } else {
            campusId = formFaculty.campus?.id || 0;
        }

        const faculty: Faculty = {
            ...formFaculty,
            campus: campusId,
        };

        if (idRef.current !== 0) {

            const res = await editFacultyService(idRef.current.toString(), faculty);
            if (res.message === null) return setLoading(false)
            toast.success(res.message);
        } else {
            const res = await saveFacultyService(faculty)
            if (res.message === null) return setLoading(false)
            toast.success(res.message);
        }
        setLoading(false)
        onSubmitSuccess()
        onCancel();
    }


    useEffect(() => {
        getCampus();
    }, []);


    return (
        <Flex direction="column" p="lg">

            <Text className="text-center" mb="lg">{idRef.current ? "Editar Facultad" : "Crear Facultad"}</Text>
            <form onSubmit={form.onSubmit(handleSubmit)} >
                <Flex direction="column" gap="md">
                    <TextInput
                        withAsterisk
                        label="Nombres"
                        {...form.getInputProps("name")}
                    />

                    <Select
                        comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}

                        withAsterisk
                        label="Campus"
                        placeholder="Seleccione"
                        data={listCampus}
                        {...form.getInputProps("campus")}
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