import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button"
import { Input } from "@/components/ui/input"
import React from "react"

interface DataTableProps<TData> {
  columns: any
  data: TData[]
  showVolunteersCount?: boolean
  isLoading?: boolean
  reloadData?: () => void,
}

export function DataTable<TData>({
  columns,
  data,
  showVolunteersCount,
  isLoading,
  reloadData,
}: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const processedColumns = columns(reloadData)
  const table = useReactTable({
    data,
    columns: processedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  return (
    <div className="rounded-md border">
      <div className="flex justify-between px-5">
        {showVolunteersCount && (<div className="flex items-center py-4">
          <span className="text-md font-semibold text-zinc-500">Total No of Volunteers: {data.length}</span>
        </div>)}
        {
          showVolunteersCount && (<div className="flex items-center py-4 justify-end mr-2">
            <Input
              placeholder="Filter emails..."
              value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("email")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>)}
      </div>
      <Table>
        {/* Table header */}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        {/* Table body */}
        <TableBody>
            {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <span>Loading...</span>
              </TableCell>
            </TableRow>
            ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
              </TableRow>
            ))
            ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
              </TableCell>
            </TableRow>
            )}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export type Survey = {
  id: number
  state_id: string
  lga: string
  ward: string
  date_submitted: string
}
export const columns: ColumnDef<Survey>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "user_id",
    header: "User ID",
  },
  {
    accessorKey: "url",
    header: "URL",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "state_id",
    header: "State ID",
  },
  {
    accessorKey: "lga_id",
    header: "LGA ID",
  },
  {
    accessorKey: "ward_id",
    header: "Ward ID",
  },
]