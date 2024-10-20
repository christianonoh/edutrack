import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { DownloadIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export const DownloadSurveyFiles = () => {
    const files = [

        { name: "Letter Template For Schools", url: "https://zhcfizpcjitvvmhhinwl.supabase.co/storage/v1/object/public/edutrack/research_documents/Template_For_Education_Data_Collection_Letter_For_Schools.pdf" },
        { name: "State Education Data Collation Template", url: "https://zhcfizpcjitvvmhhinwl.supabase.co/storage/v1/object/public/edutrack/research_documents/State_Education_Data.xlsx" },
        { name: "Education Data Project Questionnaire", url: "https://zhcfizpcjitvvmhhinwl.supabase.co/storage/v1/object/public/edutrack/research_documents/Education_Data_Project_Questionnaire.pdf" },
        { name: "Project Timeline And Action Plan", url: "https://zhcfizpcjitvvmhhinwl.supabase.co/storage/v1/object/public/edutrack/research_documents/Project_Timeline_And_Action_Plan.jpeg" },
        { name: "ID Card Template", url: "https://zhcfizpcjitvvmhhinwl.supabase.co/storage/v1/object/public/edutrack/research_documents/Education_Data_Collation_ID_Card.pdf" },
    ];
    return (
        <Card className="bg-slate-200">
            <CardContent>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-sm font-semibold text-gray-800 transition-colors">
                            Important document downloads for the research project - (Click to view them)
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col space-y-2 mt-4">
                                {files.map((file, index) => (
                                    <a
                                        key={index}
                                        href={file.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-between px-4 py-3 bg-white hover:bg-blue-50 transition-colors border border-gray-200 rounded-lg shadow-sm"
                                    >
                                        <span className="text-gray-700 font-medium">
                                            {file.name}
                                        </span>
                                        <DownloadIcon size={16} />
                                    </a>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
};

