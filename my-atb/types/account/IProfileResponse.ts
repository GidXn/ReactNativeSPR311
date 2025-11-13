export interface IProfileResponse {
    email: string;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
    dateCreated: string;
    roles: string[];
}

