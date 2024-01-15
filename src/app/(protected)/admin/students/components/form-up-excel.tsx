import { Student } from "@/app/models/student.model";
import { Alert, Button, Divider, Flex, Group, HoverCard, Space, Table, Text } from "@mantine/core";
import { IconFileTypeXls, IconInfoCircle } from "@tabler/icons-react";
import { IconUpload } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import readXlsxFile, { Row } from 'read-excel-file'

const elements = [
    { dni: "040XXXXXXX", nombres: "Alex", apellidos: "Tigselema", telefono: "0961XXXXXX", email: "xx@uta.edu.ec" },
    { dni: "040XXXXXXX", nombres: "Alex", apellidos: "Tigselema", telefono: "0961XXXXXX", email: "xx@uta.edu.ec" },
];

export default function FormUpExcel({ onSubmitSuccess, onCancel, selectedStudent }:
    {
        onSubmitSuccess: () => void,
        onCancel: () => void,
        selectedStudent: Student | null
    }) {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);

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
    }, [])

    const { getRootProps, getInputProps, isDragActive, acceptedFiles: file } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.ms-excel': ['.xls', '.xlsx'],
            // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheetl': ['.xlsx']
        },
        maxFiles: 2
    })

    return (
        <div>
            <div className="flex flex-col justify-center items-center">
                <Text className="text-center font-medium text-lg">Cargar Estudiantes</Text>
                <div className="w-full flex justify-start my-2">
                    <HoverCard width="auto" shadow="md">
                        <HoverCard.Target>
                            <Button color="red"> <IconInfoCircle /> <Space w="md" /> Ver Indicaciones</Button>
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
                                        <Table.Th>TELEFONO</Table.Th>
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
            </div>
            {file[0] &&
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
                </div>
            }
            <Flex justify="space-between" mt="lg">
                <Button variant="white" onClick={onCancel}>Cancelar</Button>
                <Button loading={loading} type="submit">Aceptar</Button>
            </Flex>
        </div>
    )
}