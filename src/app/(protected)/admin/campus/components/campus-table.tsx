"use client";
import { getCampusService } from "../services/getCampus.service";
import { useEffect, useMemo, useRef, useState } from "react";
import ConfirmDialog from "@/app/(protected)/components/ConfirmDialog";
import InputsFilters from "@/app/(protected)/components/InputsFilters";
import DataTable from "@/components/data-table";
import { ActionIcon, Button, Container, Flex, Group, Modal, TextInput, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconShieldPlus, IconTrash } from "@tabler/icons-react";
import { DataTableColumn } from "mantine-datatable";
import FormCampus from "./form-campus";
import { Campus } from "@/app/models/campus.model";
import { deleteCampusService } from "../../campus/services/deleteCampus.service";
import { toast } from "sonner";
import { IconBuildingBank } from "@tabler/icons-react";

const getConfirmMessage = (name: string): string => `¿Seguro que desea eliminar el Campus ${name}?`;

export default function TableCampus() {
    const [listCampus, setListCampus] = useState<Campus[]>([]);
    const [opened, { open, close }] = useDisclosure()
    const [openedDialog, { open: openDialog, close: closeDialog }] = useDisclosure();
    const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
    const listCampusRef = useRef<Campus[]>([]);

    const getCampus = async () => {
        const res = await getCampusService();

        if (res.data === null) return;
        const campus: Campus[] = res.data.map((campus) => ({
            ...campus
        }));
        setListCampus(campus);
        listCampusRef.current = campus;
    };



    const onClickEditButton = (campus: Campus) => {
        setSelectedCampus({ ...campus });
        open()
    }

    const onSubmitSuccess = async () => {
        close()
        await getCampus();
    };

    const onClickAddButton = () => {
        setSelectedCampus(null);
        open();
    };

    const onClickDeleteButton = async (campus: Campus) => {
        setSelectedCampus(campus)
        openDialog()
    }

    const handleDeleteCampus = async () => {
        const { id } = selectedCampus!;
        if (!id) return;
        const res = await deleteCampusService(id);
        if (res.message === null) { toast.error("No se pudo eliminar el Campus"); return };
        toast.success(res.message);
        await getCampus();
        closeDialog();
    }

    const generalFilter = (value: string) => {
        if (value == "") {
            return setListCampus(listCampusRef.current);
        }
        
        const filteredList = listCampusRef.current.filter(
            ({ name }: Campus) => {
                const filter = `${name}`;
                return filter.toLowerCase().includes(value.trim().toLowerCase());

            },
        );
        return setListCampus(filteredList);
    }

    useEffect(() => {
        getCampus();
    }, []);

    const CampusColumns = useMemo<DataTableColumn<Campus>[]>(
        () => [
            { accessor: "name", title: "Campus" },
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
                                onClick={() => onClickEditButton(campus)}
                            >
                                <IconEdit />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Editar">
                            <ActionIcon
                                color="red"
                                variant="light"
                                onClick={() => onClickDeleteButton(campus)}
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
                <InputsFilters onChangeFilters={generalFilter} />
                <Button size="sm" onClick={onClickAddButton} > <Group><>Crear Campus</> <IconBuildingBank /> </Group></Button>
            </Group>
            <DataTable columns={CampusColumns} records={listCampus}></DataTable>
            <Modal opened={opened} onClose={close} withCloseButton={false} >
                <FormCampus onCancel={close} onSubmitSuccess={onSubmitSuccess} selectedCampus={selectedCampus} />
            </Modal>
            <ConfirmDialog opened={openedDialog} onClose={closeDialog} message={(selectedCampus) ? getConfirmMessage(selectedCampus!.name!) : ""} onConfirm={handleDeleteCampus}  />
        </Flex>
    );
}
