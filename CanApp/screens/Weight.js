import { FontAwesome } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import moment from 'moment';
import 'moment/locale/vi';
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as XLSX from 'xlsx';
import Api, { endpoints } from "../configs/Api";

export default Weight = ({ route, navigation }) => {
    const [weight, setWeight] = useState([])
    const [weightItem, setWeightItem] = useState([])

    const [refreshing, setRefreshing] = useState(true);
    const { day, month, year, scaleId } = route.params;

    const [stateSort, setStateSort] = useState(true)
    const [selectedType, setSelectedType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const loadWeightDetail = async () => {
        try {
            let res = await Api.get(endpoints['WeightWeekDetail'](year, month, day, scaleId));
            setWeight(res.data)
            setWeightItem(res.data)
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadWeightDetail();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        setSelectedType('all')
        loadWeightDetail();
    };

    const goToWeightDetail = (weightId) => {
        navigation.navigate("WeightDetail", { "weightId": weightId })
    }

    // ham chuyen doi thap phan
    const formatCurrency = (value) => {
        // Lấy phần nguyên của giá trị
        const intValue = parseInt(value);

        // Định dạng số tiền với dấu phân cách hàng nghìn
        return intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

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

    // Hàm chuyển đổi định dạng ngày
    // const formatDate = (dateString) => {
    //     const [year, month, day] = dateString.split('-');
    //     return `${day}/${month}/${year}`; // Định dạng DD/MM/YYYY
    // };
    const formatDate = (dateString) => {
        if (!dateString) return ''; // Kiểm tra nếu dateString là undefined hoặc null
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`; // Định dạng DD/MM/YYYY
    };

    // Hàm chuyển đổi định dạng giờ
    // const formatTime = (timeString) => {
    //     return timeString.split('.')[0]; // Lấy phần trước dấu '.'
    // };
    const formatTime = (timeString) => {
        if (!timeString) return ''; // Kiểm tra nếu timeString là undefined hoặc null
        return timeString.split('.')[0]; // Lấy phần trước dấu '.'
    };

    // xuat ra file excel
    const exportToXLSX = async () => {
        try {
            const formattedData = weightItem.map(item => {
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
            const filename = FileSystem.documentDirectory + "Data_" + day + "_" + month + "_" + year + ".xlsx";
            FileSystem.writeAsStringAsync(filename, base64, {
                encoding: FileSystem.EncodingType.Base64
            }).then(() => {
                Sharing.shareAsync(filename);
            });
        } catch (error) {
            console.error('Lỗi khi xuất file:', error);
        }
    }

    // nut tinh phieu xuat nhap + reset
    const TrantypeWeight = (option) => {
        let countOut = 0;
        let countIn = 0;
        let newDataIn = [];
        let newDataOut = [];
        setSelectedType(option); // Cập nhật state khi nút được nhấn

        weightItem.forEach((items) => {
            if (items.Trantype == "Nhập hàng") {
                newDataIn.push(items);
                countIn += 1;
            }
            else {
                newDataOut.push(items);
                countOut += 1;
            }
        })

        if (option === 'In') {
            setWeight(newDataIn)
        }
        else {
            if (option === 'Out') {
                setWeight(newDataOut)
            }
            else {
                if (option === 'All') {
                    setWeight(weightItem)
                }
            }
        }
    }

    // tinh tong phieu + tong trong luong hang
    const GeneralValue = (item) => {
        let totalWeight = 0;
        let countWeight = 0;

        item.forEach((items) => {
            totalWeight += items.Netweight;
            countWeight += 1;
        });
        return { totalWeight, countWeight };
    }

    // ham tim kiem
    const handleSearch = () => {
        if (searchTerm) {
            const filtered = weightItem.filter(item =>
                item.Ticketnum.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setWeight(filtered);
        } else {
            setWeight(weightItem);
        }
    };

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }>
            <View style={{ flex: 1 }}>
                {weight === null ? <ActivityIndicator /> : <>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10, marginBottom: 2 }}>
                        <View style={styles.TitleTotal}>
                            <Text style={{ fontSize: 13, fontWeight: '500', textAlign: 'center' }}>Tổng phiếu</Text>
                            <Text style={{ fontSize: 16, fontWeight: '700', textAlign: 'center', color: 'red' }}>{GeneralValue(weight).countWeight}</Text>
                        </View>

                        <View style={styles.TolalWeight}>
                            <Text style={{ fontSize: 13, fontWeight: '500', textAlign: 'center' }}>Tổng trọng lượng hàng</Text>
                            <Text style={{ fontSize: 16, fontWeight: '700', textAlign: 'center', color: 'red' }}>{formatCurrency(GeneralValue(weight).totalWeight)}</Text>
                        </View>
                    </View>

                    {/* thanh tìm kiếm tên khách hàng */}
                    <View style={{
                        alignItems: 'center', marginHorizontal: '2%', flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'space-between', marginTop: 5, marginBottom: 10
                    }}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm kiếm mã phiếu cân ..."
                            value={searchTerm}
                            onChangeText={(text) => setSearchTerm(text)}
                        />

                        {/* onPress={handleSearch} */}
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <Text style={{ color: 'white', fontSize: 13, textAlign: 'center' }}>Tìm</Text>
                        </TouchableOpacity>

                        {/* sap xep */}
                        <TouchableOpacity style={{ padding: 5, borderWidth: 1, marginLeft: 10, borderRadius: 5 }}
                            onPress={() => sortWeight(weight)}>
                            <FontAwesome name="sort" size={18} color="black" style={{ textAlign: 'center' }} />
                        </TouchableOpacity>

                        {/* reload */}
                        <TouchableOpacity style={{ padding: 5, borderWidth: 1, marginLeft: 5, borderRadius: 5 }}
                            onPress={() => TrantypeWeight('All')}>
                            <Ionicons name="reload" size={18} color="black" />
                        </TouchableOpacity>
                    </View>
                    
                    {/* dang lỗi chưa có thay đổi màu trên nút bấm */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: '2%', alignItems: 'center', marginBottom: 7 }}>
                        {/* phieu nhap */}
                        <TouchableOpacity style={{
                            backgroundColor: 'white',
                            borderColor: selectedType === 'In' ? 'red' : 'black',
                            borderWidth: selectedType === 'In' ? 1.5 : 0.5,
                            padding: 5, width: '42%', borderRadius: 5, flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'center'
                        }}
                            onPress={() => TrantypeWeight('In')}>
                            <FontAwesome name="square" size={15} color="#1E90FF" />
                            <Text style={{ textAlign: 'center', marginLeft: 5, fontWeight: '700', fontSize: 13 }}>Phiếu nhập</Text>
                        </TouchableOpacity>

                        {/* phieu xuat*/}
                        <TouchableOpacity style={{
                            backgroundColor: 'white',
                            borderColor: selectedType === 'Out' ? 'red' : 'black',
                            borderWidth: selectedType === 'Out' ? 1.5 : 0.5,
                            padding: 5, width: '42%', borderRadius: 5, flexDirection: 'row',
                            alignItems: 'center', justifyContent: 'center'
                        }}
                            onPress={() => TrantypeWeight('Out')}>
                            <FontAwesome name="square" size={15} color="#40E0D0" />
                            <Text style={{ textAlign: 'center', marginLeft: 5, fontWeight: '700' , fontSize: 13 }}>Phiếu xuất</Text>
                        </TouchableOpacity>

                        {/* xuat excel */}
                        <TouchableOpacity style={styles.buttonExcel} onPress={exportToXLSX}>
                            <MaterialCommunityIcons name="microsoft-excel" size={30} color="green" style={{ textAlign: 'center' }} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        {weight.length > 0 ? (weight.map((item, index) => (
                            <View key={item.key} >
                                <TouchableOpacity style={styles.WeightItem} onPress={() => goToWeightDetail(item.key)}>
                                    <View style={{ flexDirection: 'row', marginLeft: 7 }}>
                                        <Text style={{ fontSize: 13 }}>Mã phiếu:</Text>
                                        <Text style={{ fontSize: 13, paddingLeft: 10, fontWeight: '700' }}>{item.Ticketnum}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 2, marginLeft: 7 }}>
                                        <Text style={{ fontSize: 13 }}>Ngày cân:</Text>
                                        <Text style={{ fontSize: 13, paddingLeft: 10, fontWeight: '700' }}>{moment(item.date_time).utcOffset(7).format('DD/MM/YYYY HH:mm:ss')}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 2, marginLeft: 7 }}>
                                        <Text style={{ fontSize: 13 }}>Trọng lượng thực:</Text>
                                        <Text style={{ fontSize: 13, paddingLeft: 10, color: 'red', fontWeight: '700' }}>{formatCurrency(item.Netweight
                                        )}</Text>
                                    </View>
                                </TouchableOpacity>

                                <LinearGradient
                                    colors={selectedType === 'In' ? ['#87CEFA', '#1E90FF'] :
                                        selectedType === 'Out' ? ['#7FFFD4', '#40E0D0'] : ['#00FF7F', '#008B00']} // Thay đổi màu gradient
                                    start={[0, 0]}
                                    end={[0, 1]}
                                    style={{
                                        width: '4%',
                                        borderTopLeftRadius: 10,
                                        borderBottomLeftRadius: 10,
                                        margin: 2,
                                        height: 80,
                                        position: 'absolute',
                                        top: 2,
                                        left: 8
                                    }}
                                >
                                    <View></View>
                                </LinearGradient>
                            </View>
                        ))
                        ) : (
                            <Text style={{ textAlign: 'center', fontSize: 14 }}>Không có dữ liệu phiếu cân !!</Text> // Hiển thị thông báo nếu không có dữ liệu
                        )}
                    </ScrollView>
                </>}
            </View>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    WeightItem: {
        backgroundColor: 'white',
        height: 80,
        paddingVertical: 5,
        paddingLeft: 25,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        width: '95%',
        marginLeft: 10,
        marginVertical: 4,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    },

    TitleTotal: {
        backgroundColor: 'white',
        paddingVertical: 10,
        height: 65,
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
        paddingVertical: 10,
        height: 65,
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
        padding: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    },

    searchButton: {
        width: '15%',
        padding: 5,
        backgroundColor: 'green',
        borderRadius: 5,
        height: 32,
        marginLeft: 5
    },

    searchInput: {
        backgroundColor: 'white',
        height: 37,
        width: '75%',
        fontSize: 13,
        borderColor: 'gray',
        flex: 1,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5
    },

    buttonExcel: {
        width: '10%',
        flexDirection: 'row',
        alignItems: 'center'
    },

    buttonGroup: {

    }
});