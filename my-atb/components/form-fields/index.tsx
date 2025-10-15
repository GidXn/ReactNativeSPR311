import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, TextInputProps } from 'react-native'
import icons from '../../constants/icons'
import { FormFieldRule, validate } from '@/utils/validations'

interface FormFieldProps extends TextInputProps {
    title: string
    value: string
    placeholder: string
    handleChangeText: (text: string) => void
    otherStyles?: string
    rules?: FormFieldRule[],
    onValidationChange?: (isValid: boolean, key: string) => void;
}

const FormField: React.FC<FormFieldProps> = ({
                                                 title,
                                                 rules,
                                                 value,
                                                 placeholder,
                                                 handleChangeText,
                                                 onValidationChange,
                                                 otherStyles = '',
                                                 ...props }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    useEffect(()=>{
        validateField(value)
    }, [rules])

    const onTextChange = (e: string) => {
        handleChangeText(e);
        validateField(e);
    }

    const validateField =(value:string) =>{
        const error: string | undefined = validate(value, rules);
        if (onValidationChange) {
            onValidationChange(!error, title);
        }
        setErrorMessage(error)
    }

    return (
        <View className={`h-16 w-full my-5 ${otherStyles}`}>
            <Text className="text-base text-gray-600 font-pmedium">{title}</Text>
            <View className={`w-full h-full px-4 bg-gray-100 rounded-xl border-2 ${errorMessage ? 'border-red-500' : 'border-gray-300'}  focus:border-secondary flex flex-row items-center`}>
                <TextInput
                    className="flex-1 text-slate-500 font-psemibold text-base"
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#7B7B8B"
                    onChangeText={(e) => onTextChange(e)}
                    secureTextEntry={title.toLowerCase().includes('пароль') && !showPassword}
                    {...props}
                />

                {title.toLowerCase().includes('пароль') && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image source={!showPassword ? icons.eye : icons.eyeHide} className="w-6 h-6" resizeMode="contain" />
                    </TouchableOpacity>
                )}
            </View>
            {errorMessage && <Text className=' text-red-700 text-sm'>{errorMessage}</Text>}
        </View>
    )
}

export default FormField