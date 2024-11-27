import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from 'react-native';
import Api, { endpoints } from "../configs/Api";

export default GeneralWeight = () => {
    const [data, setData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const fetchData = async () => {
        try {
            const response = await Api.get(endpoints['GeneralMonth'](8, 1));
            setData(response.data)
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setRefreshing(true);
        fetchData();
    }, []);

    const formatCurrency = (value) => {
        // Lấy phần nguyên của giá trị
        const intValue = parseInt(value);

        // Định dạng số tiền với dấu phân cách hàng nghìn
        return intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    if (!data) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white' }}>
                <View style={{ width: 100, height: 80, backgroundColor: '#009900', padding: 10, borderRadius: 20 }}>
                    <Text style={{ fontSize: 18, textAlign: 'center', fontWeight: '800', color: 'white' }}>Tháng</Text>
                    <Text style={{ fontSize: 18, textAlign: 'center', fontWeight: '800', color: 'white' }}>{data.Month}</Text>
                </View>

                <View style={{ marginLeft: '5%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 15 }}>Tổng số phiếu:</Text>
                        <Text style={{ marginLeft: 4, fontSize: 15 }}>
                            <Text style={{ color: 'red', fontWeight: '800' }}> {data.CountWeight}</Text> phiếu</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <Text style={{ fontSize: 15 }}>Tổng trọng lượng:</Text>
                        <Text style={{ fontWeight: '800', color: 'red', marginLeft: 4, fontSize: 15 }}>{formatCurrency(data.TotalWeight)}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <Text style={{ fontSize: 15 }}>Tổng phiếu nhập:</Text>
                        <Text style={{ marginLeft: 4, fontSize: 15 }}>
                            <Text style={{ color: 'red', fontWeight: '800' }}> {data.CountIn}</Text> phiếu</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <Text style={{ fontSize: 15 }}>Tổng phiếu xuất:</Text>
                        <Text style={{ marginLeft: 4, fontSize: 15 }}>
                            <Text style={{ color: 'red', fontWeight: '800' }}> {data.CountOut}</Text> phiếu</Text>
                    </View>
                </View>
            </View>

            {data.days.length > 0 && (
                <CarouselWeight
                    data={data.days}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dayContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginBottom: 10,
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    dayInfo: {
        fontSize: 16,
        marginBottom: 5,
    },
    customerContainer: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        marginBottom: 10,
    },
    customerName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    customerInfo: {
        fontSize: 14,
        marginBottom: 5,
    },
    productContainer: {
        backgroundColor: '#d0d0d0',
        padding: 10,
        marginBottom: 5,
    },
    productName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    productInfo: {
        fontSize: 12,
        marginBottom: 5,
    },
});