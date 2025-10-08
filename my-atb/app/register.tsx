import {useMemo, useState} from 'react';
import {Animated, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Image} from 'expo-image';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ScrollView = Animated.ScrollView;

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

export default function RegisterScreen() {
    const [form, setForm] = useState<RegisterForm>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<RegisterErrors>({});
    const [selectedAsset, setSelectedAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const isValidEmail = (value: string) => {
        // Basic email check is sufficient for client-side validation
        return /.+@.+\..+/.test(value.trim());
    };

    const validate = useMemo(() => {
        return (values: RegisterForm): RegisterErrors => {
            const nextErrors: RegisterErrors = {};
            if (!values.name.trim()) {
                nextErrors.name = 'Імʼя є обовʼязковим';
            }
            if (!values.email.trim()) {
                nextErrors.email = 'Email є обовʼязковим';
            } else if (!isValidEmail(values.email)) {
                nextErrors.email = 'Некоректний email';
            }
            if (!values.password) {
                nextErrors.password = 'Пароль є обовʼязковим';
            } else if (values.password.length < 6) {
                nextErrors.password = 'Мінімум 6 символів';
            }
            if (!values.confirmPassword) {
                nextErrors.confirmPassword = 'Підтвердіть пароль';
            } else if (values.confirmPassword !== values.password) {
                nextErrors.confirmPassword = 'Паролі не співпадають';
            }
            return nextErrors;
        };
    }, []);

    const updateField = (key: keyof RegisterForm, value: string) => {
        setForm((prev: RegisterForm) => ({ ...prev, [key]: value }));
    };

    const onSubmit = () => {
        const nextErrors = validate(form);
        setErrors(nextErrors);
        const hasErrors = Object.keys(nextErrors).length > 0;
        if (!hasErrors) {
            console.log('Registration attempt with:', {
                ...form,
                selectedFile: selectedAsset
                    ? {
                        uri: selectedAsset.uri,
                        fileName: (selectedAsset as any).fileName ?? undefined,
                        mimeType: selectedAsset.mimeType,
                        width: selectedAsset.width,
                        height: selectedAsset.height,
                        fileSize: (selectedAsset as any).fileSize ?? undefined,
                    }
                    : null,
            });
        }
    };

    const onPickFile = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            setSelectedAsset(null);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setSelectedAsset(result.assets[0]);
        }
    };

    const renderError = (key: keyof RegisterForm) => {
        const message = errors[key];
        if (!message) return null;
        return <Text className="text-red-600 mt-1">{message}</Text>;
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="w-full flex justify-center my-6" style={{ minHeight: 500 }}>
                            <Text className="text-3xl font-bold mb-6 text-black">Реєстрація</Text>

                            <View className="mb-4">
                                <Text className="mb-2 text-black">Імʼя</Text>
                                <TextInput
                                    value={form.name}
                                    onChangeText={(v) => updateField('name', v)}
                                    placeholder="Ваше імʼя"
                                    className="border border-gray-300 rounded-md px-3 py-2 text-black"
                                />
                                {renderError('name')}
                            </View>

                            <View className="mb-4">
                                <Text className="mb-2 text-black">Email</Text>
                                <TextInput
                                    value={form.email}
                                    onChangeText={(v) => updateField('email', v)}
                                    placeholder="you@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="border border-gray-300 rounded-md px-3 py-2 text-black"
                                />
                                {renderError('email')}
                            </View>

                            <View className="mb-4">
                                <Text className="mb-2 text-black">Пароль</Text>
                                <TextInput
                                    value={form.password}
                                    onChangeText={(v) => updateField('password', v)}
                                    placeholder="••••••••"
                                    secureTextEntry
                                    className="border border-gray-300 rounded-md px-3 py-2 text-black"
                                />
                                {renderError('password')}
                            </View>

                            <View className="mb-6">
                                <Text className="mb-2 text-black">Підтвердження пароля</Text>
                                <TextInput
                                    value={form.confirmPassword}
                                    onChangeText={(v) => updateField('confirmPassword', v)}
                                    placeholder="••••••••"
                                    secureTextEntry
                                    className="border border-gray-300 rounded-md px-3 py-2 text-black"
                                />
                                {renderError('confirmPassword')}
                            </View>

                            <TouchableOpacity
                                onPress={onSubmit}
                                className="bg-blue-700 rounded-lg px-5 py-3"
                            >
                                <Text className="text-white font-bold text-lg text-center">Зареєструватися</Text>
                            </TouchableOpacity>

                            <View className="mt-4" />

                            <TouchableOpacity
                                onPress={onPickFile}
                                className="bg-gray-800 rounded-lg px-5 py-3"
                            >
                                <Text className="text-white font-bold text-lg text-center">Обрати файл з галереї</Text>
                            </TouchableOpacity>

                            {selectedAsset?.uri ? (
                                <View className="mt-4 items-center">
                                    <Image
                                        source={{ uri: selectedAsset.uri }}
                                        style={{ width: 120, height: 120, borderRadius: 8 }}
                                    />
                                    <Text className="text-black mt-2 text-center" numberOfLines={1}>
                                        {(selectedAsset as any).fileName ?? selectedAsset.uri}
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}


