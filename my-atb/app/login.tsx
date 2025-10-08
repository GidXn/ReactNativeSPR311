import {useState} from 'react';
import {Animated, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ScrollView = Animated.ScrollView;

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = () => {
        console.log('Login attempt with:', { email, password });
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
                        <View className="w-full flex justify-center my-6" style={{ minHeight: 400 }}>
                            <Text className="text-3xl font-bold mb-6 text-black">Вхід</Text>

                            <View className="mb-4">
                                <Text className="mb-2 text-black">Email</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="you@example.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="border border-gray-300 rounded-md px-3 py-2 text-black"
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="mb-2 text-black">Пароль</Text>
                                <TextInput
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    secureTextEntry
                                    className="border border-gray-300 rounded-md px-3 py-2 text-black"
                                />
                            </View>

                            <TouchableOpacity
                                onPress={onSubmit}
                                className="bg-blue-700 rounded-lg px-5 py-3"
                            >
                                <Text className="text-white font-bold text-lg text-center">Увійти</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}


