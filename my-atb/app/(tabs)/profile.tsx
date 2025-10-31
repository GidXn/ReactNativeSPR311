import { Animated, Dimensions, Image, KeyboardAvoidingView, Platform, SafeAreaView, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ScrollView = Animated.ScrollView;
import images from '@/constants/images';

const MOCK_USER = {
  fullName: 'Іван Петренко',
  email: 'ivan.petrenko@example.com',
  phone: '+380 67 123 45 67',
  city: 'Київ',
};

export default function ProfileScreen() {
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
            <View
              className="w-full flex items-center my-6"
              style={{ minHeight: Dimensions.get('window').height - 100 }}
            >
              <Text className="text-3xl font-bold mb-6 text-black">Профіль</Text>

              <Image
                source={images.noimage}
                className="w-32 h-32 rounded-full mb-6"
                resizeMode="cover"
              />

              <View className="w-full gap-4">
                <View className="bg-white rounded-xl p-4 shadow">
                  <Text className="text-gray-500">ПІБ</Text>
                  <Text className="text-lg font-semibold text-black">{MOCK_USER.fullName}</Text>
                </View>

                <View className="bg-white rounded-xl p-4 shadow">
                  <Text className="text-gray-500">Email</Text>
                  <Text className="text-lg font-semibold text-black">{MOCK_USER.email}</Text>
                </View>

                <View className="bg-white rounded-xl p-4 shadow">
                  <Text className="text-gray-500">Телефон</Text>
                  <Text className="text-lg font-semibold text-black">{MOCK_USER.phone}</Text>
                </View>

                <View className="bg-white rounded-xl p-4 shadow">
                  <Text className="text-gray-500">Місто</Text>
                  <Text className="text-lg font-semibold text-black">{MOCK_USER.city}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


