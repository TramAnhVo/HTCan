import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Example = () => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const navigation = useNavigation();

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        const dateTimeString = date;
        const dateTime = new Date(dateTimeString);
        
        const year = dateTime.getFullYear();
        const month = dateTime.getMonth() + 1;
        const day = dateTime.getDate();

        hideDatePicker();
        navigation.navigate('ScalesSreachOfDay', {  "day": day, "month": month, "year": year });
    };

    return (
        <View>
            <TouchableOpacity onPress={showDatePicker} >
                <FontAwesome name="calendar" size={30} color="black" />
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    );
};

export default Example;