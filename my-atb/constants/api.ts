import { Platform } from "react-native";

const LOCAL_PORT = 5165;

export const getBaseUrl = (): string => {
    if (Platform.OS === 'android') {
        return `http://10.0.2.2:${LOCAL_PORT}`;
    }
    return `http://localhost:${LOCAL_PORT}`;
};

export const API_URL = `${getBaseUrl()}`;


