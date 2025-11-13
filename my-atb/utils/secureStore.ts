import * as SecureStore from 'expo-secure-store';

export const saveSecureStore = async (key: string, value: string) => {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (error) {
        console.warn(`SecureStore: unable to save key "${key}"`, error);
    }
};

export const getSecureStore = async (key: string) => {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.warn(`SecureStore: unable to read key "${key}"`, error);
        return null;
    }
};

export const deleteSecureStore = async (key: string) => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.warn(`SecureStore: unable to delete key "${key}"`, error);
    }
};