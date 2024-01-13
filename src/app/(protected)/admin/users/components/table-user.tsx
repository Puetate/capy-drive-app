"use client";
import { ActionIcon, Button, Chip, Container, Flex, Group, Modal, TextInput, Tooltip } from "@mantine/core";
import { IconEdit, IconShieldPlus, IconTrash } from "@tabler/icons-react";
import { getUsersService } from "../services/getUsers.service";
import { useEffect, useMemo, useState } from "react";
import { DataTableColumn } from "mantine-datatable";
import DataTable from "@/components/data-table";
import { useDisclosure } from "@mantine/hooks";
import FormUser from "./form-user";
import Each from "@/lib/utils/each";
import { Role } from "@/app/models/role.model";
import { User } from "@/app/models/user.model";

const titleModal = "Registro Usuario";

export default function TableUser() {
    const [listUsers, setListUsers] = useState<User[]>([]);
    const [opened, { open, close }] = useDisclosure();
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    const getRolesNames = (userRolesArray: Role[]) => userRolesArray.map((role) => role.rolName);

    const getUsers = async () => {
        const res = await getUsersService();

        if (res.data === null) return
        const users: User[] = res.data.map(user => ({
            ...user,
            fullName: `${user.names} ${user.surnames}`,
        }));
        console.log(users);

        setListUsers(users);
    };

    const onClickEditButton = (user: User) => {
        const rolesID: string[] = user.roles.map((rol) => (rol as Role).id.toString())
        setSelectedUser({ ...user, roles: rolesID });
        open()
    }

    const onSubmitSuccess = async () => {
        close()
        await getUsers()
    };

    const onClickAddButton = () => {
        setSelectedUser(null);
        open()
    }

    useEffect(() => {
        getUsers();
    }, []);

    const UsersColumns = useMemo<DataTableColumn<User>[]>(
        () => [
            { accessor: "fullName", title: "Nombre" },
            { accessor: "phone", title: "Teléfono" },
            { accessor: "dni", title: "DNI" },
            { accessor: "email", title: "Email" },
            // { accessor: "role", title: "Roles" },
            {
                accessor: "role",
                title: "Roles",
                render: (user) => (<Group className="">
                    <Each of={user.roles as Role[]} render={(item, index) =>
                        <Chip key={index} color="cyan" checked={true} icon={null} >{`${item.name}`} </Chip>
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
                        <Tooltip label="Editar">
                            <ActionIcon
                                color="red"
                                variant="light"
                            // onClick={}
                            >
                                <IconTrash />
                            </ActionIcon>
                        </Tooltip>
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
                <TextInput
                    className="w-1/3"
                    placeholder="Buscador"
                />
                <Button size="md" onClick={onClickAddButton} > <Group><>Crear Usuario</> <IconShieldPlus /> </Group></Button>
            </Group>
            <DataTable columns={UsersColumns} records={listUsers}></DataTable>
            <Modal opened={opened} onClose={close} withCloseButton={false} >
                <FormUser onCancel={close} onSubmitSuccess={onSubmitSuccess} selectedUser={selectedUser} />
            </Modal>
        </Flex>


    );
}
