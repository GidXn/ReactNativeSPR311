import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import React from 'react'

interface CustomButtonProps extends TouchableOpacityProps {
    title: string
    handlePress: () => void
    containerStyles?: string
    textStyles?: string
    isLoading?: boolean
    isDisabled?: boolean
}

const CustomButton: React.FC<CustomButtonProps> = ({
                                                       title,
                                                       handlePress,
                                                       containerStyles = '',
                                                       textStyles = '',
                                                       isLoading = false,
                                                       isDisabled = false,
                                                       ...props
                                                   }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`bg-secondary  min-h-[50px] flex flex-row justify-center items-center ${containerStyles} ${isLoading || isDisabled ? 'opacity-50' : '' }`}
            disabled={isLoading || isDisabled}
            {...props}>
            <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>{title}</Text>
            {isLoading && <ActivityIndicator animating={isLoading} color="#fff" size="small" className="ml-2" />}
        </TouchableOpacity>
    )
}

export default CustomButton