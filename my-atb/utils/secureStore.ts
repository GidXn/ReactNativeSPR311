import * as SecureStore from 'expo-secure-store';

export const saveSecureStore = (key: string, value: string) => {
    SecureStore.setItem(key, value);
};

export const getSecureStore = (key: string) => {
    return  SecureStore.getItem(key);
};

export const deleteSecureStore = (key: string) => {
    SecureStore.deleteItemAsync(key);
};