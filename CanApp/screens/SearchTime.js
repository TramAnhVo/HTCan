import moment from "moment";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import Api, { endpoints } from "../configs/Api";

export default SearchTime = ({ route }) => {
    const [weight, setWeight] = useState(null)
    const { time } = route.params;

    useEffect(() => {
        const loadData = async () => {
            let res = await Api.get(endpoints["SreachForTime"](time));
            setWeight(res.data)
        }

        loadData();
    }, [time])

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'lightblue' }}>
            {weight === null ? <ActivityIndicator /> : <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 5, marginRight: 5, marginBottom: 10, marginTop: 10 }}>
                    <View style={[styles.ItemTitle, style = { width: '60%' }]}>
                        <Text style={{ fontWeight: '700', textAlign: 'center', fontSize: 17 }}>Tổng trọng lượng hàng</Text>
                        <Text style={{ color: 'green', fontSize: 35, textAlign: 'center', fontWeight: '700' }}>{weight.TongHang}</Text>
                    </View>

                    <View style={[styles.ItemTitle, style = { width: '39%' }]}>
                        <Text style={{ fontWeight: '700', textAlign: 'center', fontSize: 16 }}>Tổng số phiếu</Text>
                        <Text style={{ color: 'green', fontSize: 35, textAlign: 'center', fontWeight: '700' }}>{weight.TongSoPhieu}</Text>
                    </View>
                </View>

                {weight.PhieuCan.length === 0 ? (
                    <Text style={{ textAlign: 'center' }}>Không có phiếu cân</Text>
                ) : (weight && weight.PhieuCan.map((item, index) => (
                    <View style={styles.ItemWeight} key={index}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17 }}>Tên cân: </Text>
                            <Text style={{ fontSize: 17, marginLeft: 5 }}>{item.phieuCan.Can.name}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontSize: 17 }}>Mã phiếu: </Text>
                            <Text style={{ fontSize: 17, marginLeft: 5, fontWeight: '800', color: 'red' }}>{item.phieuCan.MaPhieu}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontSize: 17 }}>Ngày tạo phiếu: </Text>
                            <Text style={{ fontSize: 17, marginLeft: 5, fontWeight: '700' }}>{moment(item.phieuCan.NgayTao).utcOffset(7).format('DD/MM/YYYY HH:mm:ss')}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 17 }}>Tổng: </Text>
                                <Text style={{ fontSize: 17, marginLeft: 5, fontWeight: '800', color: 'red' }}>{item.phieuCan.TLTong}</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 17 }}>Bì: </Text>
                                <Text style={{ fontSize: 17, marginLeft: 5, fontWeight: '800', color: 'red' }}>{item.phieuCan.TLBi}</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 17 }}>Hàng: </Text>
                                <Text style={{ fontSize: 17, marginLeft: 5, fontWeight: '800', color: 'red' }}>{item.phieuCan.TLHang}</Text>
                            </View>
                        </View>
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
        height: 120,
        padding: 15,
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
    }
})