import moment from "moment";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import Api, { endpoints } from "../configs/Api";

export default SearchString = ({ route }) => {
    const [weight, setWeight] = useState(null)
    const { keyword } = route.params;

    useEffect(() => {
        const loadData = async () => {
            let url = endpoints['weights'];
    
            if (keyword !== null && keyword !== '') {
                url = `${url}?q=${keyword}`;
            }
    
            try {
                let res = await Api.get(url);
                setWeight(res.data);
                console.log(res.data)
            } catch (ex) {
                console.error(ex);
            }
        };

        loadData()
    }, []);

    if (weight === null) 
        <Text>Không có phiếu cân</Text>

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'lightblue' }}>
            {weight === null ? <ActivityIndicator /> : <>
                    {weight.map( w => (
                    <View style={styles.ItemWeight} key={w.id}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 17 }}>Mã phiếu: </Text>
                                <Text style={{ fontSize: 17, marginLeft: 5, fontWeight: '800', color: 'red' }}>{w.MaPhieu}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontSize: 17 }}>Ngày tạo phiếu: </Text>
                            <Text style={{ fontSize: 17, marginLeft: 5, fontWeight: '700' }}>{moment(w.NgayTao).utcOffset(7).format('DD/MM/YYYY HH:mm:ss')}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 17 }}>Tổng: </Text>
                                <Text style={{ fontSize: 17, marginLeft: 5, fontWeight: '800', color: 'red' }}>{w.TLTong}</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 17 }}>Bì: </Text>
                                <Text style={{ fontSize: 17, marginLeft: 5, fontWeight: '800', color: 'red' }}>{w.TLBi}</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 17 }}>Hàng: </Text>
                                <Text style={{ fontSize: 17, marginLeft: 5, fontWeight: '800', color: 'red' }}>{w.TLHang}</Text>
                            </View>
                        </View>
                    </View>
                ))}
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