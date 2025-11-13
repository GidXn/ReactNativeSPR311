import {useCallback, useMemo, useState} from "react";
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    View
} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";

import images from "@/constants/images";
import {BASE_URL} from "@/constants/Urls";
import {useGetProfileQuery} from "@/services/apiAccount";

const AVATAR_SIZE = 160;

const ProfileScreen = () => {
    const {data, isLoading, isFetching, isError, refetch, error} = useGetProfileQuery();
    const [refreshing, setRefreshing] = useState(false);

    const avatarSource = useMemo(() => {
        if (data?.image) {
            return {uri: `${BASE_URL}/images/400_${data.image}`};
        }
        return images.noimage;
    }, [data?.image]);

    const fullName = useMemo(() => {
        if (!data) {
            return '';
        }

        const {firstName, lastName} = data;
        if (firstName && lastName) {
            return `${lastName} ${firstName}`;
        }
        if (lastName) {
            return lastName;
        }
        if (firstName) {
            return firstName;
        }

        return data.email;
    }, [data]);

    const createdAt = useMemo(() => {
        if (!data?.dateCreated) {
            return null;
        }

        try {
            return new Date(data.dateCreated).toLocaleDateString();
        } catch {
            return null;
        }
    }, [data?.dateCreated]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await refetch().unwrap();
        } catch (e) {
            console.log("Profile refresh error", e);
        } finally {
            setRefreshing(false);
        }
    }, [refetch]);

    const renderContent = () => {
        if (isLoading && !refreshing) {
            return (
                <View className="flex-1 items-center justify-center py-20">
                    <ActivityIndicator size="large" />
                    <Text className="mt-4 text-base text-gray-500">Завантаження профілю...</Text>
                </View>
            );
        }

        if (isError) {
            const message = (error as {status?: number, data?: {title?: string; detail?: string;}}) ?? {};
            return (
                <View className="flex-1 items-center justify-center gap-4 py-20">
                    <Text className="text-lg font-semibold text-red-600 text-center">
                        Не вдалося отримати дані профілю
                    </Text>
                    {("status" in message) &&
                        <Text className="text-sm text-gray-500 text-center">
                            Код помилки: {message.status}
                        </Text>
                    }
                    <Text
                        onPress={() => refetch()}
                        className="text-blue-600 font-semibold"
                    >
                        Спробувати ще раз
                    </Text>
                </View>
            );
        }

        if (!data) {
            return (
                <View className="flex-1 items-center justify-center py-20">
                    <Text className="text-base text-gray-500">
                        Дані профілю відсутні
                    </Text>
                </View>
            );
        }

        return (
            <View className="flex-1 items-center gap-8 pb-12">
                <View className="items-center mt-6">
                    <Image
                        source={avatarSource}
                        className="rounded-full border-2 border-blue-500"
                        style={{width: AVATAR_SIZE, height: AVATAR_SIZE}}
                    />
                    <Text className="mt-4 text-2xl font-bold text-gray-900">
                        {fullName}
                    </Text>
                    <Text className="text-base text-gray-600">
                        {data.email}
                    </Text>
                </View>

                <View className="w-full max-w-xl gap-4 px-6">
                    <View className="rounded-2xl bg-white px-5 py-4 shadow-sm">
                        <Text className="text-sm font-semibold text-gray-500 uppercase">
                            Ролі
                        </Text>
                        <Text className="mt-1 text-base text-gray-900">
                            {data.roles.length > 0 ? data.roles.join(", ") : "Користувач"}
                        </Text>
                    </View>

                    {createdAt && (
                        <View className="rounded-2xl bg-white px-5 py-4 shadow-sm">
                            <Text className="text-sm font-semibold text-gray-500 uppercase">
                                Дата створення
                            </Text>
                            <Text className="mt-1 text-base text-gray-900">
                                {createdAt}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-slate-100">
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{flexGrow: 1}}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing || isFetching}
                            onRefresh={handleRefresh}
                        />
                    }
                >
                    {renderContent()}
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default ProfileScreen;

