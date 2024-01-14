"use client"
import { Button, Flex, Group, Modal } from "@mantine/core";
import CardTemplate from "./card-template";
import InputsFilters from "@/app/(protected)/components/InputsFilters";
import { IconFolderPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { TemplateModel } from "@/app/models/templateModel.model";
import FormTemplate from "./form-template";
import { useState } from "react";
import getTemplatesService from "../services/getTemplates.service";
import { AcademicPeriod } from "@/app/models/academicPeriod.model";


const templates: TemplateModel[] = [
    { id: 1, templateName: "template 302", period: { id: 1, name: 'Período 1', dateStart: '2024-01-01', dateEnd: '2024-05-31' }, folders: ["folder 1", "folder 2"] },
    { id: 2, templateName: "template 303", period: { id: 2, name: 'Período 2', dateStart: '2024-01-01', dateEnd: '2024-05-31' }, folders: ["folder 1", "folder 2"] },
    { id: 3, templateName: "template 304", period: { id: 3, name: 'Período 3', dateStart: '2024-01-01', dateEnd: '2024-05-31' }, folders: ["folder 1", "folder 2", "folder 2"] },
    { id: 4, templateName: "template 304", period: { id: 4, name: 'Período 4', dateStart: '2024-01-01', dateEnd: '2024-05-31' }, folders: ["folder 1", "folder 2", "folder 2"] },
    { id: 5, templateName: "template 304", period: { id: 5, name: 'Período 5', dateStart: '2024-01-01', dateEnd: '2024-05-31' }, folders: ["folder 1", "folder 2", "folder 2"] },
]



export default function TemplatePage() {
    const [opened, { open, close }] = useDisclosure();
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateModel | null>(null)

    const getUsers = async () => {
        const res = await getTemplatesService();
        if (res.data === null) return
        /*  const users: User[] = res.data.map(user => ({
             ...user,
             role: getRolesNames(user.roles as Role[]).join(", "),
             fullName: `${user.names} ${user.surnames}`,
         }));
         setListUsers(users);
         listUsersRef.current = users; */
    };

    const onClickAddButton = () => {
        setSelectedTemplate(null);
        open();
    }

    const onSubmitSuccess = async () => {
        close()
        // await getUsers()
    };

    const onClickEditButton = (template: TemplateModel) => {
        const {id: periodID} = template.period as AcademicPeriod;
        setSelectedTemplate({...template, period: periodID.toString()});
        console.log(selectedTemplate);
        open()
    }

    const generalFilter = (value: string) => {
        /*if (value == "") {
            return setListUsers(listUsersRef.current);
        }
         const filteredList = listUsersRef.current.filter(
            ({ dni, email, fullName, phone, role }: User) => {
                const filter = `${dni} ${email} ${fullName} ${role}`;
                return filter.toLowerCase().includes(value.trim().toLowerCase());
    
            },
        );
        return setListUsers(filteredList); */
    }

    return (
        <Flex direction="column" h="100%" gap=".15rem">
            <Group className="mb-3" gap="xl">
                <InputsFilters onChangeFilters={generalFilter} />
                <Button size="sm" onClick={onClickAddButton} > <Group><>Crear Plantilla</> <IconFolderPlus /> </Group></Button>
            </Group>
            <CardTemplate onEditTemplate={onClickEditButton} templates={templates} />);
            <Modal opened={opened} onClose={close} withCloseButton={false} >
                <FormTemplate onCancel={close} onSubmitSuccess={onSubmitSuccess} selectedTemplate={selectedTemplate} />
            </Modal>
        </Flex>
    );
};
