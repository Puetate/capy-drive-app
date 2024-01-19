import { Career } from "@/app/models/career.model";
import { CareerAcadPeriodReq } from "@/app/models/careerAcadPeriod.model";
import { Button, Flex, Select, Text, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { getPeriodsWithoutMineService } from "../../periods/services/getPeriodsWithoutMine.service";
import { DataSelect } from "../../users/components/form-user";
import { saveCareerAcadPeriodService } from "../../careers/services/saveCareerAcadPeriod.service";

const initialValues: Career = {
    id: 0,
    faculty: "",
    name: "",
    academicPeriods: "",
}

const validationSchema = Yup.object<CareerAcadPeriodReq>().shape({
    academicPeriods: Yup.string().required("El periodo académico es obligatorio")
});

export default function FormStudentAcadPeriod({ onSubmitSuccess, onCancel, selectedCareer }:
    {
        onSubmitSuccess: () => void,
        onCancel: () => void,
        selectedCareer: Career | null
    }) {
    const [listAcademicPeriods, setListAcademicPeriods] = useState<DataSelect[]>([]);
    const listPeriods = useRef<string[]>(selectedCareer?.academicPeriods as string[]);
    const [loading, setLoading] = useState(false);
    const idRef = useRef<number>(selectedCareer?.id || 0);

    const form = useForm({
        initialValues: idRef.current && selectedCareer !== null ?
            { ...selectedCareer, academicPeriods: "" } :
            initialValues,
        validate: yupResolver(validationSchema)
    });

    const getAcademicPeriod = async () => {
        const res = await getPeriodsWithoutMineService(idRef.current.toString());
        if (res.data === null) return;
        const academicPeriod: DataSelect[] = res.data.map((academicPeriod) => ({ value: academicPeriod.id.toString(), label: academicPeriod.name }));
        setListAcademicPeriods(academicPeriod);
    };

    const handleSubmit = async (formCareer: Career) => {
        setLoading(true)
        const careerPeriod: CareerAcadPeriodReq = { career: formCareer.id.toString(), academicPeriod: (formCareer.academicPeriods as string)! }
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
                    {(selectedCareer?.academicPeriods?.length! > 0) &&
                        <TextInput
                            disabled
                            label="Periodos Registrados"
                            value={listPeriods.current.join(", ")}
                        />
                    }

                    <Select
                        comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
                        withAsterisk
                        label="Periodos Académicos"
                        placeholder="Seleccione"
                        data={listAcademicPeriods}
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