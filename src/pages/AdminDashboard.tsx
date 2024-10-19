import * as React from "react"
import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn, fetchVolunteers } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { fetchLgas, fetchStates, fetchWards } from '@/lib/utils';
import { LGA, State, Ward } from '@/lib/types';
import { FilterIcon } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { volunteersColumns } from '@/components/columns';
import { NavBar } from "@/components/NavBar";

const AdminDashboard: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState<State[]>([]);
  const [lgas, setLgas] = useState<LGA[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [volunteers, setVolunteers] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    stateId: undefined,
    lgaId: undefined,
    wardId: undefined,
    dateRange: undefined,
    selectedDate: undefined,
  });

  useEffect(() => {
    // Fetch the user session from Supabase
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    fetchSession();
    fetchStates().then(setStates);
    fetchVolunteers().then(setVolunteers);
    // fetchSurveysAdmin().then((data) => setVolunteers(data));
  }, []);

  useEffect(() => {
    const updateLgas = async () => {
      if (filters.stateId) {
        const lgas = await fetchLgas(filters.stateId);
        setLgas(lgas);
      } else {
        setLgas([]);
        setFilters((prev) => ({ ...prev, lgaId: undefined, wardId: undefined }));
      }
    };
    if(filters.stateId === undefined) {
      const stateField = document.getElementById("stateId") as HTMLInputElement;
      if (stateField) {
        const span = stateField.querySelector("span");
        if (span) {
        span.textContent = "";
        }
      }
    }
    updateLgas();
  }, [filters.stateId]);

  useEffect(() => {
    const updateWards = async () => {
      if (filters.lgaId) {
        const wards = await fetchWards(filters.lgaId);
        setWards(wards);
      } else {
        setWards([]);
        setFilters((prev) => ({ ...prev, wardId: undefined }));
      }
    };
    updateWards();
  }, [filters.lgaId]);

  const handleFilterChange = (field: string, value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearFilters = () => {
    return () => {
      setFilters({
        stateId: undefined,
        lgaId: undefined,
        wardId: undefined,
        dateRange: undefined,
        selectedDate: undefined,
      });
      fetchVolunteers({
        stateId: undefined,
        lgaId: undefined,
        wardId: undefined,
        // dateRange: undefined,
      }).then((data) => setVolunteers(data));
    };
  }





  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You are not logged in. Please log in to view the dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-hidden">
      <NavBar user={session.user.user_metadata} />
      <div className="max-w-7xl mx-auto w-full  p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage and view surveys submitted by respondents.</p>
        </div>

        {/* Filters Section */}
        <div className="mb-6">
          <Button onClick={() => setShowFilters(!showFilters)}>
            <FilterIcon className="w-4 h-4 mr-2" />
            {showFilters ? "Hide" : "Filters"}
          </Button>
          {showFilters && (
            <>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Select onValueChange={(value) => handleFilterChange("stateId", value)} required>
                  <SelectTrigger id="stateId">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.id} value={state.id.toString()}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => handleFilterChange("lgaId", value)} required>
                  <SelectTrigger id="lgaId">
                    <SelectValue placeholder="Select LGA" />
                  </SelectTrigger>
                  <SelectContent>
                    {lgas.map((lga) => (
                      <SelectItem key={lga.id} value={lga.id.toString()}>
                        {lga.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select onValueChange={(value) => handleFilterChange("wardId", value)} required>
                  <SelectTrigger id="wardId">
                    <SelectValue placeholder="Select ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((ward) => (
                      <SelectItem key={ward.id} value={ward.id.toString()}>
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <DatePicker filters={filters} setFilters={setFilters} />

              </div>
              <div className="mt-4 flex space-x-4">
                <Button onClick={() => fetchVolunteers(filters).then((data) => setVolunteers(data))}>
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={handleClearFilters()}>
                  Clear Filters
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Survey Table */}
        <div className="overflow-x-auto">
          <DataTable columns={volunteersColumns} data={volunteers} showVolunteersCount={true} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

interface DatePopoverProps {
  filters: any;
  setFilters: (filters: any) => void;
}

export const DatePicker: React.FC<DatePopoverProps> = ({ filters, setFilters }) => {
  const handleSingleDateChange = (date: Date) => {
    setFilters({
      ...filters,
      selectedDate: date,
      dateRange: undefined,
    });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !filters.selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {filters.selectedDate ? format(filters.selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={filters.selectedDate}
          onSelect={(date) => date && handleSingleDateChange(date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
