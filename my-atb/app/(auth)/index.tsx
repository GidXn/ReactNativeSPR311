import {Dimensions, SafeAreaView, ScrollView, Text, View} from "react-native";

const SignIn = () => {
    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full gap-2 flex justify-center items-center h-full px-4 my-6"
                      style={{
                          minHeight: Dimensions.get('window').height - 100,
                      }}>
                    <View className="flex flex-row items-center justify-center">
                        {/* <Image source={images.pizzaLogo} className=" w-[40px] h-[34px]" resizeMode="contain" /> */}
                        <Text className="mt-2 text-4xl font-pbold font-bold text-secondary">АТБ</Text>

                    </View>
                    <Text className="text-2xl font-semibold text-slate-4Ad00 mt-10 font-psemibold">
                        Вхід у наш додаток
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SignIn;