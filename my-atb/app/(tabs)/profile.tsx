import {SafeAreaView, View, Text, Image} from "react-native";
import {useAppDispatch, useAppSelector} from "@/store";
import CustomButton from "@/components/custom-button";
import {logout} from "@/store/authSlice";
import {router} from "expo-router";
import images from "@/constants/images";

const ProfileScreen = () => {
    const dispatch = useAppDispatch();
    const {user} = useAppSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        router.replace("/(auth)");
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center px-6">
                <Image
                    source={user?.image ? {uri: user.image} : images.noimage}
                    className="w-32 h-32 rounded-full mb-6"
                />
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                    {user?.name ?? "Невідомий користувач"}
                </Text>
                <Text className="text-base text-gray-600 mb-6">
                    {user?.email ?? "Email відсутній"}
                </Text>

                {user?.roles?.length ? (
                    <View className="flex-row flex-wrap justify-center mb-6">
                        {user.roles.map((role) => (
                            <View
                                key={role}
                                className="px-3 py-1 m-1 rounded-full bg-gray-200"
                            >
                                <Text className="text-sm text-gray-800">
                                    {role}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : null}

                <CustomButton
                    title="Вийти"
                    handlePress={handleLogout}
                    containerStyles="w-full bg-red-600 rounded-xl"
                />
            </View>
        </SafeAreaView>
    );
};

export default ProfileScreen;

