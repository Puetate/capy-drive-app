"use client";
import { ActionIcon, Badge, Button, Chip, Container, Flex, Group, Modal, TextInput, Tooltip } from "@mantine/core";
import { IconEdit, IconFileTypeXls, IconShieldPlus, IconTrash, IconUserPlus, IconUsersPlus } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DataTableColumn } from "mantine-datatable";
import DataTable from "@/components/data-table";
import { useDisclosure } from "@mantine/hooks";
import Each from "@/lib/utils/each";
import { toast } from "sonner";
import ConfirmDialog from "@/app/(protected)/components/ConfirmDialog";
import InputsFilters from "@/app/(protected)/components/InputsFilters";
import { Student } from "@/app/models/student.model";
import FormStudent from "./form-student";
import FormUpExcel from "./form-up-excel";
import getStudentsService from "../services/getStudents.service";

const getConfirmMessage = (name: string): string => (`¿Seguro que desea eliminar al usuario ${name}?`)

export default function TableStudent() {
    const [listStudents, setListStudents] = useState<Student[]>([]);
    const [opened, { open, close }] = useDisclosure();
    const [openedUpExcel, { open: openExcel, close: closeExcel }] = useDisclosure();
    const [openedDialog, { open: openDialog, close: closeDialog }] = useDisclosure()
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const listStudentsRef = useRef<Student[]>([]);


    const getStudents = async () => {
        const res = await getStudentsService();

        if (res.data === null) return
        const users: Student[] = res.data.map(user => ({
            ...user,
            fullName: `${user.names} ${user.surnames}`,
            career: "Software"
        }));
        setListStudents(users);
        listStudentsRef.current = users;
    };

    const onClickEditButton = (user: Student) => {
        open()
    }

    const onSubmitSuccess = async () => {
        close()
        await getStudents()
    };

    const onClickAddButton = () => {
        setSelectedStudent(null);
        openExcel()
    }

    const onClickDeleteButton = async (user: Student) => {
        setSelectedStudent(user)
        openDialog()
    }

    const handleDeleteStudent = async () => {
        /* const { id } = selectedStudent!;
        if (!id) return;
        const res = await deleteStudentService(id);
        if (res.message === null) { toast.error("No se pudo eliminar al Usuario"); return };
         toast.success(res.message);*/
        await getStudents();
    }

    const generalFilter = (value: string) => {
        if (value == "") {
            return setListStudents(listStudentsRef.current);
        }
        const filteredList = listStudentsRef.current.filter(
            ({ dni, email, fullName }: Student) => {
                const filter = `${dni} ${email} ${fullName}`;
                return filter.toLowerCase().includes(value.trim().toLowerCase());

            },
        );
        return setListStudents(filteredList);
    }

    useEffect(() => {
        getStudents();
    }, []);

    const StudentsColumns = useMemo<DataTableColumn<Student>[]>(
        () => [
            { accessor: "fullName", title: "Nombre" },
            { accessor: "dni", title: "DNI" },
            { accessor: "email", title: "Email" },
            { accessor: "phone", title: "Teléfono" },
            { accessor: "career", title: "Carrera" },
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
                <Button size="sm" onClick={onClickAddButton} > <Group><>Cargar Excel</> <IconFileTypeXls /> </Group></Button>
            </Group>
            <DataTable columns={StudentsColumns} records={listStudents}></DataTable>
            <Modal opened={opened} onClose={close} withCloseButton={false} >
                <FormStudent onCancel={close} onSubmitSuccess={onSubmitSuccess} selectedStudent={selectedStudent} />
            </Modal>
            <Modal size="lg" opened={openedUpExcel} onClose={closeExcel} withCloseButton={false} >
                <FormUpExcel onCancel={closeExcel} onSubmitSuccess={onSubmitSuccess} selectedStudent={selectedStudent} />
            </Modal>
            <ConfirmDialog opened={openedDialog} onClose={closeDialog} message={(selectedStudent) ? getConfirmMessage(selectedStudent!.fullName!) : ""} onConfirm={handleDeleteStudent} />
        </Flex>
    );
}
