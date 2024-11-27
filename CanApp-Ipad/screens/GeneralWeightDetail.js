import { FontAwesome } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ChartPie from "../components/ChartPie";
import Api, { endpoints } from "../configs/Api";

export default GeneralWeightDetail = ({ route, navigation }) => {
    const [data, setData] = useState(null)
    const { scaleId, day, month, year } = route.params;

    const [filteredData, setFilteredData] = useState('');
    const [stateSort, setStateSort] = useState(true)
    const [noDataMessage, setNoDataMessage] = useState('');

    const Tab = createMaterialTopTabNavigator();

    const loadWeightDetail = async () => {
        try {
            let res = await Api.get(endpoints['GeneralDay'](year, month, day, scaleId));
            setData(res.data);
            setFilteredData(res.data.customer)
        } catch (ex) {
            console.error(ex);
        }
    }

    useEffect(() => {
        loadWeightDetail();
    }, [year, month, day, scaleId])


    const formatCurrency = (value) => {
        // Lấy phần nguyên của giá trị
        const intValue = parseInt(value);

        // Định dạng số tiền với dấu phân cách hàng nghìn
        return intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const goToCustomerDetail = (custCode, custName) => {
        navigation.navigate("GeneralCustomerDetail", { "scaleId": scaleId, "day": day, "month": month, "year": year, "custCode": custCode, "custName": custName })
    }

    const CustomerItem = ({ item }) => {
        return (
            <View style={{ paddingHorizontal: 13, paddingVertical: 5 }}>
                <TouchableOpacity style={styles.itemDetail} onPress={() => goToCustomerDetail(item.CustomerCode, item.CustomerName)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 13 }}>Mã khách hàng: </Text>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: 'red' }}>{item.CustomerCode}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <FontAwesome name="circle-o" size={15} color="green" style={{ marginHorizontal: 1 }} />
                            <FontAwesome name="circle-o" size={15} color="green" style={{ marginHorizontal: 1 }} />
                            <FontAwesome name="circle-o" size={15} color="green" style={{ marginHorizontal: 1 }} />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                        <Text style={{ fontSize: 13 }}>Tên khách hàng: </Text>
                        <Text style={{ fontSize: 13, fontWeight: '700' }}>{item.CustomerName}</Text>
                    </View>

                    <View style={{ width: '60%', borderWidth: 0.4, margin: 5, marginHorizontal: '20%', borderColor: 'black' }}></View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 13 }}>Tổng phiếu cân: </Text>
                            <Text style={{ fontSize: 13, fontWeight: '700' }}>{item.TotalItems}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 13 }}>Tổng TL: </Text>
                            <Text style={{ fontSize: 13, fontWeight: '700' }}>{formatCurrency(item.TotalWeight)}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 13 }}>Phiếu nhập: </Text>
                            <Text style={{ fontSize: 13, fontWeight: '700' }}>{item.CountIn}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 13 }}>TL nhập: </Text>
                            <Text style={{ fontSize: 13, fontWeight: '700' }}>{formatCurrency(item.TotalIn)}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 13 }}>Phiếu xuất: </Text>
                            <Text style={{ fontSize: 13, fontWeight: '700' }}>{item.CountOut}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 13 }}>TL xuất: </Text>
                            <Text style={{ fontSize: 13, fontWeight: '700' }}>{formatCurrency(item.TotalOut)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    // tim kiem theo tung nhom khach hang
    const SearchCustomer = () => {
        const [searchTerm, setSearchTerm] = useState('');
        const [isSearchActive, setIsSearchActive] = useState(false);

        // ham tim kiem
        const handleSearch = () => {
            if (searchTerm) {
                const filtered = data.customer.filter(item =>
                    item.CustomerName.toLowerCase().includes(searchTerm.toLowerCase())
                );

                if (filtered.length === 0) {
                    setNoDataMessage('Không có dữ liệu');
                } else {
                    setNoDataMessage('');
                }

                setFilteredData(filtered);
            } else {
                setFilteredData(data.customer);
                setNoDataMessage('');
            }
            setIsSearchActive(true);
        };

        // ham sap xep
        const sortWeight = (data) => {
            if (stateSort === true) {
                data.sort((a, b) => a.CustomerCode.localeCompare(b.CustomerCode));
                setStateSort(false)
            } else {
                data.sort((a, b) => b.CustomerCode.localeCompare(a.CustomerCode));
                setStateSort(true)
            }
            return data;
        }

        return (
            <View style={{ flex: 1 }}>
                {/* thanh tìm kiếm tên khách hàng */}
                <View style={{
                    alignItems: 'center', marginHorizontal: '5%', flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between', marginTop: 10, marginBottom: 10
                }}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm tên khách hàng ..."
                        value={searchTerm}
                        onChangeText={(text) => setSearchTerm(text)}
                    />

                    <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                        <Text style={{ color: 'white', fontSize: 13, textAlign: 'center' }}>Tìm</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ padding: 5, borderWidth: 1, marginLeft: 10, borderRadius: 5 }}
                        onPress={() => sortWeight(filteredData)}>
                        <FontAwesome name="sort" size={20} color="black" style={{ textAlign: 'center' }} />
                    </TouchableOpacity>
                </View>

                {noDataMessage ? (
                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 14 }}>{noDataMessage}</Text>
                ) : (
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item) => item.CustomerCode}
                        renderItem={({ item }) => <CustomerItem item={item} />}
                    />
                )}
            </View>
        )
    }

    // thống kê tổng quát
    const goToDetail = () => {
        navigation.navigate("Weight", { "day": day, "month": month, "year": year, "scaleId": scaleId })
    }

    const GeneralChart = () => {
        return (
            <ScrollView>
                {data === null ? <ActivityIndicator /> : <>
                    <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 0, justifyContent: 'space-between' }}>
                        <View style={styles.titleDate}>
                            <FontAwesome name="calendar" size={20} color="white" />
                            <Text style={{ color: 'white', fontWeight: '700', marginLeft: 8, fontSize: 18, marginRight: 10 }}>
                                {moment(data.created_day).utcOffset(7).format('DD-MM-YYYY')}</Text>
                        </View>

                        <TouchableOpacity style={styles.buttonDetail} onPress={() => goToDetail()}>
                            <Entypo name="eye" size={24} color="white" />
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: '700', marginLeft: 10 }}>Xem chi tiết</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginBottom: 10 }}>
                        <ChartPie countIn={data.count_in} countOut={data.count_out} />
                        <Text style={{ textAlign: 'center', fontSize: 14 }}>Biểu đồ về số lượng phiếu trong ngày</Text>
                    </View>

                    <View style={[styles.item, style = { marginTop: 10 }]}>
                        <View style={{
                            width: '43%', backgroundColor: 'lightblue', paddingVertical: 15, height: 80, borderRadius: 5,
                            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                        }}>
                            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600' }}>Tổng phiếu cân</Text>
                            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '800' }}>{data.CountWeight}</Text>
                        </View>

                        <View style={{
                            width: '53%', backgroundColor: 'lightblue', paddingVertical: 15, height: 80, borderRadius: 5,
                            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                        }}>
                            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600' }}>Tổng trọng lượng</Text>
                            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '800' }}>{formatCurrency(data.TotalWeight || 0)}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <View style={{
                            width: '43%', backgroundColor: 'lightgreen', paddingVertical: 15, height: 80, borderRadius: 5,
                            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                        }}>
                            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600' }}>Tổng phiếu nhập</Text>
                            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '800' }}>{data.count_in}</Text>
                        </View>

                        <View style={{
                            width: '53%', backgroundColor: 'lightgreen', paddingVertical: 15, height: 80, borderRadius: 5,
                            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                        }}>
                            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600' }}>Tổng trọng lượng nhập</Text>
                            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '800' }}>{formatCurrency(data.total_in || 0)}</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <View style={{
                            width: '43%', backgroundColor: 'pink', paddingVertical: 15, height: 80, borderRadius: 5,
                            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                        }}>
                            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600' }}>Tổng phiếu xuất</Text>
                            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '800' }}>{data.count_out}</Text>
                        </View>

                        <View style={{
                            width: '53%', backgroundColor: 'pink', paddingVertical: 15, height: 80, borderRadius: 5,
                            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 5, elevation: 4
                        }}>
                            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600' }}>Tổng trọng lượng xuất</Text>
                            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '800' }}>{formatCurrency(data.total_out || 0)}</Text>
                        </View>
                    </View>
                </>}
            </ScrollView>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator>
                <Tab.Screen name="GeneralChart" component={GeneralChart}
                    options={{
                        title: 'Thống kê chung',
                        tabBarLabel: ({ focused }) => (
                            <Text style={{ fontSize: 14 }}>THỐNG KÊ CHUNG</Text> // Thay đổi kích thước chữ tại đây
                        ),
                    }} />
                <Tab.Screen name="SearchCustomer" component={SearchCustomer}
                    options={{
                        title: 'Thống kê khách hàng',
                        tabBarLabel: ({ focused }) => (
                            <Text style={{ fontSize: 14 }}>THỐNG KÊ KHÁCH HÀNG</Text> // Thay đổi kích thước chữ tại đây
                        ),
                    }} />
            </Tab.Navigator>
        </View>
    )
};

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        marginHorizontal: 7,
        marginVertical: 6,
        justifyContent: 'space-evenly',
    },

    itemDetail: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 12,
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
        height: 33,
        fontSize: 13,
        width: '75%',
        borderColor: 'gray',
        flex: 1,
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5
    },

    searchButton: {
        width: '20%',
        padding: 5,
        backgroundColor: 'green',
        borderRadius: 5,
        height: 33,
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
    }
})
