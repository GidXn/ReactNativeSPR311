import {Dimensions, SafeAreaView, ScrollView, Text, View} from "react-native";
import { useState } from "react";
import FormField from "@/components/form-fields";
import CustomButton from "@/components/custom-button";
import { API_URL } from "@/constants/api";
import { showMessage } from "react-native-flash-message";

const SignIn = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const validationChange = (isValid: boolean, fieldKey: string) => {
        if (isValid && errors.includes(fieldKey)) {
            setErrors(errors.filter(x => x !== fieldKey))
        } else if (!isValid && !errors.includes(fieldKey)) {
            setErrors(state => [...state, fieldKey])
        }
    };

    const submit = async () => {
        if (!email || !password || errors.length !== 0) {
            showMessage({ message: "Правильно заповніть всі поля", type: "info" });
            return;
        }
        try {
            setSubmitting(true);
            const res = await fetch(`${API_URL}/api/Account/Login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Login failed');
            }
            const data = await res.json();
            showMessage({ message: "Успішний вхід", type: "success" });
            // TODO: збереження токена data.Token у сховищі, навігація далі
            // Наприклад: await SecureStore.setItemAsync('token', data.Token)
        } catch (e: any) {
            showMessage({ message: e?.message || "Помилка авторизації", type: "danger" });
        } finally {
            setSubmitting(false);
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

                    <FormField
                        placeholder="Вкажіть пошту"
                        title="Електронна пошта"
                        value={email}
                        handleChangeText={(e) => setEmail(e)}
                        keyboardType="email-address"
                        rules={[
                            { rule: 'required', message: "Пошта є обов'язкова" },
                            { rule: 'regexp', value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', message: "Пошта є некоректна" },
                        ]}
                        onValidationChange={validationChange}
                    />

                    <FormField
                        placeholder="Вкажіть пароль"
                        title="Пароль"
                        value={password}
                        handleChangeText={(e) => setPassword(e)}
                        rules={[
                            { rule: 'required', message: 'Пароль є обов\'язковим' },
                            { rule: 'min', value: 6, message: 'Пароль має містити мін 6 символів' },
                        ]}
                        onValidationChange={validationChange}
                    />

                    <CustomButton
                        title={submitting ? "Вхід..." : "Увійти"}
                        handlePress={submit}
                        containerStyles="mt-7 w-full bg-slate-500 rounded-xl"
                        isLoading={submitting}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SignIn;