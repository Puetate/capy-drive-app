"use client";
import DataTable from "@/components/data-table";
import { ActionIcon, Button, Container, Flex, Group, TextInput, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconShieldPlus, IconTrash } from "@tabler/icons-react";
import { DataTableColumn } from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";

export interface Faculties {
    campusId: number;
    facultiesName: string;
}
export default function FacultiesTable() {
    const [listFaculties, setListFaculties] = useState<Faculties[]>([]);
    const [opened, { open, close }] = useDisclosure()


    const getFaculties = async () => {
        /* const res = await getRolesService();
            if (res.error || res.data === null) return
            const rolesData = res.data;
             */
        const facultiesData: Faculties[] = [{ campusId: 1 ,facultiesName: "FISEI" }, { campusId: 2 ,facultiesName: "Ciencias Aplicadas" }];
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        setListFaculties(facultiesData);
    };

    useEffect(() => {
        getFaculties();
    }, []);

    const facultiesColumns = useMemo<DataTableColumn<Faculties>[]>(
        () => [
            { accessor: "campusId", title: "Campus" },
            { accessor: "facultiesName", title: "Faculties" },
            {
                titleClassName: "text-center",
                accessor: "actions",
                title: "Acciones",
                render: (faculties) => (
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
                <Button size="md"> <Group><>Crear Facultades</> <IconShieldPlus /> </Group></Button>
            </Group>
            <DataTable columns={facultiesColumns} records={listFaculties}></DataTable>
        </Flex>
    );
}
