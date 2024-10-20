// VolunteerFormData.tsx

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { fetchStates, fetchLgas, fetchWards, uploadPhoto, loginVolunteer, createVolunteer } from "@/lib/utils";
import { LGA, State, Volunteer, Ward } from "@/lib/types";
import { Navigate } from "react-router-dom";
import { DownloadSurveyFiles } from "./SurveyFiles";


export function VolunteerFormData({ setVolunteer }: { setVolunteer: (value: any) => void }) {

  const [formData, setFormData] = useState<Volunteer>({
    firstName: "",
    surname: "",
    gender: null,
    email: "",
    state: null,
    lga: null,
    ward: null,
    community: "",
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [states, setStates] = useState<State[]>([]);
  const [lgas, setLgas] = useState<LGA[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const genders = [{ name: 'Male', id: 1 }, { name: 'Female', id: 2 }];
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStates().then(setStates);
  }, []);

  useEffect(() => {
    if (formData.state) {
      fetchLgas(formData.state).then(setLgas);
    } else {
      setLgas([]);
      setFormData({ ...formData, lga: null, ward: null });
    }
  }, [formData.state]);

  useEffect(() => {
    if (formData.lga) {
      fetchWards(formData.lga).then(setWards);
    } else {
      setWards([]);
      setFormData({ ...formData, ward: null });
    }
  }, [formData.lga]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData({
      ...formData,
      [name]: parseInt(value),
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const { firstName, surname } = formData;
      const dateString = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `${firstName}_${surname}_${dateString}${file.name.substring(
        file.name.lastIndexOf(".")
      )}`;

      const renamedFile = new File([file], fileName, { type: file.type });
      setFormData({
        ...formData,
        photo: renamedFile,
      });

      const previewUrl = URL.createObjectURL(renamedFile);
      setPhotoPreview(previewUrl);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const volunteer = await loginVolunteer(formData.email);

      if (volunteer) {
        setVolunteer(volunteer);
      } else {
        setError("User not found. Please sign up.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const existingVolunteer = await loginVolunteer(formData.email);
      if (existingVolunteer) {
        setError("Email already exists. Please use a different email or update your record.");
        return;
      }
      let photoUrl = null;
      if (formData.photo) {
        photoUrl = await uploadPhoto(formData.photo);
        if (!photoUrl) throw new Error("Error uploading photo");
      }

      const volunteer = await createVolunteer({
        firstName: formData.firstName,
        surname: formData.surname,
        gender: formData.gender,
        email: formData.email,
        photoUrl: photoUrl,
        stateId: formData.state,
        lgaId: formData.lga,
        wardId: formData.ward,
        community: formData.community,
      });
      setVolunteer(volunteer);
      <Navigate to="/" />
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <DownloadSurveyFiles />
      <Tabs defaultValue="1" className="max-w-2xl md:mt-6 mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="1" onClick={() => setError('')}>New Volunteer</TabsTrigger>
          <TabsTrigger value="2" onClick={() => setError('')}>Update Your Record</TabsTrigger>
        </TabsList>
        <TabsContent value="2">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Volunteer Login</CardTitle>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    {error && (
                      <span className="text-red-500 text-sm">{error}</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Proceed</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="1">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Let's get your info so you can submit your research findings</CardTitle>
            </CardHeader>
            <form onSubmit={handleSignup}>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="firstName">First Name
                      <span className="text-red-500 font-semibold">&nbsp;*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="surname">Surname
                      <span className="text-red-500 font-semibold">&nbsp;*</span>
                    </Label>
                    <Input
                      id="surname"
                      placeholder="Surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email
                      <span className="text-red-500 font-semibold">&nbsp;*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="gender">Gender
                      <span className="text-red-500 font-semibold">&nbsp;*</span>
                    </Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("gender", value)}
                      required
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map((gender) => (
                          <SelectItem key={gender.id} value={gender.id.toString()}>
                            {gender.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="state">State
                      <span className="text-red-500 font-semibold">&nbsp;*</span>
                    </Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("state", value)}
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
                    <Label htmlFor="lga">LGA
                      <span className="text-red-500 font-semibold">&nbsp;*</span>
                    </Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("lga", value)}
                      disabled={!formData.state}
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
                    <Label htmlFor="ward">Ward
                      <span className="text-red-500 font-semibold">&nbsp;*</span>
                    </Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("ward", value)}
                      disabled={!formData.lga || wards.length === 0}
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
                    <Label htmlFor="community">Community
                      <span className="text-red-500 font-semibold">&nbsp;*</span>
                    </Label>
                    <Input
                      id="community"
                      placeholder="Community name"
                      name="community"
                      value={formData.community}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Photo */}
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="photo">Your Profile Picture
                      <span className="text-red-500 font-semibold">&nbsp;*</span>
                    </Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                    {/* Preview the selected image */}
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Selected Preview"
                        className="mt-2 w-32 h-32 object-cover"
                      />
                    )}
                  </div>
                  {error && (
                    <span className="text-red-500 text-sm">{error}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Proceed to Upload Data</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
