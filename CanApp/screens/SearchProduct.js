import Entypo from '@expo/vector-icons/Entypo';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ChartPie from "../components/ChartPie";
import Api, { endpoints } from '../configs/Api';

export default SearchProduct = ({ navigation, route }) => {
    const Tab = createMaterialTopTabNavigator();
    const [loading, setLoading] = useState(true);
    const [weight, setWeight] = useState([])
    const {yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, value, valueItem } = route.params;

    const loadWeightDetail = async () => {
        try {
            let res = await Api.get(endpoints['SreachFromDate'](yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, value));
            const data = groupByProduct(res.data, valueItem)
            setWeight(data)
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false); // Kết thúc loading trong finally
        }
    }

    useEffect(() => {
        loadWeightDetail();
    }, [])

    const groupByProduct = (data, value) => {
        const grouped = {
            ProdCode: value,
            ProdName: '',
            totalWeight: 0,
            totalReceipts: 0,
            totalIn: 0,
            totalWeightIn: 0,
            totalOut: 0,
            totalWeightOut: 0,
            groupedByDate: {}
        };

        data.forEach(item => {
            if (item.ProdCode === value) {
                grouped.ProdName = item.ProdName; // Lưu tên khách hàng

                // Cộng dồn trọng lượng
                grouped.totalWeight += item.Netweight;

                // Tính số lượng phiếu
                grouped.totalReceipts += 1;

                // Phân loại theo phiếu nhập và xuất
                if (item.Trantype === 'Nhập hàng') {
                    grouped.totalIn += 1; // Tăng số lượng phiếu nhập
                    grouped.totalWeightIn += item.Netweight
                } else if (item.Trantype === 'Xuất hàng') {
                    grouped.totalOut += 1; // Tăng số lượng phiếu xuất
                    grouped.totalWeightOut += item.Netweight
                }

                // Gom nhóm theo ngày
                const day = item.Date_in; // Lấy ngày
                if (!grouped.groupedByDate[day]) {
                    grouped.groupedByDate[day] = {
                        code: day,
                        receiptsCount: 0,
                        receiptsWeight: 0,
                        countIn: 0,
                        countOut: 0,
                        totalIn: 0,
                        totalOut: 0,
                        categoryProduct: new Set() // Sử dụng Set để đếm loại hàng
                    };
                }

                // Thêm đơn hàng vào nhóm theo ngày
                grouped.groupedByDate[day].receiptsCount += 1;
                grouped.groupedByDate[day].receiptsWeight += item.Netweight;

                // Cập nhật số lượng phiếu nhập và xuất theo ngày
                if (item.Trantype === 'Nhập hàng') {
                    grouped.groupedByDate[day].countIn += 1; // Tăng số lượng phiếu nhập trong ngày
                    grouped.groupedByDate[day].totalIn += item.Netweight
                } else if (item.Trantype === 'Xuất hàng') {
                    grouped.groupedByDate[day].countOut += 1; // Tăng số lượng phiếu xuất trong ngày
                    grouped.groupedByDate[day].totalOut += item.Netweight
                }

                // Thêm loại sản phẩm vào Set
                grouped.groupedByDate[day].categoryProduct.add(item.CustCode);
            }
        });

        // Chuyển đổi đối tượng groupedByDate thành mảng
        grouped.groupedByDate = Object.values(grouped.groupedByDate);

        // Chuyển đổi Set thành số lượng loại hàng
        grouped.groupedByDate.forEach(dateGroup => {
            dateGroup.categoryProduct = dateGroup.categoryProduct.size; // Số loại hàng
        });
        // console.log(grouped)
        return grouped; // Trả về đối tượng đã nhóm
    };

    // ham thap phan 
    const formatCurrency = (value) => {
        // Lấy phần nguyên của giá trị
        const intValue = parseInt(value);

        // Định dạng số tiền với dấu phân cách hàng nghìn
        return intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    //ham ngay thang nam
    const formatDate = (day, month, year) => {
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    };

    // chuyen trang den trang chi tiet
    const goToDetail = (date) => {
        const dateTimeString = date;
        const dateTime = new Date(dateTimeString);

        const year = dateTime.getFullYear();
        const month = dateTime.getMonth() + 1;
        const day = dateTime.getDate();

        navigation.navigate('GeneralProductDetail', { "scaleId": value, "day": day, "month": month, "year": year, "ProdCode": weight.ProdCode, "ProdName": weight.ProdName });
    }

    const GeneralChartCustomer = () => {
        return (
            <ScrollView>
                <View style={{ marginHorizontal: 10, height: 80, padding: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 14, marginRight: 15 }}>Từ ngày: {formatDate(dayFrom, monthFrom, yearFrom)}</Text>
                        <Text style={{ fontSize: 14 }}>Đến ngày: {formatDate(dayTo, monthTo, yearTo)}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 3 }}>
                        <Text style={{ fontSize: 14 }}>Mã hàng hóa: </Text>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: 'red' }}>{weight.ProdCode}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 14 }}>Tên hàng hóa: </Text>
                        <Text style={{ fontSize: 14, fontWeight: '700' }}>{weight.ProdName}</Text>
                    </View>
                </View>

                {/* duong gach ngang */}
                <View style={{ borderWidth: 0.5, width: '60%', marginHorizontal: '20%', marginBottom: 5 }}></View>

                <View style={[styles.item, style = { marginTop: 10 }]}>
                    <View style={{
                        width: '43%', backgroundColor: 'lightblue', padding: 12, height: 70, borderRadius: 5,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600' }}>Tổng phiếu cân</Text>
                        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '800' }}>{weight.totalReceipts}</Text>
                    </View>

                    <View style={{
                        width: '53%', backgroundColor: 'lightblue', padding: 12, height: 70, borderRadius: 5,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600' }}>Tổng trọng lượng</Text>
                        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '800' }}>{formatCurrency(weight.totalWeight || 0)}</Text>
                    </View>
                </View>

                <View style={{ marginVertical: 10 }}>
                    <ChartPie countIn={weight.totalIn} countOut={weight.totalOut} />
                    <Text style={{ textAlign: 'center' }}>Biểu đồ về số lượng phiếu trong ngày</Text>
                </View>

                <View style={styles.item}>
                    <View style={{
                        width: '43%', backgroundColor: 'lightgreen', padding: 12, height: 70, borderRadius: 5,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600' }}>Tổng phiếu nhập</Text>
                        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '800' }}>{weight.totalIn}</Text>
                    </View>

                    <View style={{
                        width: '53%', backgroundColor: 'lightgreen', padding: 12, height: 70, borderRadius: 5,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600' }}>Tổng trọng lượng nhập</Text>
                        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '800' }}>{formatCurrency(weight.totalWeightIn || 0)}</Text>
                    </View>
                </View>

                <View style={styles.item}>
                    <View style={{
                        width: '43%', backgroundColor: 'pink', padding: 12, height: 70, borderRadius: 5,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600' }}>Tổng phiếu xuất</Text>
                        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '800' }}>{weight.totalOut}</Text>
                    </View>

                    <View style={{
                        width: '53%', backgroundColor: 'pink', padding: 12, height: 70, borderRadius: 5,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                    }}>
                        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600' }}>Tổng trọng lượng xuất</Text>
                        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '800' }}>{formatCurrency(weight.totalWeightOut || 0)}</Text>
                    </View>
                </View>
            </ScrollView>
        )
    }

    const DetailCustomer = () => {
        return (
            <ScrollView>
                {weight.groupedByDate && Array.isArray(weight.groupedByDate) && weight.groupedByDate.length > 0 &&
                    (weight.groupedByDate.map((dateGroup, index) => (
                        <TouchableOpacity style={styles.itemDate} key={dateGroup.code} onPress={() => goToDetail(dateGroup.code)}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontWeight: '700', color: 'green', fontSize: 15 }}>
                                    Ngày {moment(dateGroup.code).utcOffset(7).format('DD/MM/YYYY')}
                                </Text>

                                <View style={{ flexDirection: 'row' }}>
                                    <Entypo name="circle" size={10} color="green" style={{ marginHorizontal: 2 }} />
                                    <Entypo name="circle" size={10} color="green" style={{ marginHorizontal: 1 }} />
                                    <Entypo name="circle" size={10} color="green" style={{ marginHorizontal: 2 }} />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                                <Text>Tổng phiếu: {dateGroup.receiptsCount} phiếu</Text>
                                <Text>Số khách hàng: {dateGroup.categoryProduct}</Text>
                            </View>

                            <Text style={{ marginTop: 2 }}>Tổng trọng lượng: {formatCurrency(dateGroup.receiptsWeight)}</Text>

                            <View style={{ borderBottomWidth: 0.5, width: '60%', marginHorizontal: '20%', marginVertical: 8 }}></View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>Phiếu nhập: {dateGroup.countIn} phiếu</Text>
                                <Text>TL nhập: {formatCurrency(dateGroup.totalIn)}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                                <Text>Phiếu xuất: {dateGroup.countOut} phiếu</Text>
                                <Text>TL xuất: {formatCurrency(dateGroup.totalOut)}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                    )}
            </ScrollView>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Tab.Navigator>
                    <Tab.Screen name="GeneralChartCustomer" component={GeneralChartCustomer} options={{ title: 'Thống kê chung' }} />
                    <Tab.Screen name="DetailCustomer" component={DetailCustomer} options={{ title: 'Thống kê chi tiết' }} />
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

    itemDate: {
        backgroundColor: 'white',
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 5,
    }
})