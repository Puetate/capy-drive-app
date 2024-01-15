"use client"
import { Button, Flex, Group, Modal, Select } from "@mantine/core";
import CardTemplate from "./card-template";
import InputsFilters from "@/app/(protected)/components/InputsFilters";
import { IconFolderPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { TemplateModel } from "@/app/models/templateModel.model";
import FormTemplate from "./form-template";
import { useEffect, useRef, useState } from "react";
import getTemplatesService from "../services/getTemplates.service";
import { AcademicPeriod } from "@/app/models/academicPeriod.model";
import { getCareersService } from "../../careers/services/getCareers.service";
import { DataSelect } from "../../users/components/form-user";
import { Faculty } from "@/app/models/faculty.models";


/* const templates: TemplateModel[] = [
    { id: 1, templateName: "template 302", period: { id: 1, name: 'Período 1', startDate: '2024-01-01', dateEnd: '2024-05-31' }, folders: ["folder 1", "folder 2"] },
    { id: 2, templateName: "template 303", period: { id: 2, name: 'Período 2', startDate: '2024-01-01', dateEnd: '2024-05-31' }, folders: ["folder 1", "folder 2"] },
    { id: 3, templateName: "template 304", period: { id: 3, name: 'Período 3', startDate: '2024-01-01', dateEnd: '2024-05-31' }, folders: ["folder 1", "folder 2", "folder 2"] },
    { id: 4, templateName: "template 304", period: { id: 4, name: 'Período 4', startDate: '2024-01-01', dateEnd: '2024-05-31' }, folders: ["folder 1", "folder 2", "folder 2"] },
    { id: 5, templateName: "template 304", period: { id: 5, name: 'Período 5', startDate: '2024-01-01', dateEnd: '2024-05-31' }, folders: ["folder 1", "folder 2", "folder 2"] },
] */
function getFormatDate(fechaCompleta: string): string {
    const fecha = new Date(fechaCompleta);
    
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    const fechaFormateada = `${año}-${mes}-${dia}`;

    return fechaFormateada;
}


export default function TemplatePage() {
    const [opened, { open, close }] = useDisclosure();
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateModel | null>(null)
    const [valueCareer, setValueCareer] = useState<string>('');
    const [labelCareer, setLabelCareer] = useState<string>('');
    const [listCareers, setListCareers] = useState<DataSelect[]>([]);
    const [listTemplates, setListTemplates] = useState<TemplateModel[]>([]);
    const listTemplatesRef = useRef<TemplateModel[]>([]);

    const getTemplates = async (id:string) => {
        const res = await getTemplatesService(id);
        if (res.data === null) return
        const templates: TemplateModel[] = res.data.map(template => ({
            ...template,
            createdAt: getFormatDate(template.createdAt!),
            folders: ["folder 1", "folder 2", "folder 2"],
            period: { name: "Ener 30 ", endDate: new Date(), startDate: new Date(), id: 1 }
        }));
        setListTemplates(templates);
        listTemplatesRef.current = templates;
    };

    const getCareers = async () => {
        const res = await getCareersService();
        if (res.data === null) return;
        const careers: DataSelect[] = res.data.map((career) => ({ value: career.id.toString(), label: `${(career.faculty as Faculty).name} - ${career.name}` }))
        setListCareers(careers);

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
        const { id: periodID } = template.period as AcademicPeriod;
        setSelectedTemplate({ ...template, period: periodID.toString() });
        console.log(selectedTemplate);
        open()
    }

    const onChangeSelect = (selectedOption: DataSelect) => {
        if (selectedOption === null) {
            setListTemplates([]);
            listTemplatesRef.current = [];
            return;
        }
        setValueCareer(selectedOption.value.toString());
        getTemplates(selectedOption.value);
    }

    const generalFilter = (value: string) => {
        if (value == "") {
            return setListTemplates(listTemplatesRef.current);
        }
         const filteredList = listTemplatesRef.current.filter(
            ({ name, period }: TemplateModel) => {
                const filter = `${name} ${period}`;
                return filter.toLowerCase().includes(value.trim().toLowerCase());
    
            },
        );
        return setListTemplates(filteredList);
    }

    useEffect(() => {
        getCareers();
    }, [valueCareer]);

    return (
        <Flex direction="column" h="100%" gap=".15rem">
            <Group align="end" className="mb-3" gap="lg">
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
                <Button size="sm" onClick={onClickAddButton} > <Group><>Crear Plantilla</> <IconFolderPlus /> </Group></Button>
            </Group>
            <CardTemplate onEditTemplate={onClickEditButton} templates={listTemplates} />
            <Modal opened={opened} onClose={close} withCloseButton={false} >
                <FormTemplate onCancel={close} onSubmitSuccess={onSubmitSuccess} selectedTemplate={selectedTemplate} />
            </Modal>
        </Flex>
    );
};
