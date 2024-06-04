import { LinearGradient } from "expo-linear-gradient";
import moment from 'moment';
import 'moment/locale/vi';
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import Api, { endpoints } from "../configs/Api";


export default Weight = ({ route }) => {
    const [weight, setWeight] = useState(null)
    const [countWeight, setCountWeight] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const { scaleId } = route.params;

    const loadWeightDetail = async () => {
        try {
            let res = await Api.get(endpoints['weight-detail'](scaleId));
            setWeight(res.data)
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    }


    const loadCountWeight = async () => {
        try {
            let res = await Api.get(endpoints['SumCountWeightToday'](scaleId));
            setCountWeight(res.data)
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    }


    useEffect(() => {
        loadCountWeight();
        loadWeightDetail();
    }, [scaleId]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadCountWeight();
        loadWeightDetail();
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20, marginBottom: 20 }}>
                    {countWeight === null ? <ActivityIndicator /> : <>
                        <View style={styles.TitleTotal}>
                            <Text style={{ fontSize: 16, fontWeight: '700' }}>Tổng số phiếu cân</Text>
                            <Text style={{ fontSize: 35, fontWeight: '700', textAlign: 'center', color: 'red' }}>{countWeight.count}</Text>
                        </View>

                        <View style={styles.TolalWeight}>
                            <Text style={{ fontSize: 16, fontWeight: '700', textAlign: 'center' }}>Tổng trọng lượng hàng</Text>
                            <Text style={{ fontSize: 30, fontWeight: '700', textAlign: 'center', color: 'red' }}>{countWeight.TLHang !== null ? countWeight.TLHang : 0}</Text>
                        </View>

                    </>}
                </View>

                <ScrollView>
                    {weight === null ? <ActivityIndicator /> : <>
                        {weight.map(w => (
                            <View key={w.id}>
                                <View style={styles.WeightItem}>
                                    <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 7 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '700' }}>Mã phiếu cân:</Text>
                                        <Text style={{ fontSize: 16, paddingLeft: 10 }}>{w.MaPhieu}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 7 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '700' }}>Ngày cân:</Text>
                                        <Text style={{ fontSize: 16, paddingLeft: 10 }}>{moment(w.NgayTao).utcOffset(7).format('DD/MM/YYYY HH:mm:ss')}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginLeft: 7 }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '700' }}>Tổng:</Text>
                                            <Text style={{ fontSize: 17, paddingLeft: 10, color: 'red' }}>{w.TLTong}</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '700' }}>Bì:</Text>
                                            <Text style={{ fontSize: 17, paddingLeft: 10, color: 'red' }}>{w.TLBi}</Text>
                                        </View>

                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '700' }}>Hàng:</Text>
                                            <Text style={{ fontSize: 17, paddingLeft: 10, color: 'red' }}>{w.TLHang}</Text>
                                        </View>
                                    </View>
                                </View>

                                <LinearGradient
                                    colors={['#00FF7F', '#008B00']}
                                    start={[0, 0]}
                                    end={[0, 1]}
                                    style={{
                                        padding: 5,
                                        height: 50,
                                        width: '2%',
                                        borderTopLeftRadius: 10,
                                        borderBottomLeftRadius: 10,
                                        margin: 10,
                                        height: 110,
                                        position: 'absolute',
                                        top: 0
                                    }}
                                >
                                    <View></View>
                                </LinearGradient>
                            </View>
                        ))}
                    </>}
                </ScrollView>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    WeightItem: {
        backgroundColor: 'white',
        height: 110,
        width: '95%',
        padding: 10,
        borderRadius: 10,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    },

    TitleTotal: {
        backgroundColor: 'white',
        padding: 10,
        height: 90,
        width: '39%',
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
        height: 90,
        width: '55%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    }
});