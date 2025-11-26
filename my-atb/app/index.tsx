import {SafeAreaProvider} from "react-native-safe-area-context";
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    View
} from "react-native";
import ScrollView = Animated.ScrollView;
import {router} from "expo-router";
import {useProfileQuery} from "@/services/apiAccount";
import {useEffect} from "react";

const WelcomeScreen = () => {

    const {data: userProfile, isLoading} = useProfileQuery();

    useEffect(() => {
        if (!isLoading) {
            if (userProfile) {
                router.replace('/(tabs)/profile'); // користувач є
            } else {
                router.replace('/(auth)'); // користувача немає
            }
        }
    }, [isLoading, userProfile]);

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
                            {/*<LoadingOverlay visible={isLoading} />*/}
                            <View
                                className="w-full flex justify-center items-center my-6"
                                style={{
                                    minHeight: Dimensions.get("window").height - 100,
                                }}
                            >
                                <Text className={"text-3xl font-bold mb-6 text-black"}>
                                    Завантаження даних ...
                                </Text>

                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </SafeAreaProvider>
        </>
    )
}

export default WelcomeScreen;