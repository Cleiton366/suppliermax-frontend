"use client"

import { useEffect, useState } from "react";
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation";
import { Supplier } from "@/interfaces/supplier"
import SupplierMaxService from "@/services/supplier-max-services";
import { toast } from "./ui/use-toast"

export const columns: ColumnDef<Supplier>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-left">Active</div>,
    cell: ({ row }) => {
      const isActive: boolean = row.getValue("isActive");
      return (
        <div className="text-left font-medium">{isActive.toString()}</div>
      )
    },
  },
  {
    accessorKey: "phone",
    header: () => <div className="text-left">Phone</div>,
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.getValue("phone")}</div>
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "address",
    header: () => <div className="text-right">Address</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("address")}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const supplierId = row.original;
      const router = useRouter();

      function handleViewDetails() {
        router.push(`/dashboard/supplier?id=${supplierId.id}`);
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(supplierId.id)}
            >
              Copy supplier ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewDetails}>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
]

export function TableView() {
  const router = useRouter();
  const [data, setData] = useState<Supplier[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const isWindowClient = typeof window === "object";
  const [screenWidth, setScreenWidth] = useState(isWindowClient ? window.innerWidth : undefined);

  useEffect(() => {
    async function fetchData() {
      const suppliers = await SupplierMaxService.getSuppliers();
      setData(suppliers);
    }
    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
  });

  useEffect(() => {
    function setSize() {
      setScreenWidth(window.innerWidth);
    }

    if (isWindowClient) {
      window.addEventListener("resize", setSize);
      if (screenWidth && screenWidth < 768) {
        table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            if (column.id != ('name' || 'actions')) column.toggleVisibility(false);
          });
      } else {
        table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            column.toggleVisibility(true);
          });
      }
      return () => window.removeEventListener("resize", setSize);
    }
  }, [screenWidth, isWindowClient]);

  const showDeleteButton = table.getFilteredSelectedRowModel().rows.length > 0;

  async function handleDelete() {
    const selectedIds = table.getFilteredSelectedRowModel().rows.map(
      (row) => row.original.id
    )

    try {
      selectedIds.map(async (id) => {
        await SupplierMaxService.deleteSupplier(id);
      });
      var newTable = data.filter((supplier) => !selectedIds.includes(supplier.id));
      setData(newTable);
      const rows = table.getRowModel().rows;
      rows.map((row) => {
        row.toggleSelected(false);
      });

      toast({
        title: "Suppliers Deleted",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(selectedIds, null, 2)}</code>
          </pre>
        ),
      })

    } catch (error) {
      console.log(error);
      toast({
        title: "Error While Deleting Suppliers",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(selectedIds, null, 2)}</code>
          </pre>
        ),
      })
    }
  }

  function handleNewSupplier() {
    router.push("/dashboard/supplier/create");
  }

  return (
    <div className="w-full border p-1 md:p-5 shadow-md bg-[#fafefd]">
      <div className="flex flex-col items-center justify-between py-4 md:flex-row">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex flex-col py-4 md:flex-row">
          <div className="flex mb-5 justify-between md:mb-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {
                  table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-5">
                  Filter By Active <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Checkbox
                    checked={table.getColumn("isActive")?.getFilterValue() === true}
                    onCheckedChange={(value) =>
                      table.getColumn("isActive")?.setFilterValue(value ? true : null)
                    }
                  />
                  <label className="text-sm font-medium ml-1 leading-none">
                    Active
                  </label>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Checkbox
                    title="Show inactive"
                    checked={table.getColumn("isActive")?.getFilterValue() === false}
                    onCheckedChange={(value) =>
                      table.getColumn("isActive")?.setFilterValue(value ? false : null)
                    }
                  />
                  <label className="text-sm font-medium ml-1 leading-none">
                    Inactive
                  </label>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Checkbox
                    title="Show all"
                    checked={table.getColumn("isActive")?.getFilterValue() === null}
                    onCheckedChange={(value) =>
                      table.getColumn("isActive")?.setFilterValue(value ? null : true)
                    }
                  />
                  <label className="text-sm font-medium ml-1 leading-none">
                    All
                  </label>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleNewSupplier()}
            >
              New Supplier
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!showDeleteButton}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading data from the server, please wait.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
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
    </div>
  )
}
