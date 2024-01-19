import { Button, Flex, MultiSelect, PasswordInput, Select, Text, TextInput } from "@mantine/core";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useForm, yupResolver } from "@mantine/form";
import { Campus } from "@/app/models/campus.model";
import { editCampusService } from "../services/editCampus.service";
import { saveCampusService } from "../services/saveCampus.service";
import { toast } from "sonner";

const initialValues: Campus = {
    id: 0,
    name: "",
}

const validationSchema = Yup.object<Campus>().shape({
    name: Yup.string().required("El nombre del campus es obligatorio"),
});

export default function FormCampus({ onSubmitSuccess, onCancel, selectedCampus }:
    {
        onSubmitSuccess: () => void,
        onCancel: () => void,
        selectedCampus: Campus | null
    }) {
    const [loading, setLoading] = useState(false);
    const idRef = useRef<number>(selectedCampus?.id || 0);

    const form = useForm({
        initialValues: idRef.current && selectedCampus !== null ?
            { ...selectedCampus } :
            initialValues,
        validate: yupResolver(validationSchema)
    });


    const handleSubmit = async (formCampus: Campus) => {
        setLoading(true)
        const Campus: Campus = { ...formCampus};
        if (idRef.current !== 0) {
            const res = await editCampusService(idRef.current.toString(), Campus);
            if (res.message === null) return setLoading(false)
            toast.success(res.message);
        } else {
            const res = await saveCampusService(Campus)
            if (res.message === null) return setLoading(false)
            toast.success(res.message);
        }
        setLoading(false)
        onSubmitSuccess()
        onCancel();
    }

    useEffect(() => {
    }, []);


    return (
        <Flex direction="column" p="lg">

            <Text className="text-center font-bold text-blue-500" mb="lg">{idRef.current ? "Editar Campus" : "Crear Campus"}</Text>
            <form onSubmit={form.onSubmit(handleSubmit)} >
                <Flex direction="column" gap="md">
                    <TextInput
                        maxLength={25}
                        withAsterisk
                        
                        label="Campus"
                        {...form.getInputProps("name")}
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