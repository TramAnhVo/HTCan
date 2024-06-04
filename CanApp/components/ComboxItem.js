import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
    { label: 'Ngày hôm qua', value: '1' },
    { label: '2 ngày trước', value: '2' },
    { label: '3 ngày trước', value: '3' },
    { label: '4 ngày trước', value: '4' },
    { label: '5 ngày trước', value: '5' },
    { label: '6 ngày trước', value: '6' },
    { label: '7 ngày trước', value: '7' },
    { label: '8 ngày trước', value: '8' },
    { label: '9 ngày trước', value: '9' },
    { label: '10 ngày trước', value: '10' },
];

const ComboxItem = () => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const navigation = useNavigation();

    const handleConfirm = (value) => {
        const time = value
        navigation.navigate('SearchTime', {time});
    }

    return (
        <View style={styles.container}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Mốc thời gian' : '...'}
                searchPlaceholder="Tìm kiếm..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.value);
                    setIsFocus(false);
                    handleConfirm(item.value);
                }}
            />
        </View>
    );
};

export default ComboxItem;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        width: '55%'
    },
    dropdown: {
        backgroundColor: 'white',
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        borderColor: 'blue'
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        paddingBottom: 5,
        color: 'blue'
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});