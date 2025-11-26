import React, {useState} from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ActivityIndicator,
} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {useCreateNoteCategoryMutation} from "@/services/apiNoteCategories";
import {Image} from "react-native";

export default function CreateCategoryScreen() {
    const [name, setName] = useState("");
    const [image, setImage] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [createCategory, {isLoading}] = useCreateNoteCategoryMutation();

    const pickImage = async () => {
        setError(null);
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            setError("Немає доступу до галереї.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            const file: any = {
                uri: asset.uri,
                name: asset.fileName || "category.jpg",
                type: asset.mimeType || "image/jpeg",
            };
            setImage(file);
        }
    };

    const onSubmit = async () => {
        setError(null);
        setSuccess(null);

        if (!name.trim()) {
            setError("Вкажіть назву категорії.");
            return;
        }
        if (!image) {
            setError("Вкажіть фото категорії.");
            return;
        }

        try {
            await createCategory({name, image}).unwrap();
            setSuccess("Категорію успішно створено!");
            setName("");
            setImage(null);
        } catch (e: any) {
            setError("Помилка створення категорії.");
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 px-4">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1 justify-center"
                >
                    <View className="w-full">
                        <Text className="text-3xl font-bold mb-6 text-black">
                            Нова категорія
                        </Text>

                        <Text className="mb-2 text-black">Назва</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Введіть назву"
                            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-black"
                        />

                        <TouchableOpacity
                            className="bg-blue-600 rounded-lg px-4 py-3 mb-4"
                            onPress={pickImage}
                        >
                            <Text className="text-white font-semibold text-center">
                                Обрати фото
                            </Text>
                        </TouchableOpacity>

                        {image && (
                            <View className="items-center mb-4">
                                <Image
                                    source={{uri: image.uri}}
                                    className="w-24 h-24 rounded-lg"
                                />
                            </View>
                        )}

                        {error && (
                            <Text className="text-red-600 mb-2">
                                {error}
                            </Text>
                        )}
                        {success && (
                            <Text className="text-green-600 mb-2">
                                {success}
                            </Text>
                        )}

                        <TouchableOpacity
                            className="bg-green-600 rounded-lg px-4 py-3 mt-2 flex-row items-center justify-center"
                            onPress={onSubmit}
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <ActivityIndicator color="#fff" className="mr-2" />
                            )}
                            <Text className="text-white font-semibold">
                                Створити категорію
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}


