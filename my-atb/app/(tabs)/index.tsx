import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Button,
    TouchableOpacity
} from 'react-native';
import {SafeAreaProvider} from "react-native-safe-area-context";
import ScrollView = Animated.ScrollView;
import {router} from "expo-router";

export default function HomeScreen() {

    const onPressNotFound = () => {
        router.replace("/explore");
        // console.log("Press button not found");
    }

    const onPressLogin = () => {
        router.push("/login");
    }

    return (
        <>
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
                                className="w-full flex justify-center items-center my-6"
                                style={{
                                    minHeight: Dimensions.get("window").height - 100,
                                }}
                            >
                                <Text className={"text-3xl font-bold mb-6 text-black"}>
                                    Додати категорію
                                </Text>

                                <TouchableOpacity
                                    className={`bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 `}
                                    onPress={onPressNotFound}
                                >
                                    <Text className="text-white font-bold text-lg">{"Перехід на not found"}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className={`bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800 `}
                                    onPress={onPressLogin}
                                >
                                    <Text className="text-white font-bold text-lg">{"Перехід на вхід"}</Text>
                                </TouchableOpacity>

                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </SafeAreaProvider>

        </>
    );
}


