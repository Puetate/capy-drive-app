"use client";
import { ActionIcon, Badge, Button, Chip, Container, Flex, Group, Modal, TextInput, Tooltip } from "@mantine/core";
import { IconEdit, IconShieldPlus, IconTrash, IconUserPlus } from "@tabler/icons-react";
import { getUsersService } from "../services/getUsers.service";
import { useEffect, useMemo, useRef, useState } from "react";
import { DataTableColumn } from "mantine-datatable";
import DataTable from "@/components/data-table";
import { useDisclosure } from "@mantine/hooks";
import FormUser from "./form-user";
import Each from "@/lib/utils/each";
import { Role } from "@/app/models/role.model";
import { User } from "@/app/models/user.model";
import { deleteUserService } from "../services/deleteUser.service";
import { toast } from "sonner";
import ConfirmDialog from "@/app/(protected)/components/ConfirmDialog";
import InputsFilters from "@/app/(protected)/components/InputsFilters";
import { encriptar } from "./aes";
import { Career } from "@/app/models/career.model";

const getConfirmMessage = (name: string): string => (`¿Seguro que desea eliminar al usuario ${name}?`)


export default function TableUser() {
    const [listUsers, setListUsers] = useState<User[]>([]);
    const [opened, { open, close }] = useDisclosure();
    const [openedDialog, { open: openDialog, close: closeDialog }] = useDisclosure()
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const listUsersRef = useRef<User[]>([]);


    const getRolesNames = (userRolesArray: Role[]) => userRolesArray.map((role) => role.name);
    const getCareersNames = (userRolesArray: Career[]) => userRolesArray.map((career) => career.name);

    const getUsers = async () => {
        const res = await getUsersService();
        console.log(res.data);

        if (res.data === null) return
        const users: User[] = res.data.map(user => ({
            ...user,
            role: getRolesNames(user.roles as Role[]).join(", "),
            fullName: `${user.names} ${user.surnames}`,
            career: getRolesNames(user.careers as Career[]).join(", "),
        })); 
        setListUsers(users);
        listUsersRef.current = users;
    };

    const onClickEditButton = (user: User) => {
        const rolesID: string[] = user.roles.map((rol) => (rol as Role).id.toString())
        const careersID: string[] = user.careers.map((career) => (career as Career).id.toString())
        setSelectedUser({ ...user, roles: rolesID, password: "", careers:careersID });
        open()
    }

    const onSubmitSuccess = async () => {
        close()
        await getUsers()
    };

    const onClickAddButton = () => {
        encriptar();
        setSelectedUser(null);
        open()
    }

    const onClickDeleteButton = async (user: User) => {
        setSelectedUser(user)
        openDialog()
    }

    const handleDeleteUser = async () => {
        const { id } = selectedUser!;
        if (!id) return;
        const res = await deleteUserService(id);
        if (res.message === null) { toast.error("No se pudo eliminar al Usuario"); return };
        toast.success(res.message);
        await getUsers();
        closeDialog();
    }

    const generalFilter = (value: string) => {
        if (value == "") {
            return setListUsers(listUsersRef.current);
        } 
        const filteredList = listUsersRef.current.filter(
            ({ dni, email, fullName, role, career }: User) => {
                const filter = `${dni} ${email} ${fullName} ${role} ${career}` ;
                return filter.toLowerCase().includes(value.trim().toLowerCase());
            },
        );
        return setListUsers(filteredList);
    }

    useEffect(() => {
        getUsers();
    }, []);

    const UsersColumns = useMemo<DataTableColumn<User>[]>(
        () => [
            { accessor: "fullName", title: "Nombre" },
            { accessor: "dni", title: "DNI" },
            { accessor: "email", title: "Email" },
            { accessor: "phone", title: "Teléfono" },
            // { accessor: "role", title: "Roles" },
            {
                accessor: "role",
                title: "Roles",
                render: (user) => (<Group className="">
                    <Each of={user.roles as Role[]} render={(item, index) =>
                        <Badge key={index} radius="md" size="lg" color="orange" >{`${item.name}`} </Badge>
                    }></Each>
                </Group>)
            },
            {
                accessor: "career",
                title: "Carreras",
                render: (user) => (<Group className="">
                    <Each of={user.careers as Role[]} render={(item, index) =>
                        <Badge key={index} radius="md" size="lg" color="cyan" >{`${item.name}`} </Badge>
                    }></Each>
                </Group>)
            },
            {
                titleClassName: "text-center",
                accessor: "actions",
                title: "Acciones",
                render: (user) => (
                    <Group className="flex flex-row items-center justify-center">
                        <Tooltip label="Editar">
                            <ActionIcon
                                color="violet"
                                variant="light"
                                onClick={() => onClickEditButton(user)}
                            >
                                <IconEdit />
                            </ActionIcon>
                        </Tooltip>
                        {/* <Tooltip label="Eliminar">
                            <ActionIcon
                                color="red"
                                variant="light"
                                onClick={() => onClickDeleteButton(user)}
                            >
                                <IconTrash />
                            </ActionIcon>
                        </Tooltip> */}
                    </Group>
                ),
                textAlignment: "center"
            }
        ],
        []
    );

    return (
        <Flex direction="column" h="100%" gap=".15rem">

            <Group className="mb-3" gap="xl">
                <InputsFilters onChangeFilters={generalFilter} />
                <Button size="sm" onClick={onClickAddButton} > <Group><>Crear Usuario</> <IconUserPlus /> </Group></Button>
            </Group>
            <DataTable columns={UsersColumns} records={listUsers}></DataTable>
            <Modal size="md" opened={opened} onClose={close} withCloseButton={false} >
                <FormUser onCancel={close} onSubmitSuccess={onSubmitSuccess} selectedUser={selectedUser} />
            </Modal>
            <ConfirmDialog opened={openedDialog} onClose={closeDialog} message={(selectedUser) ? getConfirmMessage(selectedUser!.fullName!) : ""} onConfirm={handleDeleteUser} />
        </Flex>
    );
}
