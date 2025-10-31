import { Animated, Dimensions, Image, KeyboardAvoidingView, Platform, SafeAreaView, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ScrollView = Animated.ScrollView;
import images from '@/constants/images';
import { useEffect, useState } from 'react';
import { api } from '@/utils/api';

const MOCK_USER = {
  fullName: 'Іван Петренко',
  email: 'ivan.petrenko@example.com',
  phone: '+380 67 123 45 67',
  city: 'Київ',
};

type ProfileModel = {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  image?: string;
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState<ProfileModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/Account/Me');
        setProfile(res.data);
      } catch (e) {
        console.log('Load profile error', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
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

              {loading ? (
                <ActivityIndicator size="large" />
              ) : (
                <Image
                  source={profile?.image ? { uri: `http://10.0.2.2:5165/${profile.image}` } : images.noimage}
                  className="w-32 h-32 rounded-full mb-6"
                  resizeMode="cover"
                />
              )}

              <View className="w-full gap-4">
                <View className="bg-white rounded-xl p-4 shadow">
                  <Text className="text-gray-500">ПІБ</Text>
                  <Text className="text-lg font-semibold text-black">
                    {profile ? `${profile.lastName ?? ''} ${profile.firstName ?? ''}`.trim() : ''}
                  </Text>
                </View>

                <View className="bg-white rounded-xl p-4 shadow">
                  <Text className="text-gray-500">Email</Text>
                  <Text className="text-lg font-semibold text-black">{profile?.email ?? ''}</Text>
                </View>

                <View className="bg-white rounded-xl p-4 shadow">
                  <Text className="text-gray-500">Телефон</Text>
                  <Text className="text-lg font-semibold text-black">{profile?.phoneNumber ?? ''}</Text>
                </View>

                {/* Місто відсутнє у моделі - залишено для майбутнього */}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


