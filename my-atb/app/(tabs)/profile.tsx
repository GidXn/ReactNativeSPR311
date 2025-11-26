import {Dimensions, SafeAreaView, ScrollView, Text, View, Image} from "react-native";
import {useProfileQuery} from "@/services/apiAccount";
import {BASE_URL} from "@/constants/Urls";

const ProfileScreen = () => {
    //Автоматично посилає запит на сервер
    const {data: userProfile} = useProfileQuery();

    console.log("ProfileScreen", userProfile);
    return (
        <>
            <SafeAreaView className="bg-primary h-full">
                <ScrollView>
                    <View
                        className="w-full gap-2 flex justify-center items-center h-full px-4 my-6"
                        style={{ minHeight: Dimensions.get('window').height - 100 }}
                    >
                        <View className="flex flex-row items-center justify-center">
                            <Text className="mt-2 text-4xl font-pbold font-bold text-secondary">АТБ</Text>
                        </View>

                        {/* ====== БЛОК ІНФОРМАЦІЇ ПРО КОРИСТУВАЧА ====== */}
                        {userProfile && (
                            <View className="mt-6 bg-white rounded-2xl px-6 py-4 w-full shadow">

                                {/* Фото */}
                                {userProfile.image ? (
                                    <Image
                                        source={{ uri: `${BASE_URL}/images/200_${userProfile.image}` }}
                                        className="w-24 h-24 rounded-full self-center mb-4"
                                    />
                                ) : (
                                    <View className="w-24 h-24 rounded-full bg-slate-300 self-center mb-4" />
                                )}

                                {/* Ім'я */}
                                <Text className="text-xl font-bold text-center">
                                    {userProfile.fullName}
                                </Text>

                                {/* Email */}
                                <Text className="text-base text-center text-gray-600 mt-1">
                                    {userProfile.email}
                                </Text>

                                {/* Дата реєстрації */}
                                <Text className="text-base text-gray-800 mt-4">
                                    📅 Дата реєстрації: {userProfile.dateRegister}
                                </Text>

                                {/* Ролі */}
                                <Text className="text-base text-gray-800 mt-2">
                                    👤 Ролі: {userProfile.roles.join(', ')}
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>

        </>
    )
}

export default ProfileScreen;