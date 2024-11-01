import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Api, { endpoints } from '../configs/Api';
import MyContext from '../configs/MyContext';

const FromDate = () => {
    const [fromDateVisible, setFromDateVisible] = useState(false)
    const [toDateVisible, setToDateVisible] = useState(false)

    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const navigation = useNavigation();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isHiddenCategory, setIsHiddenCategory] = useState(true)

    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [month, setMonth] = useState(null)

    const [user, dispatch] = useContext(MyContext);
    const [scales, setScales] = useState(null)
    const [data, setData] = useState([])
    const [errorMessage, setErrorMessage] = useState('');

    const loadScales = async () => {
        try {
            let res = await Api.get(endpoints['scale'](user.id));
            setScales(res.data);

            if (res.data && Array.isArray(res.data)) {
                setScales(res.data);

                // Chuyển đổi dữ liệu vào định dạng cho Dropdown
                const options = res.data.map(item => ({
                    ScaleName: item.ScaleName,
                    id: item.id
                }));
                setData(options);
            }
        } catch (ex) {
            console.error(ex);
        }
    }

    useEffect(() => {
        loadScales();
    }, [])

    const showFromDate = () => {
        setFromDateVisible(true);
    };

    const showToDate = () => {
        setToDateVisible(true);
    };

    const hideFromDate = () => {
        setFromDateVisible(false);
    };

    const hideToDate = () => {
        setToDateVisible(false);
    };

    const handleOptionCategory = (option) => {
        if (selectedCategory !== option) {
            setSelectedCategory(option);
            setIsHiddenCategory(false);
        } else {
            setSelectedCategory(null);
            setIsHiddenCategory(true);
        }
    };

    const handleConfirm = () => {
        const yearFrom = fromDate.getFullYear();
        const monthFrom = fromDate.getMonth() + 1;
        const dayFrom = fromDate.getDate();

        const yearTo = toDate.getFullYear();
        const monthTo = toDate.getMonth() + 1;
        const dayTo = toDate.getDate();

        if (value === null) {
            setErrorMessage('Bạn phải chọn cân')
        }
        else {
            if (selectedCategory == 'option1')
                navigation.navigate('GeneralCustomer', { yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo , value });
            else if (selectedCategory == 'option2')
                navigation.navigate('GeneralProduct', { yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, value  });
            else if (selectedCategory == 'option3')
                navigation.navigate('GeneralDate', { yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, value });
        }
    };

    const selectConfirm = (value) => {
        setMonth(value)
    }

    const handleConfirmFromDate = (date) => {
        setFromDate(date);
        hideFromDate();
    };

    const handleConfirmToDate = (date) => {
        setToDate(date);
        hideToDate();
    };

    return (
        <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <Text style={{ fontSize: 15, marginRight: 15 }}>Từ ngày:</Text>
                <Text style={{ borderWidth: 1, padding: 6, borderRadius: 8, fontSize: 15, marginRight: 8, width: 120, height: 35, textAlign: 'center', marginLeft: '2%' }}>
                    {fromDate.getDate().toString().padStart(2, '0')}-{(fromDate.getMonth() + 1).toString().padStart(2, '0')}-{fromDate.getFullYear()}
                </Text>

                <TouchableOpacity onPress={showFromDate} >
                    <FontAwesome name="calendar" size={24} color="black" />
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={fromDateVisible}
                    mode="date"
                    onConfirm={handleConfirmFromDate}
                    onCancel={hideFromDate}
                />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontSize: 15, marginRight: 5 }}>Đến ngày:</Text>
                    <Text style={{ borderWidth: 1, padding: 6, borderRadius: 8, fontSize: 15, marginRight: 8, width: 120, height: 35, textAlign: 'center', marginLeft: '2%' }}>
                        {toDate.getDate().toString().padStart(2, '0')}-{(toDate.getMonth() + 1).toString().padStart(2, '0')}-{toDate.getFullYear()}
                    </Text>

                    <TouchableOpacity onPress={showToDate} >
                        <FontAwesome name="calendar" size={24} color="black" />
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={toDateVisible}
                        mode="date"
                        onConfirm={handleConfirmToDate}
                        onCancel={hideToDate}
                    />
                </View>

            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
                    <Text style={{ fontSize: 15, marginRight: 5 }}>Chọn cân:</Text>
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
                            labelField="ScaleName"
                            valueField="id"
                            placeholder={!isFocus ? 'Cân' : '...'}
                            searchPlaceholder="Tìm kiếm..."
                            value={value}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setValue(item.id);
                                setIsFocus(false);
                                selectConfirm(item.id);
                            }}
                        />
                    </View>
                </View>

                {errorMessage ?
                    <Text style={{ color: 'red', fontSize: 14, textAlign: 'center', marginTop: 2 }}>{errorMessage}</Text>: null}

                <View style={{ marginTop: 10, width: '100%' }}>
                    <TouchableOpacity onPress={() => handleOptionCategory('option1')} style={styles.ItemChild}>
                        <Text style={{ fontSize: 14 }}>Nhóm khách hàng</Text>
                        {selectedCategory === 'option1' ? (
                            <MaterialCommunityIcons name="circle-slice-8" size={22} color="black" />
                        ) : (
                            <MaterialCommunityIcons name="circle-outline" size={22} color="black" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleOptionCategory('option2')} style={styles.ItemChild}>
                        <Text style={{ fontSize: 14 }}>Nhóm hàng hóa</Text>
                        {selectedCategory === 'option2' ? (
                            <MaterialCommunityIcons name="circle-slice-8" size={22} color="black" />
                        ) : (
                            <MaterialCommunityIcons name="circle-outline" size={22} color="black" />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleOptionCategory('option3')} style={styles.ItemChild}>
                        <Text style={{ fontSize: 14 }}>Tổng hợp (khách hàng + hàng hóa)</Text>
                        {selectedCategory === 'option3' ? (
                            <MaterialCommunityIcons name="circle-slice-8" size={22} color="black" />
                        ) : (
                            <MaterialCommunityIcons name="circle-outline" size={22} color="black" />
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.SreachButton} onPress={handleConfirm}>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 15, fontWeight: '700' }}>Tìm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FromDate;

const styles = StyleSheet.create({
    SreachButton: {
        backgroundColor: '#0099FF',
        height: 35,
        padding: 5,
        borderRadius: 10,
        width: '40%',
        marginTop: 14,
        alignSelf: 'flex-end'
    },

    ItemChild: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5
    },

    dropdown: {
        backgroundColor: 'white',
        height: 35,
        borderColor: 'gray',
        borderWidth: 1,
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
        fontSize: 14,
    },

    selectedTextStyle: {
        fontSize: 14,
    },

    iconStyle: {
        width: 20,
        height: 20,
    },

    inputSearchStyle: {
        height: 40,
        fontSize: 14,
    },

    container: {
        width: '50%',
        marginLeft: 5,
    },
})