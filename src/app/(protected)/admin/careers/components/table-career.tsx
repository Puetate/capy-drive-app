"use client";
import { ActionIcon, Badge, Button, Chip, Container, Flex, Group, Modal, TextInput, Tooltip } from "@mantine/core";
import { IconEdit, IconShieldPlus, IconTrash, IconUserPlus } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DataTableColumn } from "mantine-datatable";
import DataTable from "@/components/data-table";
import { useDisclosure } from "@mantine/hooks";
import FormCareer from "./form-career";
import Each from "@/lib/utils/each";
import { toast } from "sonner";
import ConfirmDialog from "@/app/(protected)/components/ConfirmDialog";
import InputsFilters from "@/app/(protected)/components/InputsFilters";

const getConfirmMessage = (name: string): string => (`¿Seguro que desea eliminar al usuario ${name}?`)


export default function TableCareer() {
    const [listCareers, setListCareers] = useState<Career[]>([]);
    const [opened, { open, close }] = useDisclosure();
    const [openedDialog, { open: openDialog, close: closeDialog }] = useDisclosure()
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)
    const listCareersRef = useRef<Career[]>([]);


    const getRolesNames = (userRolesArray: Role[]) => userRolesArray.map((role) => role.name);

    const getCareers = async () => {
        const res = await getCareersService();

        if (res.data === null) return
        const users: Career[] = res.data.map(user => ({
            ...user,
            role: getRolesNames(user.roles as Role[]).join(", "),
            fullName: `${user.names} ${user.surnames}`,
        }));
        setListCareers(users);
        listCareersRef.current = users;
    };

    const onClickEditButton = (user: Career) => {
        const rolesID: string[] = user.roles.map((rol) => (rol as Role).id.toString())
        setSelectedCareer({ ...user, roles: rolesID, password: "" });
        open()
    }

    const onSubmitSuccess = async () => {
        close()
        await getCareers()
    };

    const onClickAddButton = () => {
        encriptar();
        setSelectedCareer(null);
        open()
    }

    const onClickDeleteButton = async (user: Career) => {
        setSelectedCareer(user)
        openDialog()
    }

    const handleDeleteCareer = async () => {
        const { id } = selectedCareer!;
        if (!id) return;
        const res = await deleteCareerService(id);
        if (res.message === null) { toast.error("No se pudo eliminar al Usuario"); return };
        toast.success(res.message);
        await getCareers();
        closeDialog();
    }

    const generalFilter = (value: string) => {
        if (value == "") {
            return setListCareers(listCareersRef.current);
        }
        const filteredList = listCareersRef.current.filter(
            ({ dni, email, fullName, role }: Career) => {
                const filter = `${dni} ${email} ${fullName} ${role}`;
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
            { accessor: "fullName", title: "Nombre" },
            { accessor: "dni", title: "DNI" },
            { accessor: "email", title: "Email" },
            { accessor: "phone", title: "Teléfono" },
            // { accessor: "role", title: "Roles" },
            {
                accessor: "role",
                title: "Roles",
                render: (user) => (<Group className="">
                    <Each of={user.roles as Role[]} render={(item, index) =>
                        <Badge key={index} radius="md" size="lg" color="cyan" >{`${item.name}`} </Badge>
                    }></Each>
                </Group>)
            },
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
                <Button size="sm" onClick={onClickAddButton} > <Group><>Crear Usuario</> <IconCareerPlus /> </Group></Button>
            </Group>
            <DataTable columns={CareersColumns} records={listCareers}></DataTable>
            <Modal opened={opened} onClose={close} withCloseButton={false} >
                <FormCareer onCancel={close} onSubmitSuccess={onSubmitSuccess} selectedCareer={selectedCareer} />
            </Modal>
            <ConfirmDialog opened={openedDialog} onClose={closeDialog} message={(selectedCareer) ? getConfirmMessage(selectedCareer!.fullName!) : ""} onConfirm={handleDeleteCareer} />
        </Flex>
    );
}
