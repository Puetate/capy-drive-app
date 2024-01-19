"use client"
import { Button, Flex, Group, MultiSelect, PasswordInput, Select, Text, TextInput } from "@mantine/core";
import * as Yup from "yup";
import { useEffect, useRef, useState } from "react";
import { useForm, yupResolver } from "@mantine/form";
import { User } from "@/app/models/user.model";
import { editUserService } from "../services/editUser.service";
import { saveUserService } from "../services/saveUser.service";
import { Role } from "@/app/models/role.model";
import { getCareersService } from "../../careers/services/getCareers.service";
import { Faculty } from "@/app/models/faculty.models";
import { Career } from "@/app/models/career.model";
import { getUserRolesService } from "../services/getUserRoles.service";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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
        getRoles();
        getCareers();
    }, []);


    return (
        <Flex direction="column" p="lg">

            <Text className="text-center" mb="lg">{idRef.current ? "Editar Usuario" : "Crear Usuario"}</Text>
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
                            label="Nombres"
                            {...form.getInputProps("names")}
                        />
                        <TextInput
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
                        label="Teléfono"
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