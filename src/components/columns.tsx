
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "./ui/button"
import { CheckIcon, DeleteIcon, DownloadIcon } from "lucide-react"
import { getFullName, deleteSurvey, handleDownload, handleMarkAsCollated } from "@/lib/utils"
import defaultPhoto from "@/assets/default.png"
import { PopOver } from "./PopOver"
import { Badge } from "./ui/badge"

export type Survey = {
  collated: boolean | undefined
  id: number
  state_id: string
  lga: string
  ward: string
  date_submitted: string
}

export const getSurveyColumns = (reloadData: () => void): ColumnDef<Survey>[] => [
  {
    id: 'sn',
    header: 'S/N',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="max-w-sm">
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "state.name",
    header: "State",
  },
  {
    accessorKey: "lga.name",
    header: "LGA",
  },
  {
    accessorKey: "ward.name",
    header: "Ward",
  },
  {
    accessorKey: "community",
    header: "Community",
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const formattedDate = new Date(row.getValue("created_at")).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      return formattedDate;
    },
  },
  {
    accessorKey: "collated",
    header: "Collated",
    cell: ({ row }) => {
      const status = row.getValue("collated");
      return (
        <Badge className={status ? "" : "bg-red-400"}>
          {status ? "Yes" : "No"}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={() => handleDownload(row.original)}
          className="text-blue-500 hover:text-blue-700"
          title="Download"
        >
          <DownloadIcon size={16} />
        </Button>
        <Button
          disabled={row.original.collated}
          title="Mark as Collated"
          variant="outline"
          onClick={() => handleMarkAsCollated(row.original, reloadData)}
          className="text-green-500 hover:text-green-700"
        >
          <CheckIcon size={16} />
        </Button>
        <Button
          disabled={row.original.collated}
          title="Delete survey"
          variant="outline"
          onClick={() => deleteSurvey(row.original, reloadData)}
          className="text-red-500 hover:text-red-700"
        >
          <DeleteIcon size={16} />
        </Button>
      </div>
    ),
  }
]

export const getVolunteersColumns = (): ColumnDef<any>[] => [
  {
    id: 'sn',
    header: 'S/N',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "photo",
    header: "Profile Photo",
    cell: ({ row }) => {
      return <img src={row.original.photoUrl || defaultPhoto} alt="Profile" className="w-10 h-10 rounded-full" />;
    },
  },
  {
    accessorKey: "surname",
    header: "Full Name",
    cell: ({ row }) => {
      return getFullName(row.original);
    },
  },
  {
    id: 'email',
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "state.name",
    header: "State",
  },
  {
    accessorKey: "lga.name",
    header: "LGA",
  },
  {
    accessorKey: "ward.name",
    header: "Ward",
  },
  {
    accessorKey: "collations",
    header: "Collations",
    cell: ({ row }) => {
      return row.original.surveys[0]['count'];
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <>
        <PopOver volunteer={row.original} />
      </>
    ),
  }
]
