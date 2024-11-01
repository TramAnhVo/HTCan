import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Api, { endpoints } from '../configs/Api';
import MyContext from '../configs/MyContext';

const FromDateCustomer = () => {
    const [fromDateVisible, setFromDateVisible] = useState(false)
    const [toDateVisible, setToDateVisible] = useState(false)
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const navigation = useNavigation();

    const [selectedCategory, setSelectedCategory] = useState(null);

    // bo gia tri cho combobox can
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    // bo gia tri cho combobox khach hang
    const [valueItem, setValueItem] = useState(null);
    const [isFocusItem, setIsFocusItem] = useState(false);

    const [user, dispatch] = useContext(MyContext);
    const [scales, setScales] = useState(null)
    const [customers, setCustomers] = useState([]);
    const [data, setData] = useState([])

    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageItem, setErrorMessageItem] = useState('')

    // quet cac can theo user
    useEffect(() => {
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

        loadScales();
    }, [])

    // quet ten khach hang theo id can 
    useEffect(() => {
        const loadCustomer = async () => {
            if (value) {
                try {
                    const response = await Api.get(endpoints['weightUser'](value));
                    const data = response.data;

                    // Extract unique customer codes and names
                    const uniqueCustomers = Array.from(
                        new Map(data.map(item => [item.CustCode, item.CustName])).entries()
                    ).map(([CustCode, CustName]) => ({ CustCode, CustName }));

                    setCustomers(uniqueCustomers);
                } catch (error) {
                    console.error('Error fetching customer data:', error);
                }
            }
        };

        loadCustomer();
    }, [value])

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

    // nut tim kiem
    const handleConfirm = () => {
        const yearFrom = fromDate.getFullYear();
        const monthFrom = fromDate.getMonth() + 1;
        const dayFrom = fromDate.getDate();

        const yearTo = toDate.getFullYear();
        const monthTo = toDate.getMonth() + 1;
        const dayTo = toDate.getDate();

        if (value === null && valueItem === null) {
            setErrorMessage('Bạn phải chọn cân!')
            setErrorMessageItem('Bạn phải chọn khách hàng!')
        }
        else {
            if (value !== null && valueItem === null) {
                setErrorMessageItem('Bạn phải chọn khách hàng!')
            }
            else {
                if (value === null && valueItem !== null) {
                    setErrorMessage('Bạn phải chọn cân!')
                }
                else {
                    navigation.navigate('SearchCustomer', { yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, value, valueItem });
                }
            }
        }
    };

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
                <Text style={{ fontSize: 15, marginRight: 15, fontWeight: '700' }}>Từ ngày:</Text>
                <Text style={{ borderWidth: 1, padding: 6, borderRadius: 8, fontSize: 15, marginRight: 8, width: 120, height: 35, textAlign: 'center', marginLeft: '8%' }}>
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
                <Text style={{ fontSize: 15, marginRight: 5, fontWeight: '700' }}>Đến ngày:</Text>
                <Text style={{ borderWidth: 1, padding: 6, borderRadius: 8, fontSize: 15, marginRight: 8, width: 120, height: 35, textAlign: 'center', marginLeft: '8%' }}>
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
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontSize: 15, marginRight: 5, fontWeight: '700' }}>Chọn cân:</Text>
                    <View style={{ marginLeft: '9%', width: '60%' }}>
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
                            }}
                        />
                    </View>
                </View>

                {errorMessage ?

                    <Text style={{ color: 'red', fontSize: 14, textAlign: 'center', marginTop: 2, marginLeft: '10%' }}>{errorMessage}</Text> : null}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontSize: 15, marginRight: 5, fontWeight: '700' }}>Khách hàng:</Text>
                    <View style={{ marginLeft: '3%', width: '60%' }}>
                        <Dropdown
                            style={[styles.dropdown, isFocusItem && { borderColor: 'blue' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={customers}
                            search
                            maxHeight={300}
                            labelField="CustName"
                            valueField="CustCode"
                            placeholder={!isFocusItem ? 'Khách hàng' : '...'}
                            searchPlaceholder="Tìm kiếm..."
                            value={valueItem}
                            onFocus={() => setIsFocusItem(true)}
                            onBlur={() => setIsFocusItem(false)}
                            onChange={item => {
                                setValueItem(item.CustCode);
                                setIsFocusItem(false);
                            }}
                        />
                    </View>
                </View>

                {errorMessageItem ?
                    <Text style={{ color: 'red', fontSize: 14, textAlign: 'center', marginTop: 2, marginLeft: '30%' }}>{errorMessageItem}</Text> : null}

                <TouchableOpacity style={styles.SreachButton} onPress={handleConfirm}>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 16, fontWeight: '700' }}>Tìm kiếm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FromDateCustomer;

const styles = StyleSheet.create({
    SreachButton: {
        backgroundColor: '#0099FF',
        height: 36,
        padding: 5,
        borderRadius: 10,
        width: '40%',
        marginTop: 10,
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
        borderColor: 'black',
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
})