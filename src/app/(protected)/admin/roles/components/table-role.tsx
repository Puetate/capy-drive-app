"use client";
import { Role } from "@/app/models/role.model";
import DataTable from "@/components/data-table";
import { ActionIcon, Button, Container, Flex, Group, TextInput, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconShieldPlus, IconTrash } from "@tabler/icons-react";
import { DataTableColumn } from "mantine-datatable";
import { useEffect, useMemo, useRef, useState } from "react";
import { getRolesService } from "../services/getRoles.service";
import InputsFilters from "@/app/(protected)/components/InputsFilters";

export default function TableRole() {
    const [listRoles, setListRoles] = useState<Role[]>([]);
    const [opened, { open, close }] = useDisclosure()
    const listRolesRef = useRef<Role[]>([]);


    const getRoles = async () => {
        const res = await getRolesService();
        if (res.data === null) return
        setListRoles(res.data);
        listRolesRef.current = res.data;
    };

    const generalFilter = (value: string) => {
        if (value == "") {
            return setListRoles(listRolesRef.current);
        }
        const filteredList = listRolesRef.current.filter(
            ({ name }: Role) => {
                const filter = `${name}`;
                return filter.toLowerCase().includes(value.trim().toLowerCase());

            },
        );
        return setListRoles(filteredList);
    }

    useEffect(() => {
        getRoles();
    }, []);

    const RolesColumns = useMemo<DataTableColumn<Role>[]>(
        () => [
            { accessor: "name", title: "Roles" },
            /* {
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
            } */
        ],
        []
    );

    return (
        <Flex direction="column" h="100%" gap=".15rem">

            <Group className="mb-3" gap="xl">
                <InputsFilters onChangeFilters={generalFilter} />
                {/* <Button size="sm"> <Group><>Crear Rol</> <IconShieldPlus /> </Group></Button> */}
            </Group>
            <DataTable columns={RolesColumns} records={listRoles}></DataTable>
        </Flex>


    );
}
