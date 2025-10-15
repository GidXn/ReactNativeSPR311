import { useColorScheme } from '@/hooks/use-color-scheme';
import {Tabs} from "expo-router";
import {Colors} from "@/constants/theme";
import {HapticTab} from "@/components/haptic-tab";
// import {IconSymbol} from "@/components/ui/icon-symbol";
import React from "react";
// import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

const AuthLayout = () => {

    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Вхід',
                    tabBarIcon: ({ color }) => <AntDesign name="login" size={28} color={color} />,
                }}
            />

            <Tabs.Screen
                name="sign-up"
                options={{
                    title: 'Реєстрація',
                    tabBarIcon: ({ color }) => <AntDesign name="logout" size={28} color={color} />,
                }}
            />

        </Tabs>
    );
}

export default AuthLayout;