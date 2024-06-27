import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import moment from 'moment';
import 'moment/locale/vi';
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Api, { endpoints } from "../configs/Api";


export default Weight = ({ route, navigation }) => {
    const [weight, setWeight] = useState(null)
    const [weightCopy, setWeightCopy] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const { scaleId } = route.params;
    const [selectedOption, setSelectedOption] = useState(null);
    const [stateSort, setStateSort] = useState(true)

    const loadWeightDetail = async () => {
        try {
            let res = await Api.get(endpoints['weight-detail'](scaleId));
            setWeight(res.data)
            setWeightCopy(res.data)
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadWeightDetail();
    }, [scaleId]);

    const handleRefresh = () => {
        setRefreshing(true);
        setSelectedOption('option1')
        loadWeightDetail();
    };

    const goToWeightDetail = (weightId) => {
        navigation.navigate("WeightDetail", { "weightId": weightId })
    }

    const formatCurrency = (value) => {
        // Lấy phần nguyên của giá trị
        const intValue = parseInt(value);

        // Định dạng số tiền với dấu phân cách hàng nghìn
        return intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // tính tổng trọng lượng
    const TotalWeight = (item) => {
        let totalWeight = 0;
        let countWeight = 0;

        item.forEach((items) => {
            totalWeight += items.Netweight;
            countWeight += 1;
        });
        return { totalWeight, countWeight };
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

    // các phiếu cân kiểu nhập hàng
    const TrantypeInWeight = (item) => {
        let countIn = 0;
        let newData = [];

        item.forEach((items) => {
            if (items.Trantype == "Nhập hàng") {
                newData.push(items);
                countIn += 1;
            } 
        })
        setWeight(newData)
    }

    // các phiếu cân kiểu xuất hàng 
    const TrantypeOutWeight = (item) => {
        let countOut = 0;
        let newData = [];

        item.forEach((items) => {
            if (items.Trantype == "Xuất hàng") {
                newData.push(items);
                countOut += 1;
            } 
        })
        setWeight(newData)
    }

    //  hàm hiện thị nút đang hoạt động (tô màu nút đã chọn)
    const handleOptionSelect = (option, item) => {
        setSelectedOption(option);
        if (option === 'option1') {
            loadWeightDetail();
        } else if (option === 'option2') {
            TrantypeInWeight(item)
        } else if (option === 'option3') {
            TrantypeOutWeight(item)
        }
    };

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
        >
            <View style={{ flex: 1 }}>
                {weight === null ? <ActivityIndicator /> : <>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10, marginBottom: 2 }}>
                        <View style={styles.TitleTotal}>
                            <Text style={{ fontSize: 17, fontWeight: '700', textAlign: 'center' }}>Tổng phiếu</Text>
                            <Text style={{ fontSize: 28, fontWeight: '700', textAlign: 'center', color: 'red' }}>{TotalWeight(weight).countWeight}</Text>
                        </View>

                        <View style={styles.TolalWeight}>
                            <Text style={{ fontSize: 17, fontWeight: '700', textAlign: 'center' }}>Tổng trọng lượng hàng</Text>
                            <Text style={{ fontSize: 28, fontWeight: '700', textAlign: 'center', color: 'red' }}>{formatCurrency(TotalWeight(weight).totalWeight)}</Text>
                        </View>
                    </View>

                    <View style={{ height: 55 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                            <TouchableOpacity style={[styles.ItemSreach, style = { width: '16%' }, selectedOption === 'option1' && styles.selectedItem]} onPress={() => handleOptionSelect('option1', '')}>
                                <Text style={{ marginRight: 5, textAlign: 'center', fontSize: 15 }}>Tất cả</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.ItemSreach, style = { width: '25%' }, selectedOption === 'option2' && styles.selectedItem,]} onPress={() => handleOptionSelect('option2', weightCopy)}>
                                <Text style={{ marginRight: 5, textAlign: 'center', fontSize: 15 }}>Nhập hàng</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.ItemSreach, style = { width: '24%' }, selectedOption === 'option3' && styles.selectedItem,]} onPress={() => handleOptionSelect('option3', weightCopy)}>
                                <Text style={{ marginRight: 5, textAlign: 'center', fontSize: 15 }}>Xuất hàng</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.ItemSreach, style = { width: '22%' }]} onPress={() => sortWeight(weight)}>
                                <Text style={{ marginRight: 8, textAlign: 'center', fontSize: 15 }}>sắp xếp</Text>
                                <FontAwesome name="sort" size={18} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView>
                        {weight.map(w => (
                            <View key={w.id} >
                                <TouchableOpacity style={styles.WeightItem} onPress={() => goToWeightDetail(w.id)} key={w.id}>
                                    <View style={{ flexDirection: 'row', marginLeft: 7 }}>
                                        <Text style={{ fontSize: 16 }}>Mã phiếu:</Text>
                                        <Text style={{ fontSize: 17, paddingLeft: 10, fontWeight: '700' }}>{w.Ticketnum}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 7 }}>
                                        <Text style={{ fontSize: 16 }}>Ngày cân:</Text>
                                        <Text style={{ fontSize: 17, paddingLeft: 10, fontWeight: '700' }}>{moment(w.date_time).utcOffset(7).format('DD/MM/YYYY HH:mm:ss')}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 7 }}>
                                        <Text style={{ fontSize: 16 }}>Trọng lượng thực:</Text>
                                        <Text style={{ fontSize: 17, paddingLeft: 10, color: 'red', fontWeight: '700' }}>{formatCurrency(w.Netweight)}</Text>
                                    </View>
                                </TouchableOpacity>

                                <LinearGradient
                                    colors={['#00FF7F', '#008B00']}
                                    start={[0, 0]}
                                    end={[0, 1]}
                                    style={{
                                        width: '3%',
                                        borderTopLeftRadius: 10,
                                        borderBottomLeftRadius: 10,
                                        margin: 5,
                                        height: 97,
                                        position: 'absolute',
                                        top: 0,
                                        left: 3
                                    }}
                                >
                                    <View></View>
                                </LinearGradient>
                            </View>
                        ))}
                    </ScrollView>
                </>}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    WeightItem: {
        backgroundColor: 'white',
        height: 97,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 25,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        width: '95%',
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    },

    TitleTotal: {
        backgroundColor: 'white',
        padding: 10,
        height: 80,
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
        padding: 10,
        height: 80,
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
});