import { CircleUser } from "lucide-react"
import { Button } from "@/components/ui/button";
// import { Volunteer } from "./VolunteerFormData";
import { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { logOutUser } from "@/lib/utils";
import { DownloadSurveyFiles } from "./SurveyFiles";

interface NavBarProps {
    volunteer?: any | null;
    setShowSurveyForm?: (show: boolean) => void | null;
    user?: any | null;
    showSurveyForm?: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({ volunteer, setShowSurveyForm, user, showSurveyForm }) => {
    const [profile, setProfile] = useState<any | null>(null);
    useEffect(() => {
        if(user){
            setProfile(user);
        } else if(volunteer){
            setProfile(volunteer);
        }
    }, [user, volunteer]);
    function handleLogout() {
        if(user){
            logOutUser();
        } else if(volunteer){
                localStorage.removeItem('volunteer');
                window.location.reload();
        }
    }
    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-gray-100 px-4 md:px-6 max-w-7xl mx-auto">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center w-full justify-between md:gap-5 md:text-sm lg:gap-6">
                <div className="text-sm sm:text-lg font-semibold md:text-base md:w-full">
                    <a href="#">
                        <span>SouthEast Education Data Collation</span>
                    </a>
                </div>
                {volunteer && (
                    <Button onClick={() => setShowSurveyForm && setShowSurveyForm(!showSurveyForm)} type="submit" className="">
                        Upload Research Data
                    </Button>
                )}
            </nav>
            <Sheet>
                <div className="flex w-full justify-between md:hidden">
                    <SheetHeader>
                        <SheetTitle>SouthEast Education Data Collation</SheetTitle>
                    </SheetHeader>
                    <div className="flex gap-2">
                        {volunteer && (
                            <Button onClick={() => setShowSurveyForm && setShowSurveyForm(true)} type="submit" className="">
                                Upload Research Data
                            </Button>
                        )}
                        <SheetTrigger>
                            <div className="rounded-full flex justify-flex-end">
                                <CircleUser className="h-6 w-6" />
                            </div>
                        </SheetTrigger>
                    </div>
                </div>
                <SheetTrigger className="hidden md:block">
                    <div className="rounded-full flex justify-flex-end">
                        <CircleUser className="h-6 w-6" />
                    </div>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium ">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <span>SouthEast Education Data Collation</span>
                        </div>
                        {profile && (
                            <>
                                {profile.first_name && (profile.surname || profile.last_name) && (
                                    <div className="hover:text-foreground">
                                        {profile.first_name} {profile.surname || profile.last_name}
                                        <div className="text-xs text-muted-foreground">
                                            Name
                                        </div>
                                    </div>
                                )}
                                {profile.email && (
                                    <div className="text-muted-foreground hover:text-foreground">
                                        {profile.email}
                                        <div className="text-xs text-muted-foreground">
                                            Email
                                        </div>
                                    </div>
                                )}
                                {profile.state?.name && (
                                    <div className="hover:text-foreground">
                                        {profile.state.name}
                                        <div className="text-xs text-muted-foreground">
                                            State
                                        </div>
                                    </div>
                                )}
                                {profile.lga?.name && (
                                    <div className="hover:text-foreground">
                                        {profile.lga.name}
                                        <div className="text-xs text-muted-foreground">
                                            LGA
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <DownloadSurveyFiles />

                        {
                            profile && (
                                <SheetFooter>
                                    <Button
                                        className="w-full mt-10"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </SheetFooter>)
                        }
                    </nav>
                </SheetContent>
            </Sheet>
        </header>
    )
    // Remove the custom useState function
}


