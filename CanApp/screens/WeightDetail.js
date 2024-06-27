import { FontAwesome, FontAwesome6, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import Api, { endpoints } from '../configs/Api';

export default WeightDetail = ({ route }) => {
    const [weight, setWeight] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const { weightId } = route.params;
    const [scale, setScale] = useState(null)

    const loadWeightDetail = async () => {
        try {
            let res = await Api.get(endpoints['weight'](weightId));
            setWeight(res.data)
            loadScale(res.data.CanId);
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    }

    const loadScale = async (canId) => {
        try {
            let scales = await Api.get(endpoints['scales'](canId))
            setScale(scales.data)
        } catch (ex) {
            console.error(ex);
        }
    }

    useEffect(() => {
        loadWeightDetail();
    }, [weightId]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadWeightDetail();
    };

    const formatCurrency = (value) => {
        // Lấy phần nguyên của giá trị
        const intValue = parseInt(value);

        // Định dạng số tiền với dấu phân cách hàng nghìn
        return intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    return (
        <ScrollView style={{ flex: 1 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
        >
            {weight === null ? <ActivityIndicator /> : <>
                {/* thong tin phieu can */}
                <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 25 }}>
                    <FontAwesome name="tags" size={22} color="blue" />
                    <Text style={{ fontSize: 18, fontWeight: '800', marginLeft: 4, color: 'blue' }}>Thông tin phiếu cân</Text>
                </View>

                <View style={styles.ItemTime}>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <MaterialCommunityIcons name="card-text" size={24} color="black" />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Mã phiếu:</Text>
                        <Text style={{ fontSize: 17, fontWeight: '700', color: 'red', marginLeft: 10, borderBottomWidth: 1, width: '60%', borderBottomColor: '#777777' }}>{weight.Ticketnum}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <MaterialCommunityIcons name="card-text" size={24} color="black" />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Số chứng từ:</Text>
                        <Text style={{ fontSize: 17, fontWeight: '700', marginLeft: 10, borderBottomWidth: 1, width: '55%', borderBottomColor: '#777777' }}>{weight.Docnum}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <MaterialCommunityIcons name="truck" size={24} color="black" />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Số xe:</Text>
                        <Text style={{ fontSize: 17, fontWeight: '700', marginLeft: 10, borderBottomWidth: 1, width: '72%', borderBottomColor: '#777777' }}>{weight.Truckno}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <MaterialCommunityIcons name="card-text" size={24} color="black" />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Loại phiếu:</Text>
                        <Text style={{ fontSize: 17, fontWeight: '700', marginLeft: 10, borderBottomWidth: 1, width: '60%', borderBottomColor: '#777777' }}>{weight.Trantype}</Text>
                    </View>

                    {scale === null ? <ActivityIndicator /> : <>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <FontAwesome6 name="weight-scale" size={24} color="black" />
                            <Text style={{ fontSize: 17, marginLeft: 5 }}>Cân:</Text>
                            <Text style={{ fontSize: 17, fontWeight: '700', marginLeft: 10, borderBottomWidth: 1, width: '73%', borderBottomColor: '#777777' }}>{scale.ScaleName}</Text>
                        </View>
                    </>}

                    <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
                        <MaterialIcons name="date-range" size={24} color="black" />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Ngày tạo phiếu:</Text>
                        <Text style={{ fontSize: 17, fontWeight: '700', marginLeft: 10, borderBottomWidth: 1, width: '50%', borderBottomColor: '#777777' }}>{moment(weight.date_time).utcOffset(7).format('DD/MM/YYYY HH:mm:ss')}</Text>
                    </View>
                </View>

                {/* ngay gio ra vao */}
                <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 25 }}>
                    <FontAwesome name="tags" size={22} color="blue" />
                    <Text style={{ fontSize: 18, fontWeight: '800', marginLeft: 4, color: 'blue' }}>Thông tin ngày giờ ra vào</Text>
                </View>

                <View style={styles.ItemTime}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 17 }}>Ngày giờ vào:</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <MaterialIcons name="date-range" size={24} color="black" />
                            <Text style={{ fontSize: 17, fontWeight: '700', marginLeft: 5, borderBottomWidth: 1, borderBottomColor: '#777777' }}>{moment(weight.Date_in).utcOffset(7).format('DD/MM/YYYY')}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <MaterialIcons name="access-time" size={24} color="black" />
                            <Text style={{ fontSize: 17, fontWeight: '700', marginLeft: 5, borderBottomWidth: 1, borderBottomColor: '#777777' }}>{moment(weight.time_in, 'HH:mm:ss.SSSSSS').format('HH:mm:ss')}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ fontSize: 17 }}>Ngày giờ ra: </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <MaterialIcons name="date-range" size={24} color="black" />
                            <Text style={{ fontSize: 17, fontWeight: '700', marginLeft: 5, borderBottomWidth: 1, borderBottomColor: '#777777' }}>{moment(weight.Date_out).utcOffset(7).format('DD/MM/YYYY')}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <MaterialIcons name="access-time" size={24} color="black" />
                            <Text style={{ fontSize: 17, fontWeight: '700', marginLeft: 5, borderBottomWidth: 1, borderBottomColor: '#777777' }}>{moment(weight.time_out, 'HH:mm:ss.SSSSSS').format('HH:mm:ss')}</Text>
                        </View>
                    </View>
                </View>

                {/* thong tin trong luong */}
                <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 25 }}>
                    <FontAwesome name="tags" size={22} color="blue" />
                    <Text style={{ fontSize: 18, fontWeight: '800', marginLeft: 4, color: 'blue' }}>Thông tin trọng lượng</Text>
                </View>

                <View style={styles.ItemTime}>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <MaterialCommunityIcons name="card-text" size={24} color="black" />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Trọng lượng cân lần 1:</Text>
                        <Text style={{ fontSize: 18, fontWeight: '700', marginLeft: 10, borderBottomWidth: 1, width: '40%', borderBottomColor: '#777777' }}>{formatCurrency(weight.Firstweight)}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <MaterialCommunityIcons name="card-text" size={24} color="black" />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Trọng lượng cân lần 2:</Text>
                        <Text style={{ fontSize: 18, fontWeight: '700', marginLeft: 10, borderBottomWidth: 1, width: '40%', borderBottomColor: '#777777' }}>{formatCurrency(weight.Secondweight)}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
                        <MaterialCommunityIcons name="card-text" size={24} color="black" />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Trọng lượng thực:</Text>
                        <Text style={{ fontSize: 18, fontWeight: '700', marginLeft: 10, borderBottomWidth: 1, width: '50%', borderBottomColor: '#777777' }}>{formatCurrency(weight.Netweight)}</Text>
                    </View>
                </View>

                {/* thong tin hang hoa */}
                <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 25 }}>
                    <FontAwesome name="tags" size={22} color="blue" />
                    <Text style={{ fontSize: 18, fontWeight: '800', marginLeft: 4, color: 'blue' }}>Thông tin hàng hóa</Text>
                </View>

                <View style={styles.ItemTime}>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <MaterialCommunityIcons name="card-text" size={24} color="black" />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Mã hàng hóa:</Text>
                        <Text style={{ fontSize: 17, fontWeight: '700', marginLeft: 10, borderBottomWidth: 1, width: '52%', borderBottomColor: '#777777' }}>{weight.Prodcode.ProdCode}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
                        <MaterialCommunityIcons name="card-text" size={24} color="black" />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Tên hàng hóa:</Text>
                        <Text style={{ fontSize: 17, fontWeight: '700', marginLeft: 10, borderBottomWidth: 1, width: '50%', borderBottomColor: '#777777' }}>{weight.ProdName}</Text>
                    </View>
                </View>

                {/* thong tin khach hang */}
                <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 25 }}>
                    <FontAwesome name="tags" size={22} color="blue" />
                    <Text style={{ fontSize: 18, fontWeight: '800', marginLeft: 4, color: 'blue' }}>Thông tin khách hàng</Text>
                </View>

                <View style={styles.ItemTime}>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <MaterialCommunityIcons name="card-text" size={24} color="black" />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Mã khách hàng:</Text>
                        <Text style={{ fontSize: 17, fontWeight: '700', marginLeft: 10, borderBottomWidth: 1, width: '52%', borderBottomColor: '#777777' }}>{weight.Custcode.Custcode}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
                        <MaterialCommunityIcons name="card-text" size={24} color="black" />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Tên khách hàng:</Text>
                        <Text style={{ fontSize: 17, fontWeight: '700', marginLeft: 10, borderBottomWidth: 1, width: '50%', borderBottomColor: '#777777' }}>{weight.CustName}</Text>
                    </View>
                </View>

                {/* thong tin ghi chu */}
                <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: 25 }}>
                    <FontAwesome name="tags" size={22} color="blue" />
                    <Text style={{ fontSize: 18, fontWeight: '800', marginLeft: 4, color: 'blue' }}>Thông tin ghi chú</Text>
                </View>

                <View style={[styles.ItemTime, style = { marginBottom: 20 }]}>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <SimpleLineIcons name="note" size={24} color="black" />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Ghi chú:</Text>
                        <Text style={{ fontSize: 17, fontWeight: '700', marginLeft: 10, width: '70%', flexWrap: 'wrap' }}>{weight.Note}</Text>
                    </View>
                </View>
            </>}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    ItemTime: {
        padding: 15,
        borderWidth: 1,
        backgroundColor: 'white',
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
    }
})