"use client"
import { Button, Flex, MultiSelect, PasswordInput, Select, Text, TextInput } from "@mantine/core";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useForm, yupResolver } from "@mantine/form";
import { editPeriodsService } from "../services/edittPeriods.service";
import {savePeriodsService } from "../services/savePeriods.service";
import { toast } from "sonner";
import { AcademicPeriod } from "@/app/models/academicPeriod.model";
import { DateInput } from "@mantine/dates";
import "dayjs/locale/es";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const initialValues: AcademicPeriod = {
    id: 0,
    name: "",
    startDate: new Date(),
    endDate: new Date()
};

const validationSchema = Yup.object<AcademicPeriod>().shape({
    name: Yup.string().required("El nombre del período académico es obligatorio"),
    startDate: Yup.string().required("La fecha de inicio del período académico es obligatorio"),
    endDate: Yup.string().required("La fecha de fin del período académico es obligatorio"),
});

export default function FormAcademicPeriod({ onSubmitSuccess, onCancel, selectedAcademicPeriod }:
    {
        onSubmitSuccess: () => void,
        onCancel: () => void,
        selectedAcademicPeriod: AcademicPeriod | null
    }) {
    const [loading, setLoading] = useState(false);
    const idRef = useRef<number>(selectedAcademicPeriod?.id || 0);

    const form = useForm({
        initialValues: selectedAcademicPeriod
            ? {
                ...selectedAcademicPeriod,
                startDate: new Date(dayjs(selectedAcademicPeriod.startDate).add(1, 'day').format("YYYY-MM-DD")),
                endDate: new Date(dayjs(selectedAcademicPeriod.endDate).add(1, 'day').format("YYYY-MM-DD")),
            }
            : initialValues,
        validate: yupResolver(validationSchema)
    });



    const handleSubmit = async (formAcademicPeriod: AcademicPeriod) => {
        setLoading(true)
        const AcademicPeriod: AcademicPeriod = {
            ...formAcademicPeriod,
        };

        dayjs.extend(customParseFormat);
        if (AcademicPeriod.startDate) {
            const localStartDate = dayjs(AcademicPeriod.startDate).toDate();
            const updatedStartDate = dayjs(localStartDate).subtract(0, "day").format("YYYY-MM-DD");
            AcademicPeriod.startDate = new Date(updatedStartDate);
        }

        if (AcademicPeriod.endDate) {
            const localEndDate = dayjs(AcademicPeriod.endDate).toDate();
            const updatedEndDate = dayjs(localEndDate).subtract(0, 'day').format('YYYY-MM-DD');
            AcademicPeriod.endDate = new Date(updatedEndDate);
        }

        if (idRef.current !== 0) {
            const res = await editPeriodsService(idRef.current.toString(), AcademicPeriod);
            if (res.message === null) return setLoading(false)
            toast.success(res.message);
        } else {
            const res = await savePeriodsService(AcademicPeriod)
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

            <Text className="text-center font-bold text-blue-500" mb="lg">{idRef.current ? "Editar Período Académico" : "Crear Período Académico"}</Text>
            <form onSubmit={form.onSubmit(handleSubmit)} >
                <Flex direction="column" gap="md">
                    <TextInput
                        maxLength={60}
                        withAsterisk
                        label="Período Académico"
                        {...form.getInputProps("name")}
                    />
                    <DateInput
                        valueFormat="YYYY-MM-DD"
                        withAsterisk
                        label="Fecha inicio"
                        locale="es"
                        {...form.getInputProps("startDate")}
                    />
                    <DateInput
                        valueFormat="YYYY-MM-DD"
                        withAsterisk
                        label="Fecha fin"
                        locale="es"
                        {...form.getInputProps("endDate")}
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