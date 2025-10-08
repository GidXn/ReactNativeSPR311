import {Animated, Dimensions, KeyboardAvoidingView, Platform, SafeAreaView, Text, View} from 'react-native';

import {SafeAreaProvider} from "react-native-safe-area-context";
import ScrollView = Animated.ScrollView;

export default function TabTwoScreen() {
  return (
      <SafeAreaProvider>
          <SafeAreaView className="flex-1">
              <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  className="flex-1"
              >
                  <ScrollView
                      contentContainerStyle={{flexGrow: 1, paddingHorizontal: 20}}
                      keyboardShouldPersistTaps="handled"
                  >

                      <View
                          className="w-full flex justify-center items-center my-6"
                          style={{
                              minHeight: Dimensions.get("window").height - 100,
                          }}
                      >
                          <Text className={"text-3xl font-bold mb-6 text-black"}>
                              Детально
                          </Text>
                      </View>
                  </ScrollView>
              </KeyboardAvoidingView>
          </SafeAreaView>
      </SafeAreaProvider>
  );
}