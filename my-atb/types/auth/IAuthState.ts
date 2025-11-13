import {IUser} from "@/types/auth/IUser";

export interface IAuthState {
    user: IUser | null;
}