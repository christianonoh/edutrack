import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/supabaseClient";
import Swal from 'sweetalert2';

// Merge Tailwind classes with conditional classNames
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Fetch all states
export const fetchStates = async (): Promise<any[]> => {
  const { data, error } = await supabase.from("states").select("*");
  if (error) {
    console.error("Error fetching states:", error.message);
    return [];
  }
  return data || [];
};

// Fetch all LGAs by state ID
export const fetchLgas = async (stateId: number): Promise<any[]> => {
  const { data, error } = await supabase
    .from("lgas")
    .select("*")
    .eq("state_id", stateId);
  if (error) {
    console.error("Error fetching LGAs:", error.message);
    return [];
  }
  return data || [];
};

// Fetch all Wards by LGA ID
export const fetchWards = async (lgaId: number | string): Promise<any[]> => {
  const { data, error } = await supabase
    .from("wards")
    .select("*")
    .eq("lga_id", lgaId);
  if (error) {
    console.error("Error fetching wards:", error.message);
    return [];
  }
  return data || [];
};

// Upload a photo to Supabase storage
export const uploadPhoto = async (photo: File): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from("edutrack")
    .upload(`avatars/${photo.name}`, photo);
  if (error) {
    console.error("Error uploading photo:", error.message);
    return null;
  }
  return data?.path || null;
};

// Volunteer-related Functions
interface Volunteer {
  firstName: string;
  surname: string;
  gender: number | null;
  email: string;
  photoUrl: string | null;
  stateId: number | null;
  lgaId: number | null;
  wardId: number | null;
  community: string;
}

// Create a new volunteer
export const createVolunteer = async (volunteer: Volunteer): Promise<any | null> => {
  const { data, error } = await supabase
    .from("volunteers")
    .insert([{
      first_name: volunteer.firstName,
      surname: volunteer.surname,
      gender: volunteer.gender,
      email: volunteer.email,
      photo: volunteer.photoUrl,
      state_id: volunteer.stateId,
      lga_id: volunteer.lgaId,
      ward_id: volunteer.wardId,
      community: volunteer.community,
    }])
    .select(`
      *,
      state:state_id (*),
      lga:lga_id (*),
      ward:ward_id (*)
    `)
    .single();
  if (error) {
    console.error("Error creating volunteer:", error.message);
    return null;
  }
  // Save volunteer data to local storage
  if (data) {
    localStorage.setItem('volunteer', JSON.stringify(data));
  }
  return data;
};

// Log in a volunteer by email
export const loginVolunteer = async (email: string): Promise<any | null> => {
  const { data, error } = await supabase
    .from("volunteers")
    .select(`
      *,
      state:state_id (*),
      lga:lga_id (*),
      ward:ward_id (*)
    `)
    .eq("email", email)
    .single();
  if (error) {
    console.error("Error logging in volunteer:", error.message);
    return null;
  }

  // Save volunteer data to local storage
  if (data) {
    localStorage.setItem('volunteer', JSON.stringify(data));
  }

  return data;
};

// Survey-related Functions
interface SurveyResponse {
  volunteerId: number;
  filePath: string;
  title: string;
  stateId?: string | number;
  lgaId?: string | number;
  wardId?: string | number;
  community?: string;
}

// Upload a survey file to Supabase storage
export const uploadSurveyFile = async (file: File): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from("edutrack")
    .upload(`surveys/${file.name}`, file);
  if (error) {
    console.error("Error uploading survey file:", error.message);
    return null;
  }
  return data?.path || null;
};

// Submit a new survey
export const submitSurvey = async (response: SurveyResponse): Promise<any | null> => {
  const { data, error } = await supabase
    .from("surveys")
    .insert({
      user_id: response.volunteerId,
      url: response.filePath,
      title: response.title,
      state_id: response.stateId,
      lga_id: response.lgaId,
      ward_id: response.wardId,
      community: response.community
    })
    .select(`
      *,
      volunteer:user_id (*)
    `);

  if (error) {
    console.error("Error submitting survey:", error.message);
    return null;
  }
  return data;
};

// Fetch surveys by volunteer ID
export const fetchSurveys = async (volunteerId: number): Promise<any[]> => {
  const { data, error } = await supabase
    .from("surveys")
    .select(`community,title,created_at,volunteer:user_id (*)`)
    .eq("user_id", volunteerId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error("Error fetching surveys:", error.message);
    return [];
  }
  return data || [];
};

export const fetchVolunteerSurveys = async (volunteerId: number): Promise<any[]> => {
  const { data, error } = await supabase
    .from("surveys")
    .select(`
      *,
      volunteer:user_id (*),
      state:state_id (*),
      lga:lga_id (*),
      ward:ward_id (*)
    `)
    .eq("user_id", volunteerId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error("Error fetching surveys:", error.message);
    return [];
  }
  return data || [];
};

// Format a date string into a human-readable format
export const formatDate = (dateString: string, format: 'short' | 'long' = 'short'): string => {
  const options: Intl.DateTimeFormatOptions = format === 'long' ? {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  } : {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

// View or download a survey file from Supabase storage
export const getSurveyFileUrl = async (filePath: string): Promise<string | null> => {
  const { data } = await supabase.storage
    .from("edutrack")
    .getPublicUrl(filePath);
  if (!data) {
    console.error("Error getting survey file URL");
    return null;
  }
  return data.publicUrl || null;
};

// Display a photo using the URL stored in Supabase storage
export const displayPhoto = (photoUrl: string): HTMLImageElement => {
  const img = document.createElement('img');
  img.src = photoUrl;
  img.alt = 'Volunteer Photo';
  img.style.maxWidth = '100%';
  img.style.height = 'auto';
  return img;
};
// Get a public URL for a photo stored in Supabase storage
export const getPhotoUrl = async (filePath: string): Promise<string | null> => {
  const { data } = await supabase.storage
    .from("edutrack")
    .getPublicUrl(filePath);

  return data.publicUrl || null;
};

// Fetch surveys with optional filters
interface SurveyFilters {
  volunteerId?: number;
  title?: string;
  dateRange?: { start: string; end: string };
  selectedDate?: string;
  stateId?: string | null;
  lgaId?: string | null;
  wardId?: string | null;
}

export const fetchSurveysAdmin = async (filters: SurveyFilters = {}): Promise<any[]> => {
  let query = supabase.from("surveys").select(`
    *,
    volunteer:user_id (*),
    state:state_id (*),
    lga:lga_id (*),
    ward:ward_id (*)
  `);

  if (filters.volunteerId) {
    query = query.eq("user_id", filters.volunteerId);
  }

  if (filters.title) {
    query = query.ilike("title", `%${filters.title}%`);
  }

  if (filters.dateRange) {
    query = query.gte("created_at", filters.dateRange.start).lte("created_at", filters.dateRange.end);
  }

  if (filters.selectedDate) {
    const startOfDay = new Date(filters.selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(filters.selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    query = query.gte("created_at", startOfDay.toISOString()).lte("created_at", endOfDay.toISOString());
  }

  if (filters.stateId) {
    query = query.eq("state_id", filters.stateId);
  }

  if (filters.lgaId) {
    query = query.eq("lga_id", filters.lgaId);
  }

  if (filters.wardId) {
    query = query.eq("ward_id", filters.wardId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching surveys:", error.message);
    return [];
  }

  return data || [];
};

interface VolunteerFilters {
  stateId?: number;
  lgaId?: number;
  wardId?: number;
  selectedDate?: string;
}

export const fetchVolunteers = async (filters: VolunteerFilters = {}): Promise<any[]> => {
  let query = supabase
  .from("volunteers")
  .select(`
    *,
    state:state_id (*),
    lga:lga_id (*),
    ward:ward_id (*),
    surveys(count)
  `, { count: 'exact' });


  if (filters.selectedDate) {
    const startOfDay = new Date(filters.selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(filters.selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: surveysData, error: surveysError } = await supabase
      .from("surveys")
      .select("user_id")
      .gte("created_at", startOfDay.toISOString())
      .lte("created_at", endOfDay.toISOString());

    if (surveysError) {
      console.error("Error fetching surveys by date:", surveysError.message);
      return [];
    }

    const volunteerIds = surveysData.map((survey: any) => survey.user_id);
    query = query.in("id", volunteerIds);
  }

  if (filters.stateId) {
    query = query.eq("state_id", filters.stateId);
  }

  if (filters.lgaId) {
    query = query.eq("lga_id", filters.lgaId);
  }

  if (filters.wardId) {
    query = query.eq("ward_id", filters.wardId);
  }

  const { data, error } = await query.order('id', { ascending: false });

  if (error) {
    console.error("Error fetching volunteers:", error.message);
    return [];
  }

  // Fetch public URLs for photos
  const volunteersWithPhotoUrls = await Promise.all(data.map(async (volunteer: any) => {
    if (volunteer.photo) {
      const { data: photoData } = await supabase.storage
        .from("edutrack")
        .getPublicUrl(volunteer.photo);
      volunteer.photoUrl = photoData?.publicUrl || null;
    }
    return volunteer;
  }));

  return volunteersWithPhotoUrls || [];
};


export const signUpUser = async (email: string, password: string, firstName: string, LastName: string): Promise<any | null> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: LastName,
      },
    },
  });

  return { data, error };
};

export const loginUser = async (email: string, password: string): Promise<any | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const fetchSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};

export const handleDownload = async (survey: any) => {
  const { data, error } = await supabase
    .storage
    .from('edutrack')
    .download(survey.url);
  if (!error) {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', survey.title);
      document.body.appendChild(link);
      link.click();
      link.remove();
  } else {
    console.error("Error getting survey file URL");
  }
};

export const handleMarkAsCollated = async (survey: any, reloadData?: () => void) => {
const { error } = await supabase
    .from('surveys')
    .update({ collated: true })
    .eq('id', survey.id)
    .select()

    if(error){
      alert("An error occurred while marking the survey as collated");
    } else {
      reloadData && reloadData();
    }
};

export const logOutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error.message);
  }
};

export const getFullName = (volunteer: any): string => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  return `${capitalize(volunteer.first_name)} ${capitalize(volunteer.surname)}`;
}

export const deleteSurvey = async (survey: any, reloadData?: () => void) => {
  const confirmed = window.confirm("Are you sure? You won't be able to revert this!");

  if (confirmed) {
    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('id', survey.id)
      .select();

    if(error){
      alert("An error occurred while deleting the survey");
    } else {
      reloadData && reloadData();
    }
  }
};
