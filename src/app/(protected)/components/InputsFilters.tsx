import { Flex, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconCalendar, IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";

function InputsFilters({ onChangeFilters, datePickerPlaceHolder = "Mostrar por Fechas" }: { onChangeFilters: (value: string, starDate: Date | null, endDate: Date | null) => void, datePickerPlaceHolder?: string }) {
    const [dates, setValue] = useState<[Date | null, Date | null]>([null, null]);
    const [searchValue, setSearchValue] = useState("");
    const [val] = useDebouncedValue(searchValue, 300);

    useEffect(() => {
        onChangeFilters(val, dates[0], dates[1])
    }, [val])


    return (
        <Flex
            gap="md"
            justify="flex-start"
            align="flex-start"
            wrap="wrap"
        >
            <TextInput placeholder="Buscar" rightSection={<IconSearch />} onChange={(e) => { setSearchValue(e.currentTarget.value) }} />
        </Flex>


    )
}

export default InputsFilters