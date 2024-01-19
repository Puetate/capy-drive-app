"use client"
import { Button, Flex, Text, TextInput } from "@mantine/core";
import * as Yup from "yup";
import { useRef, useState } from "react";
import { useForm, yupResolver } from "@mantine/form";
import { toast } from "sonner";
import { Student } from "@/app/models/student.model";
import editStudentService from "../services/editStudent.service";

const initialValues: Student = {
    id: 0,
    names: "",
    surnames: "",
    phone: "",
    dni: "",
    email: "",
    career: "",
}

const validationSchema = Yup.object<Student>().shape({
    names: Yup.string().required("El nombre es obligatorio"),
    surnames: Yup.string().required("El apellido es obligatorio"),
    phone: Yup.string().required("El teléfono es obligatorio"),
    dni: Yup.string().required("La identificación es obligatorio"),
    email: Yup.string().required("El email es obligatorio"),
});

export default function FormStudent({ onSubmitSuccess, onCancel, selectedStudent }:
    {
        onSubmitSuccess: () => void,
        onCancel: () => void,
        selectedStudent: Student | null
    }) {
    const [loading, setLoading] = useState(false);
    const idRef = useRef<number>(selectedStudent?.id || 0);

    const form = useForm({
        initialValues: idRef.current && selectedStudent !== null ?
            { ...selectedStudent } :
            initialValues,
        validate: yupResolver(validationSchema)
    });

    const handleSubmit = async (formStudent: Student) => {
        setLoading(true)

        if (idRef.current !== 0) {
            const res = await editStudentService(idRef.current, formStudent);
            if (res.message === null) return setLoading(false)
            toast.success(res.message);
        }
        setLoading(false)
        onSubmitSuccess()
        onCancel();
    }



    return (
        <Flex direction="column" p="lg">

            <Text className="text-center font-bold text-blue-500" mb="lg">{idRef.current ? "Editar Usuario" : "Crear Usuario"}</Text>
            <form onSubmit={form.onSubmit(handleSubmit)} >
                <Flex direction="column" gap="md">
                    <TextInput
                        minLength={10}
                        maxLength={13}
                        withAsterisk
                        disabled={(idRef.current != 0) ? true : false}
                        label="Identificación"
                        {...form.getInputProps("dni")}
                    />

                    <div className="flex flex-row gap-3" >

                        <TextInput
                            maxLength={30}
                            withAsterisk
                            label="Nombres"
                            {...form.getInputProps("names")}
                        />
                        <TextInput
                            maxLength={30}
                            withAsterisk
                            label="Apellidos"
                            {...form.getInputProps("surnames")}
                        />
                    </div>
                    <TextInput
                        width="1"
                        withAsterisk
                        label="Correo Electrónico"
                        {...form.getInputProps("email")}
                    />

                    <TextInput
                        withAsterisk
                        maxLength={10}
                        label="Teléfono"
                        {...form.getInputProps("phone")}
                    />

                    {/* <MultiSelect
                        disabled
                        comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
                        className="text-black"
                        withAsterisk
                        label="Periodos Académicos"
                        placeholder="Seleccione"
                        data={selectedStudent?.periods}
                        {...form.getInputProps("periods")}
                    /> */}

                    <TextInput
                        disabled
                        withAsterisk
                        label="Carrera"
                        {...form.getInputProps("career")}
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