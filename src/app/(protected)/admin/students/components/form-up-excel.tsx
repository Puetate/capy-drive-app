import { Student } from "@/app/models/student.model";
import { Alert, Button, Divider, Flex, Group, HoverCard, Select, Space, Table, Text } from "@mantine/core";
import { IconAlertCircle, IconFileTypeXls, IconInfoCircle } from "@tabler/icons-react";
import { IconUpload } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import readXlsxFile, { Row } from 'read-excel-file'
import { DataSelect } from "../../users/components/form-user";
import { getPeriodsByCareerService } from "../../periods/services/getPeriodsByCareer.service";
import { getCareersService } from "../../careers/services/getCareers.service";
import { Faculty } from "@/app/models/faculty.models";
import * as Yup from "yup";
import { ExcelStudents } from "@/app/models/excelStudents.model";
import { useForm, yupResolver } from "@mantine/form";
import { toast } from "sonner";
import saveStudentsService from "../services/saveStudents.service";

const elements = [
    { dni: "040XXXXXXX", nombres: "Alex", apellidos: "Tigselema", telefono: "0961XXXXXX", email: "xx@uta.edu.ec" },
    { dni: "041XXXXXXX", nombres: "Alex", apellidos: "Tigselema", telefono: "0961XXXXXX", email: "xx@uta.edu.ec" },
];

const initialValues: ExcelStudents = {
    academicPeriod: "",
    career: "",
    students: []
}

const validationSchema = Yup.object<ExcelStudents>().shape({
    academicPeriod: Yup.string().required("El periodo académico es obligatorio"),
    career: Yup.string().required("La carrera es obligatoria"),
});

export default function FormUpExcel({ onSubmitSuccess, onCancel, selectedStudent }:
    {
        onSubmitSuccess: () => void,
        onCancel: () => void,
        selectedStudent: Student | null
    }) {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [listAcademicPeriods, setListAcademicPeriods] = useState<DataSelect[]>([]);
    const [listCareers, setListCareers] = useState<DataSelect[]>([]);
    const [valueCareer, setValueCareer] = useState<string | null>('');
    const [validationError, setValidationError] = useState<string | null>(null);


    const row = elements.map((element) => (
        <Table.Tr key={element.dni}>
            <Table.Td>{element.dni}</Table.Td>
            <Table.Td>{element.nombres}</Table.Td>
            <Table.Td>{element.apellidos}</Table.Td>
            <Table.Td>{element.telefono}</Table.Td>
            <Table.Td>{element.email}</Table.Td>
        </Table.Tr>
    ));

    const onDrop = useCallback(async (acceptedFiles: any[]) => {
        const studentsExcel: Student[] = [];
        const content: Row[] = await readXlsxFile(acceptedFiles[0]);

        if (content.length === 0) {
            setValidationError("El archivo Excel está vacío");
            setStudents([]);
            return;
        }

        try {

            for (let index = 0; index < content.length; index++) {
                const element = content[index];
                const student: Student = {
                    id: 0,
                    dni: element[0].toString(),
                    names: element[1].toString(),
                    surnames: element[2].toString(),
                    phone: element[3].toString(),
                    email: element[4].toString(),
                    career: "",
                };
                studentsExcel.push(student);
            }
            setStudents(studentsExcel);
            console.log(studentsExcel);


            setValidationError(null);
        } catch (error) {
            console.log(error);

            console.log("Error al leer el excel");
        }
    }, [])

    const form = useForm({
        initialValues: initialValues,
        validate: yupResolver(validationSchema)
    });

    const getCareers = async () => {
        const res = await getCareersService();
        if (res.data === null) return;
        const careers: DataSelect[] = res.data.map((career) => ({ value: career.id.toString(), label: `${(career.faculty as Faculty).name} - ${career.name}` }))
        setListCareers(careers);

    };

    const getAcademicPeriods = async (careerID: string) => {
        const res = await getPeriodsByCareerService(careerID);
        if (res.data === null) return;
        const periods: DataSelect[] = res.data.academicPeriods.map((periods) => ({ value: periods.id.toString(), label: periods.name }))
        setListAcademicPeriods(periods);
    };



    const { getRootProps, getInputProps, isDragActive, acceptedFiles: file } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.ms-excel': ['.xls', '.xlsx'],
        },
        maxFiles: 2
    });

    const handleSubmit = async (formStudent: ExcelStudents) => {
        setLoading(true)
        if (students.length === 0) {
            setValidationError("El archivo Excel está vacío");
            return;
        };
        
        const res = await saveStudentsService({ ...formStudent, students })
        if (res.message === null) return setLoading(false)
        toast.success(res.message);
        setLoading(false)
        onSubmitSuccess()
        onCancel();
    }

    useEffect(() => {
        getCareers();
    }, []);

    useEffect(() => {
        if (valueCareer) {
            getAcademicPeriods(valueCareer);
        } else {
            setListAcademicPeriods([])
        }
    }, [valueCareer]);


    return (
        <div>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <div className="flex flex-col justify-center items-center">
                    <Text className="text-center text-lg font-bold text-blue-500">Cargar Estudiantes</Text>
                    <div className="w-full flex justify-start my-2">
                        <HoverCard width="auto" shadow="md">
                            <HoverCard.Target>
                                <Button color="orange"> <IconInfoCircle /> <Space w="md" /> Ver Indicaciones</Button>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Alert variant="light" color="yellow" title="Estructura Excel" icon={<IconInfoCircle />}>
                                    A continuación se muestra la estructura del excel de estudiantes para posteriormente hacer la carga masiva.
                                </Alert>
                                <Table className="w-full my-3" striped highlightOnHover withTableBorder withColumnBorders>
                                    <Table.Thead className="bg-primary-500 ">
                                        <Table.Tr>
                                            <Table.Th>DNI</Table.Th>
                                            <Table.Th>NOMBRES</Table.Th>
                                            <Table.Th>APELLIDOS</Table.Th>
                                            <Table.Th>TELÉFONO</Table.Th>
                                            <Table.Th>EMAIL</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>{row}</Table.Tbody>
                                </Table>

                            </HoverCard.Dropdown>
                        </HoverCard>
                    </div>

                    <div className={`h-32 w-full flex justify-center items-center border-2 border-dashed rounded-md`} {...getRootProps()}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                                <p className="mx-3" >Suelte el archivo aquí...</p> :
                                <div className="mx-3 text-center flex flex-col justify-center items-center" >
                                    <p>Arrastre y suelte el archivo de Excel aquí, o click para seleccionar</p>
                                    <p>Solo se aceptan archivos de tipo .xlsx</p>
                                    <IconUpload className="mt-2" />
                                </div>
                        }
                    </div>
                    {validationError && <p className="w-full py-2 uppercase font-semibold rounded-lg bg-red-400/20 text-red-600 flex justify-center items-center gap-3 mt-2"> <IconAlertCircle /> {validationError}</p>}
                </div>
                {(file[0] && students.length > 0) &&
                    <div >
                        <Divider my="md" />
                        <Text className="text-center">Archivo Seleccionado</Text>
                        <Group justify="space-between" className="rounded-md bg-slate-300 mt-3 p-2.5" >
                            <Group>
                                <IconFileTypeXls />
                                <Text>{file[0].name}</Text>
                            </Group>
                            <Text className="text-sm">Tamaño: {Math.ceil(file[0].size / 1024)} KB</Text>

                        </Group>

                        <Select
                            comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
                            className="text-black"
                            withAsterisk
                            label="Carrera"
                            placeholder="Seleccione"
                            data={listCareers}
                            {...form.getInputProps("career")}
                            onChange={(e) => {
                                setValueCareer(e)
                                if (form.getInputProps("career").onChange)
                                    form.getInputProps("career").onChange(e)
                            }
                            }
                        />

                        <Select
                            comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }}
                            withAsterisk
                            disabled={(listAcademicPeriods.length === 0) ? true : false}
                            label="Periodo Académico"
                            placeholder="Seleccione"
                            data={listAcademicPeriods}
                            {...form.getInputProps("academicPeriod")}
                        />
                    </div>
                }

                <Flex justify="space-between" mt="lg">
                    <Button variant="white" onClick={onCancel}>Cancelar</Button>
                    <Button loading={loading} type="submit">Aceptar</Button>
                </Flex>
            </form>
        </div>
    )
}