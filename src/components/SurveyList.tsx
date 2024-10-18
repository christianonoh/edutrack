// Survey.tsx

import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar";
import { formatDate, getPhotoUrl } from "@/lib/utils";
export interface Survey {
    id: number;
    title: string;
    email: string;
    avatarFallback: string;
    created_at: string;
    url: string;
    volunteer: {
        first_name: string;
        surname: string;
        email: string;
        photo: string;
    };
}
import { Separator } from "@/components/ui/separator"

import { useEffect, useState } from "react";

export const Survey = ({ survey }: { survey: Survey }) => {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchPhotoUrl = async () => {
            const url = await getPhotoUrl(survey.volunteer.photo);
            setPhotoUrl(url);
        };
        fetchPhotoUrl();
    }, [survey.volunteer.photo]);

    // const handleDownload = async (url: string) => {
    //     const fileUrl = await getSurveyFileUrl(url);
    //     if (fileUrl) {
    //         window.open(fileUrl, "_blank");
    //     } else {
    //         console.error("Failed to get the file URL.");
    //     }
    // };

    let initials = survey.volunteer.first_name.charAt(0) + survey.volunteer.surname.charAt(0);
    return <><div key={survey.id} className="flex items-center gap-4">
        <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src={photoUrl || ""} alt="Avatar" />
            <AvatarFallback>{initials}</AvatarFallback>
            {/* <Button onClick={() => handleDownload(survey.url)}>Download</Button> */}
        </Avatar>
        <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">{survey.title}</p>
            <p className="text-sm text-muted-foreground">{survey.volunteer.first_name + ' ' + survey.volunteer.surname}</p>
        </div>
        <div className="ml-auto font-medium">{formatDate(survey.created_at)}</div></div>
        <Separator className="my-0.5" />
    </>;
}


