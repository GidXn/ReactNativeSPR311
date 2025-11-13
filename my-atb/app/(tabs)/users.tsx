import {useCallback, useMemo, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    SafeAreaView,
    Text,
    View
} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";

import {BASE_URL} from "@/constants/Urls";
import images from "@/constants/images";
import {useGetUsersQuery} from "@/services/apiAccount";
import {useAppSelector} from "@/store";

const AVATAR_SIZE = 56;

const UsersScreen = () => {
    const {user} = useAppSelector(state => state.auth);
    const isAdmin = useMemo(() => user?.roles?.includes("Admin") ?? false, [user?.roles]);

    const {data, isLoading, isFetching, isError, error, refetch} = useGetUsersQuery(undefined, {
        skip: !isAdmin,
    });

    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = useCallback(async () => {
        if (!isAdmin) {
            return;
        }
        setRefreshing(true);
        try {
            await refetch().unwrap();
        } catch (e) {
            console.log("Users refresh error", e);
        } finally {
            setRefreshing(false);
        }
    }, [isAdmin, refetch]);

    const renderItem = ({item}: {item: NonNullable<typeof data>[number]}) => {
        const avatarSource = item.image
            ? {uri: `${BASE_URL}/images/100_${item.image}`}
            : images.noimage;

        const fullName = item.firstName || item.lastName
            ? `${item.lastName ?? ""} ${item.firstName ?? ""}`.trim()
            : item.email;

        const createdAt = new Date(item.dateCreated).toLocaleDateString();

        return (
            <View className="flex-row items-center gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm mb-3">
                <Image
                    source={avatarSource}
                    className="rounded-full"
                    style={{width: AVATAR_SIZE, height: AVATAR_SIZE}}
                />
                <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900">
                        {fullName}
                    </Text>
                    <Text className="text-sm text-gray-500">
                        {item.email}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                        Ролі: {item.roles.length > 0 ? item.roles.join(", ") : "Користувач"}
                    </Text>
                </View>
                <View className="items-end">
                    <Text className="text-xs text-gray-400">
                        {createdAt}
                    </Text>
                    {item.emailConfirmed && (
                        <Text className="mt-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                            Пошта підтверджена
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    const renderContent = () => {
        if (!isAdmin) {
            return (
                <View className="flex-1 items-center justify-center px-6">
                    <Text className="text-lg font-semibold text-gray-800 text-center">
                        Доступ до списку користувачів мають лише адміністратори.
                    </Text>
                </View>
            );
        }

        if (isLoading && !refreshing) {
            return (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" />
                    <Text className="mt-4 text-base text-gray-500">Завантаження користувачів...</Text>
                </View>
            );
        }

        if (isError) {
            const message = (error as {status?: number}) ?? {};
            return (
                <View className="flex-1 items-center justify-center px-6 gap-3">
                    <Text className="text-lg font-semibold text-red-600 text-center">
                        Не вдалося отримати список користувачів
                    </Text>
                    {"status" in message && (
                        <Text className="text-sm text-gray-500">
                            Код помилки: {message.status}
                        </Text>
                    )}
                    <Text
                        onPress={() => refetch()}
                        className="text-blue-600 font-semibold"
                    >
                        Спробувати ще раз
                    </Text>
                </View>
            );
        }

        return (
            <FlatList
                data={data ?? []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{padding: 16, paddingBottom: 32}}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing || isFetching}
                        onRefresh={handleRefresh}
                    />
                }
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center py-20">
                        <Text className="text-base text-gray-500">
                            Користувачі відсутні
                        </Text>
                    </View>
                }
            />
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-slate-100">
                {renderContent()}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default UsersScreen;

