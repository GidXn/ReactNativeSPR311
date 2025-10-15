import * as ImagePicker from 'expo-image-picker';

export const pickImage = async () : Promise<string | undefined> => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
        alert("Дайте доступ до файлової системи!");
        return undefined;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
    });

    if (!result.canceled) {
        return result.assets[0].uri
    }
    return undefined;
};