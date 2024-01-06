"use client";
import { DataTableColumn, DataTableProps, DataTable as MantineDataTable } from "mantine-datatable";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 15;
const LONG_TEXT_ACCESSOR: Record<string, string> = {
  message: "40%"
};

export default function DataTable<T>(props: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const recordsRef = useRef<Array<T>>([]);
  const [tableRecords, setTableRecords] = useState<Array<T>>([]);
  const [tableColumns, setTableColumns] = useState<DataTableColumn<T>[]>([]);

  const onPageChanged = useCallback(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setTableRecords(recordsRef.current?.slice(from, to));
  }, [page]);

  useEffect(() => {
    if (!props.columns) return;
    setTableColumns(
      props.columns.map((column) => ({
        ...column,
        width: LONG_TEXT_ACCESSOR[column.accessor as string]
      }))
    );
  }, [props.columns]);

  useEffect(() => {
    if (props.records?.length === 0) {
      setTableRecords([]);
    } else if (props.records?.length && props.records?.length <= PAGE_SIZE) {
      recordsRef.current = props.records ?? [];
      setPage(1);
      onPageChanged();
    } else {
      recordsRef.current = props.records ?? [];
      onPageChanged();
    }
  }, [props.records, onPageChanged]);

  return (
    <MantineDataTable
      records={tableRecords}
      columns={tableColumns}
      totalRecords={recordsRef.current?.length ?? 0}
      recordsPerPage={PAGE_SIZE}
      className="h-full w-full"
      withTableBorder
      page={page}
      borderRadius="md"
      onPageChange={(p) => setPage(p)}
      fetching={props.fetching}
      borderColor="bg-primary-800"
      classNames={{
        pagination: "bg-secondary-800 text-white",
        footer: "text-white",
        header: "bg-primary-800 text-white"
      }}
      noRecordsText="No hay datos disponibles"
      idAccessor="user.userId"
    />
  );
}
