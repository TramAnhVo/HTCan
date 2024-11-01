import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import * as XLSX from 'xlsx';
import Api, { endpoints } from '../configs/Api';

export default GeneralCustomerDetail = ({ navigation, route }) => {
    const [weight, setWeight] = useState(null)
    const [groups, setGroups] = useState([]);
    const Tab = createMaterialTopTabNavigator();
    const { scaleId, day, month, year, custCode, custName } = route.params;

    const [filteredData, setFilteredData] = useState('');
    const [weightItem, setWeightItem] = useState([])
    const [stateSort, setStateSort] = useState(true)
    const [loading, setLoading] = useState(true);
    // nut trang thai out-in
    const [selectedType, setSelectedType] = useState('All');
    // mang san pham duy nhat dung cho combo box
    const [product, setProduct] = useState([]);
    // chua gia tri ma san pham
    const [valueItem, setValueItem] = useState(null);
    // mang gia tri da loc theo san pham
    const [dataProduct, setDataProduct] = useState([])

    const loadWeightDetail = async () => {
        try {
            let res = await Api.get(endpoints['GeneralCustomer'](year, month, day, scaleId, custCode));
            const data = res.data
            setWeight(res.data);
            setWeightItem(res.data)
            setFilteredData(res.data)

            const groupedData = CustomerGroup(res.data)
            setGroups(groupedData)

            // Extract unique product codes and names
            const uniqueProduct = Array.from(
                new Map(data.map(item => [item.ProdCode, item.ProdName])).entries()
            ).map(([ProdCode, ProdName]) => ({ ProdCode, ProdName }));

            setProduct(uniqueProduct);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false); // Kết thúc loading trong finally
        }
    }

    useEffect(() => {
        loadWeightDetail();
    }, [year, month, day, scaleId, custCode])

    // ham danh cho thong ke chi tiết
    const CustomerGroup = (data) => {
        if (!data || data.length === 0) {
            return [];
        }

        const groups = {};
        data.forEach((item) => {
            if (!groups[item.ProdCode]) {
                groups[item.ProdCode] = {
                    code: item.ProdCode, nameProd: item.ProdName,
                    count: 0, total: 0,
                    phieuXuat: 0, phieuNhap: 0,
                    totalXuat: 0, totalNhap: 0
                };
            }
            groups[item.ProdCode].count++;
            groups[item.ProdCode].total += item.Netweight;

            if (item.Trantype === 'Xuất hàng') {
                groups[item.ProdCode].phieuXuat++;
                groups[item.ProdCode].totalXuat += item.Netweight;
            } else if (item.Trantype === 'Nhập hàng') {
                groups[item.ProdCode].phieuNhap++;
                groups[item.ProdCode].totalNhap += item.Netweight;
            }
        });

        // Sắp xếp các sản phẩm theo thứ tự tăng dần dựa trên mã sản phẩm
        const sortedGroups = Object.values(groups).sort((a, b) => {
            const codeA = a.code.slice(2);
            const codeB = b.code.slice(2);
            return parseInt(codeA) - parseInt(codeB);
        });
        return sortedGroups;
    };

    // ham thap phan 
    const formatCurrency = (value) => {
        // Lấy phần nguyên của giá trị
        const intValue = parseInt(value);

        // Định dạng số tiền với dấu phân cách hàng nghìn
        return intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

    // xuat ra file excel
    const exportToXLSX = async () => {
        try {
            const formattedData = filteredData.map(item => {
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

            XLSX.utils.book_append_sheet(wb, ws, "dataPerson", true);
            const base64 = XLSX.write(wb, { type: "base64" });
            const filename = FileSystem.documentDirectory + "Data_" + day + "_" + month + "_" + year + "_" + custName + ".xlsx";
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

    const goToWeightDetail = (weightId) => {
        navigation.navigate("WeightDetail", { "weightId": weightId })
    }

    // giao dien + chuc nang tab phieu can chi tiet
    const WeightCustomerDetail = () => {
        const [searchTerm, setSearchTerm] = useState('');
        const [noDataMessage, setNoDataMessage] = useState('');
        const [isFocusItem, setIsFocusItem] = useState(false);

        // nut tinh phieu xuat nhap + reset
        const TrantypeWeight = (option) => {
            let countOut = 0;
            let countIn = 0;
            let newDataIn = [];
            let newDataOut = [];

            let countOutProduct = 0;
            let countInProduct = 0;
            let DataInProduct = [];
            let DataOutProduct = [];

            weightItem.forEach((items) => {
                if (items.Trantype === "Nhập hàng") {
                    newDataIn.push(items);
                    countIn += 1;
                }
                else {
                    newDataOut.push(items);
                    countOut += 1;
                }
            })

            if (valueItem != null) {
                dataProduct.forEach((item) => {
                    if (item.Trantype === "Nhập hàng") {
                        DataInProduct.push(item);
                        countInProduct += 1;
                    }
                    else {
                        DataOutProduct.push(item);
                        countOutProduct += 1;
                    }
                })

                if (option === 'In') {
                    setWeight(DataInProduct)
                    setSelectedType(option); // Cập nhật state khi nút được nhấn
                }
                else {
                    if (option === 'Out') {
                        setWeight(DataOutProduct)
                        setSelectedType(option); // Cập nhật state khi nút được nhấn
                    }
                    else {
                        if (option === 'All') {
                            setWeight(weightItem)
                            setSelectedType(option); // Cập nhật state khi nút được nhấn
                            setValueItem(null)
                        }
                    }
                }
            } else {
                if (option === 'In') {
                    setWeight(newDataIn)
                    setSelectedType(option); // Cập nhật state khi nút được nhấn
                }
                else {
                    if (option === 'Out') {
                        setWeight(newDataOut)
                        setSelectedType(option); // Cập nhật state khi nút được nhấn
                    }
                    else {
                        if (option === 'All') {
                            setWeight(weightItem)
                            setSelectedType(option); // Cập nhật state khi nút được nhấn
                            setValueItem(null)
                        }
                    }
                }

            }
        }

        // hàm sắp xếp các phiếu cân
        const sortWeight = (data) => {
            if (stateSort === true) {
                data.sort((a, b) => a.Ticketnum.localeCompare(b.Ticketnum));
                setStateSort(false)
            } else {
                data.sort((a, b) => b.Ticketnum.localeCompare(a.Ticketnum));
                setStateSort(true)
            }

            return data;
        };

        // tính tổng trọng lượng và tong so phieu
        const TotalWeight = (item) => {
            if (!item || !Array.isArray(item) || item.length === 0) {
                return { totalWeight: 0, countWeight: 0 };
            }

            let totalWeight = 0;
            let countWeight = 0;

            item.forEach((items) => {
                totalWeight += items.Netweight;
                countWeight += 1;
            });
            return { totalWeight, countWeight };
        };

        // ham tim kiem
        const handleSearch = () => {
            if (searchTerm) {
                const filtered = weight.filter(item =>
                    item.Ticketnum.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setWeight(filtered);
            } else {
                setWeight(filteredData);
            }
        };

        return (
            <ScrollView>
                {weight === null ? <ActivityIndicator /> : <>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10, marginBottom: 2 }}>
                        <View style={styles.TitleTotal}>
                            <Text style={{ fontSize: 13, fontWeight: '700', textAlign: 'center' }}>Tổng phiếu</Text>
                            <Text style={{ fontSize: 16, fontWeight: '700', textAlign: 'center', color: 'red' }}>{TotalWeight(weight).countWeight}</Text>
                        </View>

                        <View style={styles.TolalWeight}>
                            <Text style={{ fontSize: 13, fontWeight: '700', textAlign: 'center' }}>Tổng trọng lượng hàng</Text>
                            <Text style={{ fontSize: 16, fontWeight: '700', textAlign: 'center', color: 'red' }}>{formatCurrency(TotalWeight(weight).totalWeight)}</Text>
                        </View>
                    </View>

                    {/* thanh tim kiem */}
                    <View style={{ alignItems: 'center', flexDirection: 'row', height: 55, justifyContent: 'center', marginTop: 5 }}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm kiếm mã phiếu cân ..."
                            value={searchTerm}
                            onChangeText={(text) => setSearchTerm(text)}
                        />

                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <FontAwesome name="search" size={19} color="black" />
                        </TouchableOpacity>

                        {/* reload */}
                        <TouchableOpacity style={[styles.ItemSreach, style = { width: '8%' }]} onPress={() => TrantypeWeight('All')}>
                            <Ionicons name="reload" size={16} color="black" />
                        </TouchableOpacity>

                        {/* sap xep */}
                        <TouchableOpacity style={[styles.ItemSreach, style = { width: '6%' }]} onPress={() => sortWeight(weight)}>
                            <FontAwesome name="sort" size={16} color="black" />
                        </TouchableOpacity>

                        {/* excel */}
                        <TouchableOpacity style={{ width: '8%', marginLeft: 5 }} onPress={exportToXLSX}>
                            <MaterialCommunityIcons name="microsoft-excel" size={27} color="green" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 10, marginBottom: 10 }}>
                        {/* combo box hàng hóa */}
                        <View style={{ width: '45%' }}>
                            <Dropdown
                                style={[styles.dropdown, isFocusItem && { borderColor: 'blue' }]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={product}
                                search
                                maxHeight={300}
                                labelField="ProdName"
                                valueField="ProdCode"
                                placeholder={!isFocusItem ? 'Hàng hóa' : "..."}
                                searchPlaceholder="Tìm kiếm..."
                                value={valueItem}
                                onFocus={() => setIsFocusItem(true)}
                                onBlur={() => setIsFocusItem(false)}
                                onChange={item => {
                                    setValueItem(item.ProdCode);
                                    setWeight(weightItem.filter(data => data.ProdCode === item.ProdCode))
                                    setDataProduct(weightItem.filter(data => data.ProdCode === item.ProdCode))
                                    setIsFocusItem(false);
                                }}
                            />
                        </View>

                        <TouchableOpacity style={{
                            backgroundColor: 'white',
                            borderColor: selectedType === 'In' ? 'red' : 'black',
                            borderWidth: selectedType === 'In' ? 1.5 : 0.5,
                            padding: 5, width: '25%', borderRadius: 5,
                            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 7,
                        }}
                            onPress={() => TrantypeWeight('In')}>
                            <Text style={{ textAlign: 'center', fontSize: 13 }}>Phiếu nhập</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            backgroundColor: 'white',
                            borderColor: selectedType === 'Out' ? 'red' : 'black',
                            borderWidth: selectedType === 'Out' ? 1.5 : 0.5,
                            padding: 5, width: '25%', borderRadius: 5,
                            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 7,
                        }}
                            onPress={() => TrantypeWeight('Out')}>
                            <Text style={{ textAlign: 'center', fontSize: 13 }}>Phiếu xuất</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        {weight.length > 0 ? (weight.map((w, index) => (
                            <View key={w.id} style={{ marginHorizontal: 5 }} >
                                <TouchableOpacity style={styles.WeightItem} onPress={() => goToWeightDetail(w.id)} key={w.id}>
                                    <View style={{ flexDirection: 'row', marginLeft: 7 }}>
                                        <Text style={{ fontSize: 14 }}>Mã phiếu:</Text>
                                        <Text style={{ fontSize: 14, paddingLeft: 10, fontWeight: '700' }}>{w.Ticketnum}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 2, marginLeft: 7 }}>
                                        <Text style={{ fontSize: 14 }}>Ngày cân:</Text>
                                        <Text style={{ fontSize: 14, paddingLeft: 10, fontWeight: '700' }}>{moment(w.date_time).utcOffset(7).format('DD/MM/YYYY HH:mm:ss')}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 2, marginLeft: 7 }}>
                                        <Text style={{ fontSize: 14 }}>Trọng lượng thực:</Text>
                                        <Text style={{ fontSize: 14, paddingLeft: 10, color: 'red', fontWeight: '700' }}>{formatCurrency(w.Netweight)}</Text>
                                    </View>
                                </TouchableOpacity>

                                <LinearGradient
                                    colors={['#00FF7F', '#008B00']}
                                    start={[0, 0]}
                                    end={[0, 1]}
                                    style={{
                                        width: '4%',
                                        borderTopLeftRadius: 10,
                                        borderBottomLeftRadius: 10,
                                        margin: 5,
                                        height: 86,
                                        position: 'absolute',
                                        top: 0,
                                        left: 3
                                    }}
                                >
                                    <View></View>
                                </LinearGradient>
                            </View>
                        ))
                        ) : (
                            <Text style={{ textAlign: 'center', fontSize: 14 }}>Không có dữ liệu phiếu cân !!</Text>
                        )}
                    </ScrollView>
                </>}
            </ScrollView >
        )
    }

    // giao dien + chuc nang tab thong ke chung
    const GeneralCustomer = () => {
        const formatDate = (day, month, year) => {
            return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
        };

        const ItemCustomer = ({ item }) => {
            return (
                <View style={{ marginHorizontal: 15, marginVertical: 2, padding: 8 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome name="square" size={12} color="green" />
                            <Text style={{ fontSize: 14, marginLeft: 5 }}>Mã hàng hóa: </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: 'red' }}>{item.code}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginLeft: 14 }}>
                            <Text style={{ fontSize: 14, marginVertical: 2 }}>Tên hàng hóa: </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700' }}>{item.nameProd}</Text>
                        </View>
                    </View>

                    <View style={{ marginHorizontal: '10%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, marginVertical: 2 }}>Tổng phiếu: </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700' }}>{item.count}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, marginVertical: 2 }}>Tổng trọng lượng: </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700' }}>{formatCurrency(item.total)}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, marginVertical: 2 }}>Tổng phiếu nhập: </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700' }}>{item.phieuNhap}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, marginVertical: 2 }}>Tổng trọng lượng nhập: </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700' }}>{formatCurrency(item.totalNhap)}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 14, marginVertical: 2 }}>Tổng phiếu xuất: </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700' }}>{item.phieuXuat}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, marginVertical: 2 }}>Tổng trọng lượng xuất: </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700' }}>{formatCurrency(item.totalXuat)}</Text>
                        </View>
                    </View>

                </View>
            )
        }

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                {/* thong tin khach hang */}
                <View style={{ padding: 10, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 14 }}>Ngày: </Text>
                        <Text style={{ fontSize: 14, fontWeight: '700' }}>{formatDate(day, month, year)}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                        <Text style={{ fontSize: 14 }}>Mã khách hàng: </Text>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: 'red' }}>{custCode}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 3 }}>
                        <Text style={{ fontSize: 14 }}>Tên khách hàng: </Text>
                        <Text style={{ fontSize: 14, fontWeight: '700' }}>{custName}</Text>
                    </View>
                </View>

                {/* duong gach ngang */}
                <View style={{ borderWidth: 0.5, width: '60%', marginHorizontal: '20%', marginVertical: 5 }}></View>

                {/* thong tin tung san pham khach hang do da mua */}
                <FlatList
                    data={Object.values(groups)}
                    keyExtractor={(item) => item.code}
                    renderItem={ItemCustomer}
                />
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Tab.Navigator>
                    <Tab.Screen name="GeneralCustomer" component={GeneralCustomer} options={{ title: 'Thống kê chung' }} />
                    <Tab.Screen name="WeightCustomerDetail" component={WeightCustomerDetail} options={{ title: 'Phiếu cân chi tiết' }} />
                </Tab.Navigator>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    WeightItem: {
        backgroundColor: 'white',
        height: 86,
        paddingVertical: 5,
        paddingLeft: 25,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        width: '94%',
        marginLeft: 10,
        marginVertical: 5,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    },

    TitleTotal: {
        backgroundColor: 'white',
        padding: 5,
        height: 60,
        width: '33%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    },

    TolalWeight: {
        backgroundColor: 'white',
        padding: 5,
        height: 60,
        width: '62%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    },

    selectedItem: {
        backgroundColor: 'lightblue',
    },

    ItemSreach: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        height: 30,
        borderRadius: 5,
        marginLeft: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    },

    searchButton: {
        width: '8%',
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 5,
        height: 30,
        marginLeft: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    },

    searchInput: {
        backgroundColor: 'white',
        height: 33,
        fontSize: 13,
        width: '55%',
        borderColor: 'gray',
        borderWidth: 1,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 5
    },

    dropdown: {
        backgroundColor: 'white',
        height: 35,
        fontSize: 12,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
    },

    placeholderStyle: {
        fontSize: 12,
    },

    selectedTextStyle: {
        fontSize: 11,
    },

    iconStyle: {
        width: 20,
        height: 20,
    },

    inputSearchStyle: {
        height: 35,
        fontSize: 12,
    },
})