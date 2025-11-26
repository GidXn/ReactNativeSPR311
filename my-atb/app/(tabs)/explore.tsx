import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    View,
    FlatList,
    Image,
    ActivityIndicator,
} from 'react-native';
import {SafeAreaProvider} from "react-native-safe-area-context";
import ScrollView = Animated.ScrollView;
import {useNoteCategoriesListQuery} from "@/services/apiNoteCategories";

export default function TabTwoScreen() {
    const {data, isLoading, isError, refetch} = useNoteCategoriesListQuery();

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <ScrollView
                        contentContainerStyle={{flexGrow: 1, paddingHorizontal: 20}}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View
                            className="w-full my-6"
                            style={{
                                minHeight: Dimensions.get("window").height - 100,
                            }}
                        >
                            <Text className="text-3xl font-bold mb-6 text-black">
                                Мої категорії
                            </Text>

                            {isLoading && (
                                <View className="items-center justify-center mt-4">
                                    <ActivityIndicator size="large" color="#000" />
                                    <Text className="mt-2 text-gray-600">Завантаження...</Text>
                                </View>
                            )}

                            {isError && (
                                <View className="items-center justify-center mt-4">
                                    <Text className="text-red-600 mb-2">
                                        Помилка завантаження категорій.
                                    </Text>
                                    <Text
                                        className="text-blue-600"
                                        onPress={() => refetch()}
                                    >
                                        Спробувати ще раз
                                    </Text>
                                </View>
                            )}

                            {!isLoading && !isError && (
                                <FlatList
                                    data={data || []}
                                    keyExtractor={(item) => item.id.toString()}
                                    ItemSeparatorComponent={() => (
                                        <View className="h-[1px] bg-gray-200 my-2" />
                                    )}
                                    renderItem={({item}) => (
                                        <View className="flex-row items-center py-3">
                                            <Image
                                                source={{uri: item.image}}
                                                className="w-12 h-12 rounded-full mr-3 bg-gray-200"
                                            />
                                            <View className="flex-1">
                                                <Text className="text-lg font-semibold text-black">
                                                    {item.name}
                                                </Text>
                                                <Text className="text-xs text-gray-500">
                                                    Створено: {item.dateCreated}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                    ListEmptyComponent={() => (
                                        <View className="items-center justify-center mt-4">
                                            <Text className="text-gray-600">
                                                Категорій поки немає.
                                            </Text>
                                        </View>
                                    )}
                                />
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}