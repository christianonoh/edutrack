export interface State {
    id: number;
    name: string;
    created_at: string; // or Date if you're using Date objects
}

export interface LGA {
    id: number;
    name: string;
    state_id: number;
    created_at: string; // or Date if you're using Date objects
}

export interface Ward {
    id: number;
    name: string;
    lga_id: number;
    created_at: string; // or Date if you're using Date objects
}

export interface Volunteer {
    firstName: string;
    surname: string;
    gender: number | null;
    email: string;
    state: number | null;
    lga: number | null;
    ward: number | null;
    community: string;
    photo: File | null;
}