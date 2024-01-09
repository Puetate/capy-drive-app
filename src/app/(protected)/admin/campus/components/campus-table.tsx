"use client";
import DataTable from "@/components/data-table";
import { ActionIcon, Button, Container, Flex, Group, TextInput, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconShieldPlus, IconTrash } from "@tabler/icons-react";
import { DataTableColumn } from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";

export interface Campus {
    campusName: string;
}
export default function CampusTable() {
    const [listCampus, setListCampus] = useState<Campus[]>([]);
    const [opened, { open, close }] = useDisclosure()


    const getCampus = async () => {
        /* const res = await getRolesService();
            if (res.error || res.data === null) return
            const rolesData = res.data;
             */
        const campusData: Campus[] = [{ campusName: "Huachi" }, { campusName: "Ingaurco" }];
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        setListCampus(campusData);
    };

    useEffect(() => {
        getCampus();
    }, []);

    const campusColumns = useMemo<DataTableColumn<Campus>[]>(
        () => [
            { accessor: "campusName", title: "Campus" },
            {
                titleClassName: "text-center",
                accessor: "actions",
                title: "Acciones",
                render: (campus) => (
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
                <Button size="md"> <Group><>Crear Campus</> <IconShieldPlus /> </Group></Button>
            </Group>
            <DataTable columns={campusColumns} records={listCampus}></DataTable>
        </Flex>
    );
}
