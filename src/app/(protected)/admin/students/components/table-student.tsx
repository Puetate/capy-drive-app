"use client";
import { ActionIcon, Badge, Button, Chip, Container, Flex, Group, Modal, Select, TextInput, Tooltip } from "@mantine/core";
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
import { getCareersService } from "../../careers/services/getCareers.service";
import { DataSelect } from "../../users/components/form-user";
import { Faculty } from "@/app/models/faculty.models";

const getConfirmMessage = (name: string): string => (`¿Seguro que desea eliminar al usuario ${name}?`)

export default function TableStudent() {
    const [listStudents, setListStudents] = useState<Student[]>([]);
    const [opened, { open, close }] = useDisclosure();
    const [openedUpExcel, { open: openExcel, close: closeExcel }] = useDisclosure();
    const [openedDialog, { open: openDialog, close: closeDialog }] = useDisclosure()
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const listStudentsRef = useRef<Student[]>([]);
    const [valueCareer, setValueCareer] = useState<string>('');
    const [labelCareer, setLabelCareer] = useState<string>('');
    const [listCareers, setListCareers] = useState<DataSelect[]>([]);

    const getStudents = async (careerID: string, career:string) => {
        const res = await getStudentsService(careerID!);
        if (res.data === null) return
        const users: Student[] = res.data.map(user => ({
            ...user,
            fullName: `${user.names} ${user.surnames}`,
            career: career
        }));
        setListStudents(users);
        listStudentsRef.current = users;
    };

    const getCareers = async () => {
        const res = await getCareersService();
        if (res.data === null) return;
        const careers: DataSelect[] = res.data.map((career) => ({ value: career.id.toString(), label: `${(career.faculty as Faculty).name} - ${career.name}` }))
        setListCareers(careers);

    };

    const onClickEditButton = (student: Student) => {
        setSelectedStudent(student);
        open()
    } 

    const onSubmitSuccess = async () => {
        close()
        if (valueCareer) {
            await getStudents(valueCareer, labelCareer);
        }
    };

    const onClickAddButton = () => {
        setSelectedStudent(null);
        openExcel()
    }

    const onClickDeleteButton = async (student: Student) => {
        setSelectedStudent(student)
        openDialog()
    }

    const handleDeleteStudent = async () => {
        /* const { id } = selectedStudent!;
        if (!id) return;
        const res = await deleteStudentService(id);
        if (res.message === null) { toast.error("No se pudo eliminar al Usuario"); return };
         toast.success(res.message);*/
        await getStudents(valueCareer, labelCareer); 
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

    const onChangeSelect = (selectedOption: DataSelect) => {
        console.log(selectedOption);

        if (selectedOption === null) {
            setListStudents([]);
            listStudentsRef.current = [];
            return;
        }
        console.log(selectedOption);

        setValueCareer(selectedOption.value.toString());
        setLabelCareer(selectedOption.label);
        const {label, value} = selectedOption;
        getStudents(value, label);
    }
    
    useEffect(() => {
        getCareers();
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
            <Group align="end" className="mb-3" gap="xl">
                <Select
                    comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
                    className="text-black"
                    withAsterisk
                    label="Carrera"
                    placeholder="Seleccione"
                    data={listCareers}
                    onChange={(value: string | null, option: DataSelect) => onChangeSelect(option)}
                />
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
