import { Tabs } from 'expo-router';
import React, {useMemo} from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {useAppSelector} from "@/store";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {user} = useAppSelector(state => state.auth);
  const isAdmin = useMemo(() => user?.roles?.includes("Admin") ?? false, [user?.roles]);

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
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профіль',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle.fill" color={color} />,
        }}
      />
      {isAdmin && (
        <Tabs.Screen
          name="users"
          options={{
            title: 'Користувачі',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3.fill" color={color} />,
          }}
        />
      )}
    </Tabs>
  );
}
