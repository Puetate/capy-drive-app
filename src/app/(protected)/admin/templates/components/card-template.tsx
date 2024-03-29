// Folder.js
"use client"
import { AcademicPeriod } from '@/app/models/academicPeriod.model';
import { Folders, TemplateModel } from '@/app/models/templateModel.model';
import Each from '@/lib/utils/each';
import { ActionIcon, Badge, Card, Center, Group, Text } from '@mantine/core';
import { IconFolder, IconFolders, IconPencil } from '@tabler/icons-react';
import React from 'react';
const icon = <IconFolder className='mr-2' />


export default function CardTemplate({ templates, onEditTemplate }: { templates: TemplateModel[], onEditTemplate: (value: TemplateModel) => void }) {

    return (
        <div className='flex flex-wrap gap-4'>
            <Each<TemplateModel> of={templates} render={(item, index) =>
                <Card key={index} className='bg-white rounded-md w-96' variant="contained">
                    <Card.Section withBorder key={index}>
                        <Group className='flex flex-row justify-between ml-3 mt-3'>
                            <Group>
                                <IconFolders />
                                <Text fw={500}>{item.name}</Text>
                            </Group>
                            {/* <ActionIcon className='mr-3' variant="transparent" aria-label="Settings" onClick={() => onEditTemplate(item)}>
                                <IconPencil color='black' stroke={1.5} />
                            </ActionIcon> */}
                        </Group>
                        <Text className='ml-3 mb-3 text-sm'>Periodo: 
                            <Each of={(item.academicPeriods!)} render={(item, indexPeriod) => <span className='font-light'>{`${item.name}`}</span>
                            }>
                            </Each>
                        </Text>
                    </Card.Section>

                    <div className='flex flex-col justify-between h-full'>
                        <Group className='mt-4'>
                            {item.folders.length === 0
                                ?
                                <Center>No hay carpetas asignadas</Center>
                                :
                                <Each of={(item.folders as Folders[])} render={(item, indexFolder) =>
                                    <Badge key={indexFolder} className='py-3 w-40 h-9' leftSection={icon} variant="default" color="blue" size="lg" radius="sm">{item.name}</Badge>
                                }>
                                </Each>
                            }
                        </Group>
                        <Text className='ml-3 mt-1 text-xs text-gray-500 text-right'>Creado: <span>{item.createdAt!}</span></Text>
                    </div>
                </Card>
            } ></Each>
        </div>
    );
}
