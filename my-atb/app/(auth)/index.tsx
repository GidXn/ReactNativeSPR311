import {Dimensions, SafeAreaView, ScrollView, Text, View} from "react-native";
import {ILoginRequest} from "@/types/account/ILoginRequest";
import { useState} from "react";
import {useRouter} from "expo-router";
import {showMessage} from "react-native-flash-message";
import {useLoginMutation} from "@/services/apiAccount";
import FormField from "@/components/form-fields";
import CustomButton from "@/components/custom-button";
import {login, logout} from "@/store/authSlice";
import {useAppDispatch, useAppSelector} from "@/store";


const SignIn = () => {
    const [loginPOST, {isLoading, error: loginError}] = useLoginMutation();

    const dispatch = useAppDispatch();

    const {user} = useAppSelector(globalState => globalState.auth);

    const initState: ILoginRequest = {
        email: '',
        password: ''
    };

    const [form, setForm] = useState<ILoginRequest>(initState);

    //Зберігає помилки
    const [errors, setErrors] = useState<string[]>([]);

    const router = useRouter();

    const validationChange = (isValid: boolean, fieldKey: string) => {
        if (isValid && errors.includes(fieldKey)) {
            setErrors(errors.filter(x => x !== fieldKey))
        } else if (!isValid && !errors.includes(fieldKey)) {
            setErrors(state => [...state, fieldKey])
        }
    };

    const submit = async () => {
        if (errors.length !== 0) {
            // console.error(errors);
            showMessage({
                message: "Правильно заповніть всі поля",
                type: "info",
            });
            return;
        }

        try {
            const result = await loginPOST(form);
            if (result.error) {
                console.error("Problema with login", result.error);
            } else {
                const {token} = result.data;
                dispatch(login(token));
                router.replace("/(tabs)");
            }
            //console.log("Submit form-- result",  result);
            //
        } catch (ex) {
            console.log("Submit form-- error", ex);
        }
    }

    const handleLogout = async () => {
        try {
            dispatch(logout());
        }
        catch (ex) {
            console.log("Logout error", ex);
        }
    }

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

                    {
                        user &&
                        <Text className="text-2xl font-semibold text-green-500 mt-10 font-psemibold">
                            {user?.name}
                        </Text>
                    }

                    {loginError &&
                        <View
                            className="p-4 w-full rounded-lg bg-red-50" >
                            <Text className=" text-center text-red-800 dark:bg-gray-800 dark:text-red-400 font-medium">
                                Дані вказано не вірно
                            </Text>
                        </View>
                    }


                    <FormField
                        placeholder="Вкажіть пошту"
                        title="Електронна пошта"
                        value={form.email}
                        handleChangeText={(e) => setForm({...form, email: e})}
                        keyboardType="email-address"
                        rules={[
                            // {
                            //     rule: 'required',
                            //     message: "Пошта є обов'язкова"
                            // },
                            // {
                            //     rule: 'regexp',
                            //     value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
                            //     message: "Пошта є некоректна"
                            // },
                        ]}
                        onValidationChange={validationChange}
                    />

                    <FormField
                        placeholder="Вкажіть пароль"
                        title="Пароль"

                        value={form.password}
                        handleChangeText={(e) => setForm({...form, password: e})}
                        onValidationChange={validationChange}
                        rules={[
                            // {
                            //     rule: 'required',
                            //     message: 'Пароль є обов\'язковим'
                            // }
                        ]}
                    />

                    { !user &&
                        <CustomButton title="Вхід" handlePress={submit}
                                      containerStyles="mt-7 w-full bg-slate-500 rounded-xl"/>
                    }


                    { user &&
                        <CustomButton title="Вихід" handlePress={handleLogout}
                                  containerStyles="mt-7 w-full bg-green-500 rounded-xl"/>
                    }

                    <CustomButton title="Реєстрація" handlePress={() => {
                        router.replace("/(auth)/sign-up")
                    }} containerStyles="mt-4 w-full bg-red-700 rounded-xl"/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SignIn;