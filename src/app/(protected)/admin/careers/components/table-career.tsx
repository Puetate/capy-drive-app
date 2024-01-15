"use client";
import { ActionIcon, Badge, Button, Chip, Container, Flex, Group, Modal, TextInput, Tooltip } from "@mantine/core";
import { IconCardsFilled, IconEdit, IconSchool, IconShieldPlus, IconTrash, IconUserPlus } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DataTableColumn } from "mantine-datatable";
import DataTable from "@/components/data-table";
import { useDisclosure } from "@mantine/hooks";
import FormCareer from "./form-career";
import Each from "@/lib/utils/each";
import { toast } from "sonner";
import ConfirmDialog from "@/app/(protected)/components/ConfirmDialog";
import InputsFilters from "@/app/(protected)/components/InputsFilters";
import { Career } from "@/app/models/career.model";
import { getCareersService } from "../services/getCareers.service";
import { deleteCareerService } from "../services/deleteCareer.service";
import { Faculty } from "@/app/models/faculty.models";
import FormCareerAcadPeriod from "./form-career-acad-period";

const getConfirmMessage = (name: string): string => (`¿Seguro que desea eliminar la carrera ${name}?`)


export default function TableCareer() {
    const [listCareers, setListCareers] = useState<Career[]>([]);
    const [opened, { open, close }] = useDisclosure();
    const [openedDialog, { open: openDialog, close: closeDialog }] = useDisclosure()
    const [openedModalPeriod, { open: openModalPeriod, close: closeModalPeriod }] = useDisclosure()
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)
    const listCareersRef = useRef<Career[]>([]);

    const getCareers = async () => {
        const res = await getCareersService();

        if (res.data === null) return
        const careers: Career[] = res.data.map(career => ({
            ...career,
        }));
        setListCareers(careers);
        listCareersRef.current = careers;
    };

    const onClickEditButton = (career: Career) => {
        const { faculty } = career;
        const facultyID = (faculty as Faculty).id.toString();
        setSelectedCareer({ ...career, faculty: facultyID });
        open()
    }

    const onSubmitSuccess = async () => {
        close()
        await getCareers()
    };

    const onClickEditAcademicPeriodsButton = async (career: Career) => {
        const nameFaculty = (career.faculty as Faculty).name;
        setSelectedCareer({ ...career, faculty: nameFaculty })
        openModalPeriod()
    }

    const onClickAddButton = () => {
        setSelectedCareer(null);
        open()
    }

    const onClickDeleteButton = async (career: Career) => {
        setSelectedCareer(career)
        openDialog()
    }

    const handleDeleteCareer = async () => {
        const { id } = selectedCareer!;
        if (!id) return;
        const res = await deleteCareerService(id);
        if (res.message === null) { toast.error("No se pudo eliminar a la carrera"); return };
        toast.success(res.message);
        await getCareers();
        closeDialog();
    }

    const generalFilter = (value: string) => {
        if (value == "") {
            return setListCareers(listCareersRef.current);
        }
        const filteredList = listCareersRef.current.filter(
            ({ faculty, name }: Career) => {
                const filter = `${(faculty as Faculty).name} ${name}`;
                return filter.toLowerCase().includes(value.trim().toLowerCase());

            },
        );
        return setListCareers(filteredList);
    }

    useEffect(() => {
        getCareers();
    }, []);

    const CareersColumns = useMemo<DataTableColumn<Career>[]>(
        () => [
            { accessor: "name", title: "Carrera" },
            { accessor: "faculty.name", title: "Facultad" },
            { accessor: "faculty.name", title: "Periodos Académicos" },
            {
                titleClassName: "text-center",
                accessor: "actions",
                title: "Acciones",
                render: (career) => (
                    <Group className="flex flex-row items-center justify-center">
                        <Tooltip label="Asignar Periodos Académicos">
                            <ActionIcon
                                color="green"
                                variant="light"
                                onClick={() => onClickEditAcademicPeriodsButton(career)}
                            >
                                <IconSchool />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Editar">
                            <ActionIcon
                                color="violet"
                                variant="light"
                                onClick={() => onClickEditButton(career)}
                            >
                                <IconEdit />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Eliminar">
                            <ActionIcon
                                color="red"
                                variant="light"
                                onClick={() => onClickDeleteButton(career)}
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
                <Button size="sm" onClick={onClickAddButton} > <Group><>Crear Carrera</> <IconCardsFilled /> </Group></Button>
            </Group>
            <DataTable columns={CareersColumns} records={listCareers}></DataTable>
            <Modal opened={opened} onClose={close} withCloseButton={false} >
                <FormCareer onCancel={close} onSubmitSuccess={onSubmitSuccess} selectedCareer={selectedCareer} />
            </Modal>
            <Modal opened={openedModalPeriod} onClose={closeModalPeriod} withCloseButton={false} >
                <FormCareerAcadPeriod onCancel={close} onSubmitSuccess={onSubmitSuccess} selectedCareer={selectedCareer} />
            </Modal>
            <ConfirmDialog opened={openedDialog} onClose={closeDialog} message={(selectedCareer) ? getConfirmMessage(selectedCareer.name) : ""} onConfirm={handleDeleteCareer} />
        </Flex>
    );
}
