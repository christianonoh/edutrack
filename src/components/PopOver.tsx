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
import { columns } from "./columns"
import { Card } from "./ui/card"
import { getFullName } from "@/lib/utils"

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

