import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Api, { endpoints } from "../configs/Api";

export default WeightChartMonth = ({ route, navigation }) => {
    const [weight, setWeight] = useState(null)
    const { month, scaleId } = route.params;
    const [trantype, setTrantype] = useState(3);
    const [stateSort, setStateSort] = useState(true)
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        const loadData = async (trantype) => {
            try {
                let res = await Api.get(endpoints['weightDetailMonth'](month, trantype, scaleId));
                setWeight(res.data)
            } catch (ex) {
                console.error(ex);
            }
        }

        loadData(trantype)
    }, [month, trantype, scaleId])

    // hàm để phân cách giữa hàng ngàn với hàng khác
    const formatCurrency = (value) => {
        // Lấy phần nguyên của giá trị
        const intValue = parseInt(value);

        // Định dạng số tiền với dấu phân cách hàng nghìn
        return intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    //  hàm hiện thị nút đang hoạt động (tô màu nút đã chọn)
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        if (option === 'option1') {
            setTrantype(3);
        } else if (option === 'option2') {
            setTrantype(1);
        } else if (option === 'option3') {
            setTrantype(2);
        }
    };

    // hàm sắp xếp các phiếu cân
    const sortWeight = (data) => {
        if (stateSort === true) {
            data.sort((a, b) => a.phieuCan.MaPhieu.localeCompare(b.phieuCan.MaPhieu));
            setStateSort(false)
        } else {
            data.sort((a, b) => b.phieuCan.MaPhieu.localeCompare(a.phieuCan.MaPhieu));
            setStateSort(true)
        }

        return data;
    };

    // link đến phiếu cân chi tiết
    const goToWeightDetail = (weightId) => {
        navigation.navigate("WeightDetail", { "weightId": weightId })
    }

    // tính tổng trọng lượng
    const TotalWeight = (item) => {
        let totalWeight = 0;
        let countWeight = 0;
        item.forEach((items) => {
            totalWeight += items.phieuCan.TLHang;
            countWeight += 1;
        });
        return { totalWeight, countWeight };
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            {weight === null ? <ActivityIndicator /> : <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10, marginBottom: 2 }}>
                    <View style={styles.TitleTotal}>
                        <Text style={{ fontSize: 17, fontWeight: '700', textAlign: 'center' }}>Tổng phiếu</Text>
                        <Text style={{ fontSize: 28, fontWeight: '700', textAlign: 'center', color: 'red' }}>{TotalWeight(weight.PhieuCan).countWeight}</Text>
                    </View>

                    <View style={styles.TolalWeight}>
                        <Text style={{ fontSize: 17, fontWeight: '700', textAlign: 'center' }}>Tổng trọng lượng hàng</Text>
                        <Text style={{ fontSize: 28, fontWeight: '700', textAlign: 'center', color: 'red' }}>{formatCurrency(TotalWeight(weight.PhieuCan).totalWeight)}</Text>
                    </View>
                </View>

                <View style={{ height: 55 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                        <TouchableOpacity style={[styles.ItemSreach, style = { width: '16%' }, selectedOption === 'option1' && styles.selectedItem]} onPress={() => handleOptionSelect('option1')}>
                            <Text style={{ marginRight: 5, textAlign: 'center', fontSize: 15 }}>Tất cả</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.ItemSreach, style = { width: '25%' }, selectedOption === 'option2' && styles.selectedItem]} onPress={() => handleOptionSelect('option2')}>
                            <Text style={{ marginRight: 5, textAlign: 'center', fontSize: 15 }}>Nhập hàng</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.ItemSreach, style = { width: '24%' }, selectedOption === 'option3' && styles.selectedItem]} onPress={() => handleOptionSelect('option3')}>
                            <Text style={{ marginRight: 5, textAlign: 'center', fontSize: 15 }}>Xuất hàng</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.ItemSreach, style = { width: '22%' }]} onPress={() => sortWeight(weight.PhieuCan)}>
                            <Text style={{ marginRight: 8, textAlign: 'center', fontSize: 15 }}>sắp xếp</Text>
                            <FontAwesome name="sort" size={18} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                {weight.PhieuCan.length === 0 ? (
                    <Text style={{ fontSize: 17, textAlign: 'center', marginTop: 10 }}>Không có phiếu cân</Text>
                ) : (weight && weight.PhieuCan.map((item, index) => (
                    <View key={item.phieuCan.key}>
                        <TouchableOpacity style={styles.ItemWeight} onPress={() => goToWeightDetail(item.phieuCan.key)}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 17 }}>Mã phiếu: </Text>
                                <Text style={{ fontSize: 17, marginLeft: 5, fontWeight: '800' }}>{item.phieuCan.MaPhieu}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                <Text style={{ fontSize: 17 }}>Trọng lượng thực: </Text>
                                <Text style={{ fontSize: 17, marginLeft: 5, fontWeight: '800', color: 'red' }}>{formatCurrency(item.phieuCan.TLHang)}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                <Text style={{ fontSize: 17 }}>Ngày tạo phiếu: </Text>
                                <Text style={{ fontSize: 17, marginLeft: 5, fontWeight: '700' }}>{moment(item.phieuCan.NgayTaoPhieu).utcOffset(7).format('DD/MM/YYYY HH:mm:ss')}</Text>
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
                                height: 97,
                                position: 'absolute',
                                top: 0,
                                left: 5
                            }}
                        >
                            <View></View>
                        </LinearGradient>
                    </View>
                ))
                )}

            </>}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    ItemWeight: {
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

    ItemTitle: {
        backgroundColor: 'white',
        height: 100,
        padding: 15,
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

    selectedItem: {
        backgroundColor: 'lightblue',
    },
})