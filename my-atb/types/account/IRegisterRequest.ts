import {IImageFile} from "@/types/IImageFile";

export interface IRegisterRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    imageFile: IImageFile | null;
}