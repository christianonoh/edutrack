// SurveyForm.tsx

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchLgas, fetchStates, fetchSurveys, fetchWards, submitSurvey, uploadSurveyFile } from "@/lib/utils";
import { LGA, State, Ward } from "@/lib/types";


interface SurveyFormProps {
  setSurveys: (value: any) => void | null;
  volunteer: any | null;
  setShowSurveyForm: (value: any) => void | null;
  surveys?: any[] | null;
  setIsLoading: (value: boolean) => void | null;
}

interface FormData {
  title: string;
  file: File | null;
  stateId: number;
  lgaId: string | undefined;
  wardId: string | undefined;
  community: string;
}

export function SurveyForm({ setSurveys, volunteer, setShowSurveyForm, setIsLoading }: SurveyFormProps) {
  const [states, setStates] = useState<State[]>([]);
  const [lgas, setLgas] = useState<LGA[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    file: null,
    stateId: volunteer.state_id?.toString(),
    lgaId: volunteer.lga_id?.toString(),
    wardId: volunteer.ward_id?.toString(),
    community: volunteer.community,
  });

  const [error, setError] = useState<string | null>(null);

  const fetchSurveysAsync = async (volunteerId: number) => {
    setIsLoading(true);
    try {
      const fetchedSurveys = await fetchSurveys(volunteerId);
      setSurveys(fetchedSurveys);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStates().then((data) => {
      setStates(data)
      setFormData({ ...formData, stateId: volunteer.state_id, lgaId: volunteer.lga_id, wardId: volunteer.ward_id });
      fetchLgas(volunteer.state_id).then(setLgas);
      fetchWards(volunteer.lga_id).then(setWards);
    });

  }, []);

  useEffect(() => {
    if (formData.stateId) {
      fetchLgas(formData.stateId).then(setLgas);
    } else {
      setLgas([]);
      setFormData({ ...formData, lgaId: undefined, wardId: undefined });
    }
  }, [formData.stateId]);

  useEffect(() => {
    if (formData.lgaId) {
      fetchWards(formData.lgaId).then(setWards);
    } else {
      setWards([]);
      setFormData({ ...formData, wardId: undefined });
    }
  }, [formData.lgaId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0];
      const newFileName = `${formData.title.replace(/\s+/g, '')}-${timestamp}${file.name.substring(file.name.lastIndexOf('.'))}`;
      const renamedFile = new File([file], newFileName, { type: file.type });

      setFormData({
        ...formData,
        file: renamedFile,
      });
    }
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: parseInt(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      // Assuming there's an API call for submitting the survey
      if (!formData.file) {
        setError("Please select a file to upload");
        return;
      }

      let filePath = await uploadSurveyFile(formData.file);
      if (!filePath) throw new Error("Error uploading file");
      const survey = await submitSurvey({
        title: formData.title,
        filePath: filePath,
        stateId: formData.stateId,
        lgaId: formData.lgaId,
        wardId: formData.wardId,
        community: formData.community,
        volunteerId: volunteer.id,
      });
      if (!survey) throw new Error("Error submitting survey");
      if (survey) {
        setShowSurveyForm(false);
        fetchSurveysAsync(volunteer.id);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during survey submission.");
    }
  };

  return (
    <Card className="w-full max-w-2xl mt-8">
      <CardHeader>
        <CardTitle>Upload Research Data</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                placeholder="Document title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="state">State</Label>
              <Select
                onValueChange={(value) => handleSelectChange("stateId", value)}
                value={formData.stateId?.toString() || ""}
                required
              >
                <SelectTrigger id="state">
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
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lga">LGA</Label>
              <Select
                onValueChange={(value) => handleSelectChange("lga", value)}
                disabled={!formData.stateId}
                value={formData.lgaId?.toString() || ""}
                required
              >
                <SelectTrigger id="lga">
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
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="ward">Ward</Label>
              <Select
                value={formData.wardId?.toString() || ""}
                onValueChange={(value) => handleSelectChange("ward", value)}
                disabled={!formData.lgaId || wards.length === 0}
              >
                <SelectTrigger id="ward">
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
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="community">Community</Label>
              <Input
                id="community"
                placeholder="Community name"
                name="community"
                value={formData.community}
                onChange={handleInputChange}
              />
            </div>

            {/* File */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="file">Attach File</Label>
              <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Submit</Button>
        </CardFooter>
      </form>
    </Card>
  );
}

