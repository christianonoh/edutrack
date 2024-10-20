import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DataTable } from "./DataTable"
import { getSurveyColumns } from "./columns"
import { Card } from "./ui/card"
import { fetchVolunteerSurveys, getFullName } from "@/lib/utils"
import { useState } from "react"

export interface PopOverProps {
    volunteer: any | null;
    setVolunteer?: (volunteer: any) => void;
}

export const PopOver = ({ volunteer }: PopOverProps) => {
    const [surveys, setSurveys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchSurveys = async () => {
        setIsLoading(true);
        const data = await fetchVolunteerSurveys(volunteer.id);
        if (data) {
            setIsLoading(false);
            setSurveys(data);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild disabled={volunteer.surveys[0]['count'] == 0 }>
                <Button variant="outline" onClick={() => fetchSurveys()}>View Uploads</Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl w-full py-12">
                <DialogHeader>
                    <DialogTitle>{getFullName(volunteer)} Uploads</DialogTitle>
                    {/* <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription> */}
                </DialogHeader>
                <Card className="flex items-center w-full overflow-hidden">
                    <div className="overflow-x-auto text-sm w-full">
                        <DataTable columns={getSurveyColumns} data={surveys} isLoading={isLoading} reloadData={fetchSurveys} />
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

