import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as XLSX from 'xlsx';
import Api, { endpoints } from '../configs/Api';
import MyContext from '../configs/MyContext';

const dataMonth = [
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

const ExportXLSXDirectly = () => {
    const [weightMonth, setWeightMonth] = useState([])
    const [weightYear, setWeightYear] = useState([])
    const [data, setData] = useState([])
    const [user, dispatch] = useContext(MyContext);
    const [valueYear, setValueYear] = useState(null)

    // bo gia tri cho combobox can
    const [scales, setScales] = useState(null)
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    // bo gia tri cho combox thang
    const [month, setMonth] = useState(null)
    const [valueMonth, setValueMonth] = useState(null);
    const [isFocusMonth, setIsFocusMonth] = useState(false);

    // bo chon gia tri
    const [selectedOption, setSelectedOption] = useState(null);
    const [isHidden, setIsHidden] = useState(true);

    const [errorMessageScale, setErrorMessageScale] = useState('');
    const [errorMessageMonth, setErrorMessageMonth] = useState('')
    const [errorMessageYear, setErrorMessageYear] = useState('')
    const [errorMessageDate, setErrorMessageDate] = useState('');

    // bo chon gia tri ngay 
    const [fromDateVisible, setFromDateVisible] = useState(false)
    const [toDateVisible, setToDateVisible] = useState(false)
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());

    const [weightDate, setWeightDate] = useState(null)
    const yearFrom = fromDate.getFullYear();
    const monthFrom = fromDate.getMonth() + 1;
    const dayFrom = fromDate.getDate();

    const yearTo = toDate.getFullYear();
    const monthTo = toDate.getMonth() + 1;
    const dayTo = toDate.getDate();

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

    // tim kiem tu ngay den ngay
    useEffect(() => {
        const loadWeightFromDate = async () => {
            if (value != null) {
                try {
                    let res = await Api.get(endpoints['SreachFromDate'](yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, value));
                    setWeightDate(res.data);
                } catch (ex) {
                    console.error(ex);
                }
            }
        }

        loadScales();
        loadWeightFromDate();
    }, [yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, value])


    // tim kiem theo thang 
    useEffect(() => {
        const loadWeightMonth = async () => {
            if (valueMonth != null && value != null) {
                try {
                    let res = await Api.get(endpoints['weightDetailMonth'](valueMonth, value));
                    setWeightMonth(res.data);
                } catch (ex) {
                    console.error(ex);
                }
            }
        }

        loadScales();
        loadWeightMonth();
    }, [valueMonth, value])

    // tim kiem theo nam
    useEffect(() => {
        const loadWeightYear = async () => {
            if (valueYear != null && value != null) {
                try {
                    let res = await Api.get(endpoints['weightDetailYear'](valueYear, value));
                    setWeightYear(res.data);
                } catch (ex) {
                    console.error(ex);
                }
            }
        }

        loadScales();
        loadWeightYear();
    }, [valueYear, value])

    // Hàm để chuyển đổi định dạng giờ về giờ Việt Nam
    const formatDateToVN = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    };

    // Hàm chuyển đổi định dạng ngày
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`; // Định dạng DD/MM/YYYY
    };

    // Hàm chuyển đổi định dạng giờ
    const formatTime = (timeString) => {
        return timeString.split('.')[0]; // Lấy phần trước dấu '.'
    };

    // xuat file excel
    const exportToXLSX = async (dataWeight) => {
        try {
            const formattedData = dataWeight.map(item => {
                return {
                    Ticketnum: item.Ticketnum,
                    Docnum: item.Docnum,
                    Truckno: item.Truckno,

                    Date_in: formatDate(item.Date_in),
                    Date_out: formatDate(item.Date_out),

                    Firstweight: item.Firstweight,
                    Secondweight: item.Secondweight,
                    Netweight: item.Netweight,
                    Trantype: item.Trantype,

                    ProdCode: item.ProdCode,
                    ProdName: item.ProdName,
                    CustCode: item.CustCode,
                    CustName: item.CustName,

                    time_in: formatTime(item.time_in),
                    time_out: formatTime(item.time_out),
                    date_time: new Date(item.date_time).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
                    note: item.Note,
                };
            });

            let wb = XLSX.utils.book_new();
            let ws = XLSX.utils.json_to_sheet(formattedData);

            // Đổi tên cột thành tiếng Việt
            ws['A1'] = { v: 'Mã phiếu cân', t: 's' };
            ws['B1'] = { v: 'Chứng từ', t: 's' };
            ws['C1'] = { v: 'Số xe', t: 's' };
            ws['D1'] = { v: 'Ngày xe vào', t: 's' };
            ws['E1'] = { v: 'Ngày xe ra', t: 's' };

            ws['F1'] = { v: 'Trọng lượng lần 1', t: 's' };
            ws['G1'] = { v: 'Trọng lượng lần 2', t: 's' };
            ws['H1'] = { v: 'Trọng lượng thực', t: 's' };

            ws['I1'] = { v: 'Loại phiếu', t: 's' };
            ws['J1'] = { v: 'Mã hàng hóa', t: 's' };
            ws['K1'] = { v: 'Tên hàng hóa', t: 's' };
            ws['L1'] = { v: 'Mã khách hàng', t: 's' };
            ws['M1'] = { v: 'Tên khách hàng', t: 's' };

            ws['N1'] = { v: 'Giờ xe vào', t: 's' };
            ws['O1'] = { v: 'Giờ xe ra', t: 's' };
            ws['P1'] = { v: 'Ngày giờ tạo phiếu', t: 's' };
            ws['Q1'] = { v: 'Ghi chú', t: 's' };

            XLSX.utils.book_append_sheet(wb, ws, "dataWeight", true);
            const base64 = XLSX.write(wb, { type: "base64" });

            let filename;
            if (selectedOption === "option1") {
                filename = FileSystem.documentDirectory + "DuLieu_Thang_" + valueMonth + ".xlsx";
            }

            if (selectedOption === "option2") {
                filename = FileSystem.documentDirectory + "DuLieu_Nam_" + valueYear + ".xlsx";
            }

            if (selectedOption === "option3") {
                filename = FileSystem.documentDirectory + "DuLieu_TuNgay_" + dayFrom + "_" + monthFrom + "_" + yearFrom + "_DenNgay_" + dayTo + "_" + monthTo + "_" + yearTo + ".xlsx";
            }

            FileSystem.writeAsStringAsync(filename, base64, {
                encoding: FileSystem.EncodingType.Base64
            }).then(() => {
                Sharing.shareAsync(filename);
            });
        } catch (error) {
            console.error('Lỗi khi xuất file:', error);
            Alert.alert('Lỗi khi xuất file:', error.message);
        }
    };

    // ham chon gia tri 
    const handleOptionSelect = (option) => {
        if (selectedOption !== option) {
            setSelectedOption(option);
            setIsHidden(false);
        } else {
            setSelectedOption(null);
            setIsHidden(true);
        }
    };

    // ham kiem tra gia tri nhap
    const isValidInput = (input) => {
        // Kiểm tra nếu đầu vào là một chuỗi và có độ dài là 4
        if (typeof input !== 'string' || input.length !== 4) {
            return false;
        }

        // Kiểm tra nếu chuỗi chỉ chứa số và không bắt đầu bằng '0'
        const regex = /^(?!0)[0-9]{4}$/;
        return regex.test(input);
    };

    const ExportExcel = () => {
        if (selectedOption === 'option1') {
            if (value === null && valueMonth === null) {
                setErrorMessageScale('Bạn phải chọn cân !!')
                setErrorMessageMonth('Bạn phải chọn tháng !!')
            }
            else {
                if (value === null && valueMonth != null) {
                    setErrorMessageScale('Bạn phải chọn cân !!')
                }
                else {
                    if (value != null && valueMonth === null) {
                        setErrorMessageMonth('Bạn phải chọn tháng !!')
                    }
                    else {
                        exportToXLSX(weightMonth)
                    }
                }
            }
        }
        else {
            if (selectedOption === 'option2') {
                if (value === null && valueYear === null) {
                    setErrorMessageScale('Bạn phải chọn cân !!')
                    setErrorMessageYear('Bạn phải nhập năm !!')
                }
                else {
                    if (value === null && valueYear != null) {
                        setErrorMessageScale('Bạn phải chọn cân !!')
                    }
                    else {
                        if (value != null && valueYear === null) {
                            setErrorMessageYear('Bạn phải nhập năm !!')
                        }
                        else {
                            if (value !== null && isValidInput(valueYear) == true) {
                                exportToXLSX(weightYear)
                            }
                        }
                    }
                }
            }
            else {
                if (selectedOption === 'option3') {
                    if (value === null) {
                        setErrorMessageScale('Bạn phải chọn cân !!')
                    }
                    else {
                        exportToXLSX(weightDate)
                    }
                }
                else {
                    setErrorMessageMonth('Bạn phải chọn tháng !!');
                    setErrorMessageScale('Bạn phải chọn cân !!');
                    setErrorMessageYear('Bạn phải nhập năm !!');
                    setErrorMessageDate('Bạn phải chọn ngày')
                }

            }
        }
    }

    // ham cho lich chon ngay DatePicker
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

    const handleConfirmFromDate = (date) => {
        setFromDate(date);
        hideFromDate();
    };

    const handleConfirmToDate = (date) => {
        setToDate(date);
        hideToDate();
    };

    return (
        <ScrollView>
            {/* combox can */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, marginHorizontal: 15 }}>
                <Text style={{ fontSize: 15, marginRight: 5, fontWeight: '700' }}>Chọn cân:</Text>
                <View style={{ marginLeft: '3%', width: '55%' }}>
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
            {errorMessageScale ?
                <Text style={{ color: 'red', fontSize: 14, textAlign: 'center' }}>{errorMessageScale}</Text> : null}

            {/* Tu ngay den ngay */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginTop: 0 }}>
                <TouchableOpacity onPress={() => handleOptionSelect('option3')}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {selectedOption === 'option3' ? (
                        <MaterialCommunityIcons name="circle-slice-8" size={20} color="black" />
                    ) : (
                        <FontAwesome name="circle-o" size={20} color="black" />
                    )}
                    <Text style={{ fontSize: 15, marginLeft: 5, fontWeight: '700', marginRight: 10 }}>Xuất file ngày</Text>
                </TouchableOpacity>

                <View style={{ marginLeft: '2%', width: '40%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', marginRight: 10, alignItems: 'center' }}>
                            <Text style={{ marginRight: 11 }}>Từ: </Text>
                            <Text style={{ borderWidth: 0.5, paddingHorizontal: 10, borderRadius: 5, paddingVertical: 5 }}>
                                {fromDate.getDate().toString().padStart(2, '0')}/{(fromDate.getMonth() + 1).toString().padStart(2, '0')}/{fromDate.getFullYear()}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={showFromDate}>
                            <FontAwesome name="calendar" size={22} color="black" />
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={fromDateVisible}
                            mode="date"
                            onConfirm={handleConfirmFromDate}
                            onCancel={hideFromDate}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', marginRight: 10 }}>
                            <Text style={{ marginRight: 8 }}>Đến:</Text>
                            <Text style={{ borderWidth: 0.5, paddingHorizontal: 10, borderRadius: 5, paddingVertical: 5 }}>
                                {toDate.getDate().toString().padStart(2, '0')}/{(toDate.getMonth() + 1).toString().padStart(2, '0')}/{toDate.getFullYear()}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={showToDate}>
                            <FontAwesome name="calendar" size={22} color="black" />
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={toDateVisible}
                            mode="date"
                            onConfirm={handleConfirmToDate}
                            onCancel={hideToDate}
                        />
                    </View>

                </View>
            </View>

            {/* combox thang */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginTop: 10 }}>
                <TouchableOpacity onPress={() => handleOptionSelect('option1')}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {selectedOption === 'option1' ? (
                        <MaterialCommunityIcons name="circle-slice-8" size={20} color="black" />
                    ) : (
                        <FontAwesome name="circle-o" size={20} color="black" />
                    )}
                    <Text style={{ fontSize: 15, marginLeft: 5, fontWeight: '700', marginRight: 10 }}>Xuất file tháng</Text>
                </TouchableOpacity>

                <View style={{ marginLeft: '2%', width: '40%' }}>
                    <Dropdown
                        style={[styles.dropdown, isFocusMonth && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={dataMonth}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocusMonth ? 'Tháng' : '...'}
                        searchPlaceholder="Tìm kiếm..."
                        value={valueMonth}
                        onFocus={() => setIsFocusMonth(true)}
                        onBlur={() => setIsFocusMonth(false)}
                        onChange={item => {
                            setValueMonth(item.value);
                            setIsFocusMonth(false);
                        }}
                    />
                </View>
            </View>

            {errorMessageMonth ?
                <Text style={{ color: 'red', fontSize: 14, textAlign: 'center', marginLeft: '30%' }}>{errorMessageMonth}</Text> : null}

            {/* nhap nam */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginHorizontal: 10 }}>
                <TouchableOpacity onPress={() => handleOptionSelect('option2')}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {selectedOption === 'option2' ? (
                        <MaterialCommunityIcons name="circle-slice-8" size={20} color="black" />
                    ) : (
                        <FontAwesome name="circle-o" size={20} color="black" />
                    )}
                    <Text style={{ fontSize: 15, marginLeft: 5, fontWeight: '700' }}>Xuất file năm</Text>
                </TouchableOpacity>

                <TextInput style={{ borderWidth: 0.5, width: '37%', marginLeft: '8%', fontSize: 14, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5 }}
                    placeholder='Nhập năm ...'
                    keyboardType="numeric"
                    value={valueYear}
                    onChangeText={(text) => setValueYear(text)}
                />
            </View>

            {errorMessageYear ?
                <Text style={{ color: 'red', fontSize: 14, textAlign: 'center', marginLeft: '27%' }}>{errorMessageYear}</Text> : null}

            {/* nut xuat ra excel */}
            <TouchableOpacity style={{ padding: 8, backgroundColor: '#1E90FF', borderRadius: 10, marginTop: 10 }}
                onPress={ExportExcel}>
                <Text style={{ textAlign: 'center', color: 'white', fontSize: 14, fontWeight: '700' }}>Xuất và chia sẻ file</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ExportXLSXDirectly;

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