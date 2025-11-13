import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Stack, useRootNavigationState, useRouter, useSegments} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";

import {useColorScheme} from '@/hooks/use-color-scheme';
import {store, useAppDispatch, useAppSelector} from "@/store";
import {Provider} from "react-redux";
import {useEffect, useState} from "react";
import {login} from "@/store/authSlice";
import {getSecureStore} from "@/utils/secureStore";

const RootNavigator = () => {
    const router = useRouter();
    const segments = useSegments();
    const navigationState = useRootNavigationState();
    const dispatch = useAppDispatch();
    const {user} = useAppSelector((state) => state.auth);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const restoreAuthState = async () => {
            try {
                const storedToken = await getSecureStore("token");
                if (storedToken) {
                    dispatch(login(storedToken));
                }
            } finally {
                if (isMounted) {
                    setIsAuthChecked(true);
                }
            }
        };

        restoreAuthState();

        return () => {
            isMounted = false;
        };
    }, [dispatch]);

    useEffect(() => {
        if (!navigationState?.key || !isAuthChecked) {
            return;
        }

        const inAuthGroup = segments[0] === "(auth)";

        if (!user && !inAuthGroup) {
            router.replace("/(auth)");
        } else if (user && inAuthGroup) {
            router.replace("/(tabs)/profile");
        }
    }, [user, segments, router, navigationState?.key, isAuthChecked]);

    return (
        <Stack>
            <Stack.Screen name="(auth)" options={{headerShown: false}}/>
            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            <Stack.Screen name={"+not-found"} options={{headerShown: false}} />
        </Stack>
    );
};

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <Provider store={store}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <RootNavigator />
                <StatusBar style="auto"/>
            </ThemeProvider>
        </Provider>

    );
}
