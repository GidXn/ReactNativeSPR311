export interface IUserListItemResponse {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
    dateCreated: string;
    emailConfirmed: boolean;
    roles: string[];
}

