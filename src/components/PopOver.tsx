import { CopyIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable } from "./DataTable"
import { columns } from "./columns"
import { Card } from "./ui/card"
import { fetchSurveys, getFullName } from "@/lib/utils"
import { useEffect, useState } from "react"


export interface PopOverProps {
    volunteer: any | null;
}


export const PopOver = ({ volunteer }: PopOverProps) => {
    // const [surveys, setSurveys] = useState<any[]>([]);

    // const fetchVolunteerSurveys = async () => {
    //     const data = await fetchSurveys(volunteer.id);
    //     setSurveys(data);
    // }
    
    // useEffect(() => {
    //     fetchVolunteerSurveys();
    // }, []);
    return (
        <Dialog>
            <DialogTrigger asChild disabled={volunteer.surveys.length == 0 }>
                <Button variant="outline">View Uploads</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full py-12">
                <DialogHeader>
                    <DialogTitle>{getFullName(volunteer)} Uploads</DialogTitle>
                    {/* <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription> */}
                </DialogHeader>
                <Card className="flex items-center w-full">
                    <div className="grid flex-1 gap-2">
                        <DataTable columns={columns} data={volunteer.surveys} />
                    </div>
                </Card>


                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

