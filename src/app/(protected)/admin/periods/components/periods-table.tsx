"use client";
import { getPeriodsService } from "../services/getPeriods.service";
import { useEffect, useMemo, useRef, useState } from "react";
import ConfirmDialog from "@/app/(protected)/components/ConfirmDialog";
import InputsFilters from "@/app/(protected)/components/InputsFilters";
import DataTable from "@/components/data-table";
import { ActionIcon, Button, Container, Flex, Group, Modal, TextInput, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconShieldPlus, IconTrash } from "@tabler/icons-react";
import { DataTableColumn } from "mantine-datatable";
import { toast } from "sonner";
import { AcademicPeriod } from "@/app/models/academicPeriod.model";
import { deletePeriodsService } from "../services/deletePeriods.service";
import FormAcademicPeriod from "./form-periods";
const getConfirmMessage = (name: string): string => `¿Seguro que desea eliminar el Período Académico ${name}?`;

export default function TableCampus() {
    const [listAcademicPeriod, setListAcademicPeriod] = useState<AcademicPeriod[]>([]);
    const [opened, { open, close }] = useDisclosure()
    const [openedDialog, { open: openDialog, close: closeDialog }] = useDisclosure();
    const [selectedAcademicPeriod, setSelectedAcademicPeriod] = useState<AcademicPeriod | null>(null);
    const listAcademicPeriodRef = useRef<AcademicPeriod[]>([]);

    const getAcademicPeriod = async () => {
        const res = await getPeriodsService();

        if (res.data === null) return;
        const academicPeriod: AcademicPeriod[] = res.data.map((academicPeriod) => ({
            ...academicPeriod
        }));
        setListAcademicPeriod(academicPeriod);
        listAcademicPeriodRef.current = academicPeriod;
    };



    const onClickEditButton = (academicPeriod: AcademicPeriod) => {
        setSelectedAcademicPeriod({ ...academicPeriod });
        open()
    }

    const onSubmitSuccess = async () => {
        close()
        await getAcademicPeriod();
    };

    const onClickAddButton = () => {
        setSelectedAcademicPeriod(null);
        open();
    };

    const onClickDeleteButton = async (academicPeriod: AcademicPeriod) => {
        setSelectedAcademicPeriod(academicPeriod)
        openDialog()
    }

    const handleDeleteCampus = async () => {
        const { id } = selectedAcademicPeriod!;
        if (!id) return;
        const res = await deletePeriodsService(id);
        if (res.message === null) { toast.error("No se pudo eliminar el AcademicPeriod"); return };
        toast.success(res.message);
        await getAcademicPeriod();
        closeDialog();
    }

    const generalFilter = (value: string) => {
        if (value == "") {
            return setListAcademicPeriod(listAcademicPeriodRef.current);
        }
        
        const filteredList = listAcademicPeriodRef.current.filter(
            ({ name }: AcademicPeriod) => {
                const filter = `${name}`;
                return filter.toLowerCase().includes(value.trim().toLowerCase());

            },
        );
        return setListAcademicPeriod(filteredList);
    }

    useEffect(() => {
        getAcademicPeriod();
    }, []);

    const CampusColumns = useMemo<DataTableColumn<AcademicPeriod>[]>(
        () => [
            { accessor: "name", title: "AcademicPeriod" },
            { accessor: "startDate", title: "Fecha Inicio" },
            { accessor: "endDate", title: "Fecha Fin" },
            {
            titleClassName: "text-center",
            accessor: "actions",
            title: "Acciones",
            render: (academicPeriod) => (
                <Group className="flex flex-row items-center justify-center">
                <Tooltip label="Editar">
                    <ActionIcon color="violet" variant="light" onClick={() => onClickEditButton(academicPeriod)}>
                    <IconEdit />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Editar">
                    <ActionIcon color="red" variant="light" onClick={() => onClickDeleteButton(academicPeriod)}>
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
                <Button size="sm" onClick={onClickAddButton} > <Group><>Crear Período Académico</> <IconShieldPlus /> </Group></Button>
            </Group>
            <DataTable columns={CampusColumns} records={listAcademicPeriod}></DataTable>
            <Modal opened={opened} onClose={close} withCloseButton={false} >
                <FormAcademicPeriod onCancel={close} onSubmitSuccess={onSubmitSuccess} selectedAcademicPeriod={selectedAcademicPeriod} />
            </Modal>
            <ConfirmDialog opened={openedDialog} onClose={closeDialog} message={(selectedAcademicPeriod) ? getConfirmMessage(selectedAcademicPeriod!.name!) : ""} onConfirm={handleDeleteCampus}  />
        </Flex>
    );
}
