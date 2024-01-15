"use client";
import { ActionIcon, Button, Chip, Container, Flex, Group, Modal, TextInput, Tooltip } from "@mantine/core";
import { IconEdit, IconShieldPlus, IconTrash } from "@tabler/icons-react";
import { getFacultyService } from "../services/getFaculties.service";
import { useEffect, useMemo, useRef, useState } from "react";
import { DataTableColumn } from "mantine-datatable";
import DataTable from "@/components/data-table";
import { useDisclosure } from "@mantine/hooks";
import FormFaculty from "./form-faculty";
import { Campus } from "@/app/models/campus.model";
import { Faculty } from "@/app/models/faculty.models";
import { deleteFacultyService } from "../services/deleteFaculties.service";
import { toast } from "sonner";
import ConfirmDialog from "@/app/(protected)/components/ConfirmDialog";
import InputsFilters from "@/app/(protected)/components/InputsFilters";

const getConfirmMessage = (name: string): string => (`¿Seguro que desea eliminar la Facultad ${name}?`)


export default function TableFaculty() {
    const [listFaculty, setListFaculty] = useState<Faculty[]>([]);
    const [opened, { open, close }] = useDisclosure();
    const [openedDialog, { open: openDialog, close: closeDialog }] = useDisclosure()
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)
    const listFacultyRef = useRef<Faculty[]>([]);


    const getCampusNames = (facultyCampusArray: Campus[] | Campus | string): string => {
        if (Array.isArray(facultyCampusArray)) {
            // facultyCampusArray es un array
            return facultyCampusArray.map((campus) => campus.name).join(", ");
        } else if (typeof facultyCampusArray === "object" && facultyCampusArray !== null) {
            // facultyCampusArray es un objeto único
            return (facultyCampusArray as Campus).name;
        } else {
            return "";
        }
        };


    const getFaculty = async () => {
        const res = await getFacultyService();
        if (res.data === null) return
        const faculties: Faculty[] = res.data.map((faculty) => ({
            ...faculty,
        }));

        setListFaculty(faculties);
        listFacultyRef.current = faculties;
    };

    const onClickEditButton = (faculty: Faculty) => {
    let campusID: string;

    if (faculty.campus) {
        if (Array.isArray(faculty.campus)) {
            campusID = faculty.campus.map((campus) => (campus as Campus).id.toString()).join(", ");
        } else if (typeof faculty.campus === "object" && "id" in faculty.campus) {
            campusID = (faculty.campus as Campus).id.toString();
        }
    }
    setSelectedFaculty({ ...faculty, campus: campusID });
    open();
};


    const onSubmitSuccess = async () => {
        close()
        await getFaculty()
    };

    const onClickAddButton = () => {
        setSelectedFaculty(null);
        open()
    }

    const onClickDeleteButton = async (faculty: Faculty) => {
        setSelectedFaculty(faculty)
        openDialog()
    }

    const handleDeleteFaculty = async () => {
        const { id } = selectedFaculty!;
        if (!id) return;
        const res = await deleteFacultyService(id);
        if (res.message === null) { toast.error("No se pudo eliminar la Facultad"); return };
        toast.success(res.message);
        await getFaculty();
        closeDialog();
    }

    const generalFilter = (value: string) => {
        if (value == "") {
            return setListFaculty(listFacultyRef.current);
        }
        const filteredList = listFacultyRef.current.filter(
            ({ name, campus }: Faculty) => {
                const filter = `${name} ${campus}`;
                return filter.toLowerCase().includes(value.trim().toLowerCase());

            },
        );
        return setListFaculty(filteredList);

    }

    useEffect(() => {
        getFaculty();
    }, []);

    const FacultyColumns = useMemo<DataTableColumn<Faculty>[]>(
        () => [
            { accessor: "name", title: "Nombre" },
            {
                accessor: "campus.name", title: "Campus" },
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
                        <Tooltip label="Eliminar">
                            <ActionIcon
                                color="red"
                                variant="light"
                                onClick={() => onClickDeleteButton(user)}
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
                <Button size="sm" onClick={onClickAddButton} > <Group><>Crear Facultad</> <IconShieldPlus /> </Group></Button>
            </Group>
            <DataTable columns={FacultyColumns} records={listFaculty}></DataTable>
            <Modal opened={opened} onClose={close} withCloseButton={false} >
                <FormFaculty onCancel={close} onSubmitSuccess={onSubmitSuccess} selectedFaculty={selectedFaculty} />
            </Modal>
            <ConfirmDialog opened={openedDialog} onClose={closeDialog} message={(selectedFaculty) ? getConfirmMessage(selectedFaculty!.name!) : ""} onConfirm={handleDeleteFaculty} />
        </Flex>
    );
}
