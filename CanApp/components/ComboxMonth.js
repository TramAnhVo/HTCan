import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
    { label: 'Tháng 1', value: '1' },
    { label: 'Tháng 2', value: '2' },
    { label: 'Tháng 3', value: '3' },
    { label: 'Tháng 4', value: '4' },
    { label: 'Tháng 5', value: '5' },
    { label: 'Tháng 6', value: '6' },
    { label: 'Tháng 7', value: '7' },
    { label: 'Tháng 8', value: '8' },
    { label: 'Tháng 9', value: '9' },
    { label: 'Tháng 10', value: '10' },
    { label: 'Tháng 11', value: '11' },
    { label: 'Tháng 12', value: '12' },
];

const ComboxMonth = () => {
    const [value, setValue] = useState(null);
    const [month, setMonth] = useState(null)
    const [year, setYear] = useState(null)
    const [isFocus, setIsFocus] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const navigation = useNavigation();

    const selectConfirm = (value) => {
        setMonth(value)
    }

    const handleInputChange = (text) => {
        // Chỉ cho phép nhập số
        const numericValue = text.replace(/[^0-9]/g, '');
        // Giới hạn độ dài thành 4 chữ số
        const truncatedValue = numericValue.substring(0, 4);

        setInputValue(truncatedValue);
        if (truncatedValue.length === 4) {
            handleConfirm(truncatedValue);
        }
    };

    const handleConfirm = (value) => {
        setYear(value)
    }

    const Confirm = () => {
        navigation.navigate("SearchMonthYear", {year, month})
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <Text style={{ fontSize: 17, marginRight: 5 }}>Tháng</Text>
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
                        placeholder={!isFocus ? 'Tháng' : '...'}
                        searchPlaceholder="Tìm kiếm..."
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setValue(item.value);
                            setIsFocus(false);
                            selectConfirm(item.value);
                        }}
                    />
                </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                <Text style={{ fontSize: 17, marginRight: 15 }}>Năm</Text>
                <TextInput style={styles.InputYear}
                    value={inputValue}
                    placeholder="Nhập năm"
                    onChangeText={handleInputChange}
                    keyboardType="numeric"
                    maxLength={4} />

                <TouchableOpacity style={styles.SreachButton} onPress={Confirm}>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '700' }}>Tìm</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
};

export default ComboxMonth;

const styles = StyleSheet.create({
    container: {
        width: '40%',
        marginLeft: 10,
    },

    dropdown: {
        backgroundColor: 'white',
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
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

    InputYear: {
        borderWidth: 1,
        backgroundColor: 'white',
        borderColor: 'gray',
        borderRadius: 8,
        fontSize: 16,
        padding: 5,
        width: '40%',
        marginLeft: 10
    },

    SreachButton: {
        backgroundColor: '#0099FF',
        padding: 10,
        borderRadius: 20,
        width: '30%',
        marginLeft: '10%'
    }
});