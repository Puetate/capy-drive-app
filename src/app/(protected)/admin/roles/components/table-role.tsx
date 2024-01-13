"use client";
import { Role } from "@/app/models/role.model";
import DataTable from "@/components/data-table";
import { ActionIcon, Button, Container, Flex, Group, TextInput, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconShieldPlus, IconTrash } from "@tabler/icons-react";
import { DataTableColumn } from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";

export default function TableRole() {
    const [listRoles, setListRoles] = useState<Role[]>([]);
    const [opened, { open, close }] = useDisclosure()


    const getRoles = async () => {
        /* const res = await getRolesService();
            if (res.error || res.data === null) return
            const rolesData = res.data;
             */
        const rolesData: Role[] = [{ name: "Super Admin" }, { name: "Admin" }, { name: "Secretaria" }];
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        setListRoles(rolesData);
    };

    useEffect(() => {
        getRoles();
    }, []);

    const RolesColumns = useMemo<DataTableColumn<Role>[]>(
        () => [
            { accessor: "rolName", title: "Rol" },
            {
                titleClassName: "text-center",
                accessor: "actions",
                title: "Acciones",
                render: (rol) => (
                    <Group className="flex flex-row items-center justify-center">
                        <Tooltip label="Editar">
                            <ActionIcon
                                color="violet"
                                variant="light"
                            // onClick={}
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
                <Button size="md"> <Group><>Crear Rol</> <IconShieldPlus /> </Group></Button>
            </Group>
            <DataTable columns={RolesColumns} records={listRoles}></DataTable>
        </Flex>


    );
}
