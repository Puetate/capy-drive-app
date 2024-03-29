"use client"
import { Career } from "@/app/models/career.model";
import { Faculty } from "@/app/models/faculty.models";
import { Role } from "@/app/models/role.model";
import { User } from "@/app/models/user.model";
import { Button, Flex, MultiSelect, Text, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { getCareersService } from "../../careers/services/getCareers.service";
import { editUserService } from "../services/editUser.service";
import { getUserRolesService } from "../services/getUserRoles.service";
import { saveUserService } from "../services/saveUser.service";
import { encriptar } from "@/lib/utils/aes";

export interface DataSelect {
    value: string;
    label: string;
    disabled?: boolean
}

const initialValues: User = {
    id: 0,
    names: "",
    surnames: "",
    fullName: "",
    phone: "",
    dni: "",
    email: "",
    roles: [],
    role: "",
    password: "",
    careers: []
}

const validationSchema = Yup.object<User>().shape({
    dni: Yup.string().required("La identificación es obligatoria"),
    names: Yup.string().required("Los nombres son obligatorio"),
    surnames: Yup.string().required("Los apellidos son obligatorio"),
    // status: Yup.string().required("La estado es obligatorio"),
    email: Yup.string().required("El correo es obligatorio"),
    phone: Yup.string().required("El teléfono es obligatorio"),
    roles: Yup.array().required("La estado es obligatorio").min(1, "Debe elegir al menos un rol"),
    careers: Yup.array().required("La estado es obligatorio").min(1, "Debe elegir al menos una carrera"),
});

export default function FormUser({ onSubmitSuccess, onCancel, selectedUser }:
    {
        onSubmitSuccess: () => void,
        onCancel: () => void,
        selectedUser: User | null
    }) {
    const [listRoles, setListRoles] = useState<DataSelect[]>([]);
    const [listCareers, setListCareers] = useState<DataSelect[]>([]);
    const [loading, setLoading] = useState(false);
    const idRef = useRef<number>(selectedUser?.id || 0);
    const { data: session } = useSession();

    const form = useForm({
        initialValues: idRef.current && selectedUser !== null ?
            { ...selectedUser } :
            initialValues,
        validate: yupResolver(validationSchema)
    });

    const getRoles = async () => {
        const res = await getUserRolesService(session?.user!.id!.toString()!);
        if (res.data === null) return;
        const roles: DataSelect[] = res.data.map((rol) => ({ value: rol.id.toString(), label: rol.name }))
        setListRoles(roles);
    };

    const getCareers = async () => {
        const res = await getCareersService();
        if (res.data === null) return;
        const careers: DataSelect[] = res.data.map((career) => ({ value: career.id.toString(), label: `${(career.faculty as Faculty).name} - ${career.name}` }))
        setListCareers(careers);
    };


    const handleSubmit = async (formUser: User) => {
        setLoading(true)
        const roles = formUser.roles.map((role) => ({ id: parseInt(role.toString()), name: "" } as Role));
        const careers = formUser.careers.map((career) => ({ id: parseInt(career.toString()), name: "" } as Career));
        const user: User = { ...formUser, roles, careers };

        if (idRef.current !== 0) {
            const res = await editUserService(idRef.current, user);
            if (res.message === null) return setLoading(false)
            toast.success(res.message);
        } else {
            const res = await saveUserService(user)
            if (res.message === null) return setLoading(false)
            toast.success(res.message);
        }
        setLoading(false)
        onSubmitSuccess()
        onCancel();
    }

    useEffect(() => {
        encriptar("0401527650");
        getRoles();
        getCareers();
    }, []);


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
                            withAsterisk
                            maxLength={30}
                            label="Nombres"
                            {...form.getInputProps("names")}
                        />
                        <TextInput
                            withAsterisk
                            maxLength={30}
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
                        label="Teléfono"
                        maxLength={10}
                        {...form.getInputProps("phone")}
                    />

                    <MultiSelect
                        comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}

                        withAsterisk
                        label="Carrera"
                        placeholder="Seleccione"
                        data={listCareers}
                        {...form.getInputProps("careers")}
                    />

                    <MultiSelect
                        comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}

                        withAsterisk
                        label="Roles"
                        placeholder="Seleccione"
                        data={listRoles}
                        {...form.getInputProps("roles")}
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