import {Dimensions, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image} from "react-native";
import {IUserCreate} from "@/models/account";
import {useState} from "react";
import images from "@/constants/images";
import FormField from "@/components/form-fields";
import CustomButton from "@/components/custom-button";
import {pickImage} from "@/utils/pickImage";
import {useRouter} from "expo-router";
import { showMessage } from "react-native-flash-message";
import {getFileFromUriAsync} from "@/utils/getFileFromUriAsync";
import axios from "axios";
import {serialize} from 'object-to-formdata';

const userInitState: IUserCreate = {
    email: '',
    firstName: '',
    imageUrl: '',
    lastName: '',
    password: ''
};


const SignUp = () => {
    //Зберігає дані користувача
    const [user, setUser] = useState<IUserCreate>(userInitState);
    //Зберігає помилки
    const [errors, setErrors] = useState<string[]>([]);
    const [confirmPassword, setConfirmPassword] = useState<string>('');

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
        if(user.imageUrl) {
            const fileImage =
                await getFileFromUriAsync(user.imageUrl);
            console.log("Submit form-- file",  fileImage);
            try {
                const model = {...user, imageFile: fileImage};
                // const url = "https://spr311.itstep.click/api/account/register";
                console.log("Submit form-- model",  model);
                const url = "http://10.0.2.2:5165/api/account/register";
                const formData = serialize(model)
                console.log("Submit form-- url",  url);
                await axios.post(url, formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
            }
            catch(ex) {
                console.log("Submit form-- error", ex);
            }

        }

        //console.log("Submit form", user);
    }


    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full gap-2 flex items-center h-full px-4 py-20"
                      style={{
                          minHeight: Dimensions.get('window').height - 100,
                      }}>

                    <TouchableOpacity
                        className=' mb-5 self-center mx-2 w-[200px] h-[200px] rounded-full overflow-hidden '
                        onPress={async () => setUser({ ...user, imageUrl: await pickImage() })}
                    >
                        <Image source={user.imageUrl ? {uri: user.imageUrl} : images.noimage}
                               className=" object-cover w-full h-full"/>
                    </TouchableOpacity>

                    <FormField
                        placeholder="Вкажіть прізвище"
                        title="Прізвище"
                        value={user.lastName}
                        handleChangeText={(e) => setUser({...user, lastName: e})}
                        onValidationChange={validationChange}
                        rules={[
                            {
                                rule: 'required',
                                message: "Прізвище є обов'язковим"
                            },
                            {
                                rule: 'min',
                                value: 2,
                                message: 'Прізвище має містити мінімум 2 символи'
                            },
                            {
                                rule: 'max',
                                value: 40,
                                message: 'Прізвище має містити максимум 40 символів'
                            }
                        ]}

                    />

                    <FormField
                        placeholder="Вкажіть ваше ім'я"
                        title="Ім'я"
                        value={user.firstName}
                        handleChangeText={(e) => setUser({...user, firstName: e})}
                        onValidationChange={validationChange}
                        rules={[
                            {
                                rule: 'required',
                                message: 'Ім\'я є обов\'язковим'
                            },
                            {
                                rule: 'min',
                                value: 2,
                                message: 'Ім\'я має містити мінімум 2 символи '
                            },
                            {
                                rule: 'max',
                                value: 40,
                                message: 'Ім\'я має містити максимум 40 символів '
                            }
                        ]}
                    />

                    <FormField
                        placeholder="Вкажіть пошту"
                        title="Електронна пошта"
                        value={user.email}
                        handleChangeText={(e) => setUser({...user, email: e})}
                        keyboardType="email-address"
                        rules={[
                            {
                                rule: 'required',
                                message: "Пошта є обов'язкова"
                            },
                            {
                                rule: 'regexp',
                                value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
                                message: "Пошта є некоректна"
                            },
                        ]}
                        onValidationChange={validationChange}
                    />

                    <FormField
                        placeholder="Вкажіть пароль"
                        title="Пароль"

                        value={user.password}
                        handleChangeText={(e) => setUser({...user, password: e})}
                        onValidationChange={validationChange}
                        rules={[
                            {
                                rule: 'required',
                                message: 'Пароль є обов\'язковим'
                            },
                            {
                                rule: 'regexp',
                                value: '[0-9]',
                                message: 'Пароль має містити цифри'
                            },
                            {
                                rule: 'regexp',
                                value: '[!@#$%^&*(),.?":{}|<>]',
                                message: 'Пароль має містити спец символи '
                            },
                            {
                                rule: 'min',
                                value: 6,
                                message: 'Пароль має містити мін 6 символів'
                            },
                            {
                                rule: 'max',
                                value: 40,
                                message: 'Максимальна довжина паролю 40 символів'
                            }

                        ]}
                    />

                    <FormField
                        placeholder="Повторити пароль"
                        title="Повторити пароль"
                        value={confirmPassword}
                        handleChangeText={(e) => setConfirmPassword(e)}
                        onValidationChange={validationChange}
                        rules={[
                            {
                                rule: 'required',
                                message: 'Вкажіть пароль'
                            },
                            {
                                rule: 'equals',
                                value: user.password,
                                message: 'Паролі не співпадають'
                            },

                        ]}
                    />

                    <CustomButton title="Register" handlePress={submit} containerStyles="mt-7 w-full bg-slate-500 rounded-xl" />

                    <CustomButton title="Login" handlePress={() => {router.replace("/(auth)")}} containerStyles="mt-4 w-full bg-red-700 rounded-xl" />

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SignUp;