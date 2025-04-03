import { FontAwesome } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as XLSX from 'xlsx';
import ChartPie from "../components/ChartPie";
import Api, { endpoints } from "../configs/Api";

export default WeightChartMonth = ({ route, navigation }) => {
    const [groups, setGroups] = useState([]);
    const [dataMonth, setDataMonth] = useState([])

    const { month, scaleId } = route.params;
    const [loading, setLoading] = useState(true);

    const Tab = createMaterialTopTabNavigator();

    useEffect(() => {
        const loadData = async () => {
            try {
                let res = await Api.get(endpoints['GeneralMonth'](month, scaleId));
                setGroups(res.data)
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }

        const loadDataMonth = async () => {
            try {
                let res = await Api.get(endpoints['weightDetailMonth'](month, scaleId));
                setDataMonth(res.data)
            } catch (ex) {
                console.error(ex);
            }
        }

        loadData()
        loadDataMonth()
    }, [])

    const formatCurrency = (value) => {
        // Lấy phần nguyên của giá trị
        const intValue = parseInt(value);

        // Định dạng số tiền với dấu phân cách hàng nghìn
        return intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const gotoDetail = (date) => {
        const dateTimeString = date;
        const dateTime = new Date(dateTimeString);

        const year = dateTime.getFullYear();
        const month = dateTime.getMonth() + 1;
        const day = dateTime.getDate();


        navigation.navigate('GeneralWeightDetail', { "scaleId": scaleId, "day": day, "month": month, "year": year });
    }

    // Hàm chuyển đổi định dạng ngày
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`; // Định dạng DD/MM/YYYY
    };

    // Hàm chuyển đổi định dạng giờ
    const formatTime = (timeString) => {
        return timeString.split('.')[0]; // Lấy phần trước dấu '.'
    };

    const ExportToExcel = async () => {
        try {
            const formattedData = dataMonth.map(item => {
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
                    ScaleName: item.TenCan,
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
            ws['Q1'] = { v: 'Tên cân', t:'s'};
            ws['R1'] = { v: 'Ghi chú', t: 's' };

            XLSX.utils.book_append_sheet(wb, ws, "dataPerson", true);
            const base64 = XLSX.write(wb, { type: "base64" });
            const filename = FileSystem.documentDirectory + "Data_Thang_" + month + ".xlsx";
            FileSystem.writeAsStringAsync(filename, base64, {
                encoding: FileSystem.EncodingType.Base64
            }).then(() => {
                Sharing.shareAsync(filename);
            });
        } catch (error) {
            console.error('Lỗi khi xuất file:', error);
            Alert.alert('Lỗi khi xuất file:', error.message);
        }
    }

    const ChartMonth = () => {
        return (
            <ScrollView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 0, justifyContent: 'space-between' }}>
                    <View style={styles.titleDate}>
                        <FontAwesome name="calendar" size={17} color="white" />
                        <Text style={{ color: 'white', fontWeight: '700', marginLeft: 3, fontSize: 13 }}>Tháng {month}</Text>
                    </View>

                    <TouchableOpacity style={styles.buttonDetail} onPress={ExportToExcel}>
                        <MaterialCommunityIcons name="microsoft-excel" size={18} color="white" />
                        <Text style={{ color: 'white', fontSize: 13, fontWeight: '700', marginLeft: 3 }}>Xuất excel</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginBottom: 5 }}>
                    <ChartPie countIn={groups.CountIn} countOut={groups.CountOut} />
                    <Text style={{ textAlign: 'center', fontSize: 13 }}>Biểu đồ về số lượng phiếu trong tháng</Text>
                </View>

                <View style={[styles.item, style = { marginTop: 10 }]}>
                    <View style={{
                        width: '43%', backgroundColor: 'lightblue', paddingVertical: 10, height: 65, borderRadius: 5,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: '600' }}>Tổng phiếu cân</Text>
                        <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: '800' }}>{groups.CountWeight}</Text>
                    </View>

                    <View style={{
                        width: '53%', backgroundColor: 'lightblue', paddingVertical: 10, height: 65, borderRadius: 5,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: '600' }}>Tổng trọng lượng</Text>
                        <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: '800' }}>{formatCurrency(groups.TotalWeight || 0)}</Text>
                    </View>
                </View>

                <View style={styles.item}>
                    <View style={{
                        width: '43%', backgroundColor: 'lightgreen', paddingVertical: 10, height: 65, borderRadius: 5,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: '600' }}>Tổng phiếu nhập</Text>
                        <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: '800' }}>{groups.CountIn}</Text>
                    </View>

                    <View style={{
                        width: '53%', backgroundColor: 'lightgreen', paddingVertical: 10, height: 65, borderRadius: 5,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: '600' }}>Tổng trọng lượng nhập</Text>
                        <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: '800' }}>{formatCurrency(groups.TotalIn || 0)}</Text>
                    </View>
                </View>

                <View style={styles.item}>
                    <View style={{
                        width: '43%', backgroundColor: 'pink', paddingVertical: 10, height: 65, borderRadius: 5,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: '600' }}>Tổng phiếu xuất</Text>
                        <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: '800' }}>{groups.CountOut}</Text>
                    </View>

                    <View style={{
                        width: '53%', backgroundColor: 'pink', paddingVertical: 10, height: 65, borderRadius: 5,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: '600' }}>Tổng trọng lượng xuất</Text>
                        <Text style={{ textAlign: 'center', fontSize: 13, fontWeight: '800' }}>{formatCurrency(groups.TotalOut || 0)}</Text>
                    </View>
                </View>

            </ScrollView>
        )
    }

    const MonthDetail = () => {
        return (
            <ScrollView>
                <View>
                    <Text style={{ backgroundColor: '#0099FF', textAlign: 'center', padding: 10, fontSize: 14, fontWeight: '700', color: 'white' }}>Tháng {month}</Text>
                </View>

                {groups === null ? <ActivityIndicator /> : <>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 10, flexWrap: 'wrap', marginLeft: 3 }}>
                        {groups.days.map(g => (
                            <TouchableOpacity key={g.code} style={styles.itemDetail} onPress={() => gotoDetail(g.code)}>
                                <Text style={{ fontSize: 13, textAlign: 'center', color: 'red', fontWeight: '700' }}>{moment(g.code).utcOffset(7).format('DD-MM-YYYY')}</Text>
                                <Text style={{ fontSize: 12, textAlign: 'center', fontWeight: '700' }}>{formatCurrency(g.count)} phiếu</Text>
                                <Text style={{ fontSize: 12, textAlign: 'center', fontWeight: '700' }}>{formatCurrency(g.total)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>}
            </ScrollView>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Tab.Navigator>
                    <Tab.Screen name="ChartMonth" component={ChartMonth}
                        options={{
                            title: 'Thống kê tổng quát',
                            tabBarLabel: ({ focused }) => (
                                <Text style={{ fontSize: 11 }}>THỐNG KÊ TỔNG QUÁT</Text> // Thay đổi kích thước chữ tại đây
                            ),
                        }} />
                    <Tab.Screen name="MonthDetail" component={MonthDetail}
                        options={{
                            title: 'Thống kê chi tiết',
                            tabBarLabel: ({ focused }) => (
                                <Text style={{ fontSize: 11 }}>THỐNG KÊ CHI TIẾT</Text> // Thay đổi kích thước chữ tại đây
                            ),
                        }} />
                </Tab.Navigator>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        marginHorizontal: 7,
        marginVertical: 6,
        justifyContent: 'space-evenly',
    },

    itemDetail: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        borderTopRightRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },

    fontTitle: {
        fontWeight: '600',
        fontSize: 15
    },

    itemButton: {
        height: 45,
        padding: 10,
        width: '40%',
        borderWidth: 1,
        borderColor: 'blue',
    },

    selectedItem: {
        backgroundColor: 'lightblue',
    },

    searchInput: {
        backgroundColor: 'white',
        height: 40,
        width: '75%',
        borderColor: 'gray',
        flex: 1,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5
    },

    searchButton: {
        width: '20%',
        padding: 10,
        backgroundColor: 'green',
        borderRadius: 5,
        height: 40,
        marginLeft: 5
    },

    titleDate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0099FF',
        height: 50,
        padding: 10,
        borderBottomRightRadius: 30,
        borderTopRightRadius: 30,
    },

    buttonDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0099FF',
        height: 50,
        padding: 12,
        borderBottomLeftRadius: 30,
        borderTopLeftRadius: 30,
    },

    itemDetail: {
        backgroundColor: 'white',
        width: '31%',
        padding: 10,
        marginHorizontal: 4,
        marginVertical: 5,
        borderLeftWidth: 9,
        borderLeftColor: 'green',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    }
})
