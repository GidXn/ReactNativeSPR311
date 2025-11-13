import * as FileSystem from 'expo-file-system'
import {IImageFile} from "@/types/IImageFile";

export const getFileFromUriAsync = async (uri: string): Promise<IImageFile | null> => {
    const fileInfo = await FileSystem.getInfoAsync(uri)
    if (fileInfo.exists) {
        return {
            uri,
            name: uri.split('/').pop(),
            type: 'image/jpeg',
        }
    }
    return null
}