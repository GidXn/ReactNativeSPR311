import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

const NotFoundScreen = () => {
    const router = useRouter();

    return (
        <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
            <Text className="text-4xl font-bold text-red-500 mb-4">404</Text>
            <Text className="text-lg text-gray-700 dark:text-gray-200 mb-6 text-center">
                Сторінку не знайдено 😢
            </Text>

            <Pressable
                onPress={() => router.replace("/")}
                className="bg-blue-600 px-6 py-3 rounded-2xl active:bg-blue-700"
            >
                <Text className="text-white text-base font-semibold">
                    Повернутися на головну
                </Text>
            </Pressable>
        </View>
    );
}

export default NotFoundScreen;
