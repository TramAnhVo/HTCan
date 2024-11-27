import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import moment from 'moment';
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

export default CarouselWeight = ({ data, canId }) => {
    const [newData] = useState([{ key: 'spacer-left' }, ...data, { key: 'spacer-right' }])
    const { width } = useWindowDimensions();
    const SIZE = width * 0.93;
    const SPACER = (width - SIZE) / 4;
    const x = useSharedValue(0);
    const navigation = useNavigation();
    const [scaleId, setScaleId] = useState(canId)

    const onScroll = useAnimatedScrollHandler({
        onScroll: event => {
            x.value = event.contentOffset.x;
        },
    });

    const formatCurrency = (value) => {
        // Lấy phần nguyên của giá trị
        const intValue = parseInt(value);

        // Định dạng số tiền với dấu phân cách hàng nghìn
        return intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const WeightDetail = (date) => {
        const dateTimeString = date;
        const dateTime = new Date(dateTimeString);

        const year = dateTime.getFullYear();
        const month = dateTime.getMonth() + 1;
        const day = dateTime.getDate();


        navigation.navigate('GeneralWeightDetail', { "scaleId": scaleId, "day": day, "month": month, "year": year });
    }

    return (
        <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={16}
            snapToInterval={SIZE}
            decelerationRate="fast"
            onScroll={onScroll}
        >
            {newData.map((item, index) => {
                const styleAnimated = useAnimatedStyle(() => {
                    const scale = interpolate(
                        x.value,
                        [(index - 1) * SIZE, (index - 1) * SIZE, index * SIZE],
                        [0.96, 1, 0.96]
                    );
                    return {
                        transform: [{ scale }],
                    }
                });

                if (!item.code) {
                    return <View style={{ width: SPACER }} key={index} />;
                }

                return (
                    <View style={{ width: SIZE }} key={index} >
                        <Animated.View style={[styles.imageContainer, styleAnimated]}>
                            <View style={styles.imageCard}>
                                <View style={styles.borderHeader}>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '51%' }}>
                                        <Text style={[styles.groupTitle, style = { color: 'red', fontSize: 16 }]}>Ngày: {moment(item.code, 'YYYY-MM-DD').format('DD/MM/YYYY')}</Text>
                                        
                                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center'}} onPress={() => WeightDetail(item.code)}>
                                            <Entypo name="eye" size={20} color="blue" />
                                            <Text style={{ fontSize: 15, color: 'blue', fontWeight: '700', marginLeft: 5 }}>Xem chi tiết</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={{ fontSize: 15 }}>Tổng số phiếu:
                                        <Text style={{ fontWeight: '800', color: '#006633' }}>  {item.count_day} phiếu</Text>
                                    </Text>
                                    <Text style={{ fontSize: 15, marginTop: 3 }}>Tổng trọng lượng:
                                        <Text style={{ fontWeight: '800', color: '#006633' }}>  {formatCurrency(item.total_day)}</Text>
                                    </Text>
                                    <Text style={{ fontSize: 15, marginTop: 3 }}>Tổng phiếu nhập:
                                        <Text style={{ fontWeight: '800', color: '#006633' }}>  {item.count_in}</Text>  phiếu
                                    </Text>
                                    <Text style={{ fontSize: 15, marginTop: 3 }}>Tổng phiếu xuất:
                                        <Text style={{ fontWeight: '800', color: '#006633' }}>  {item.count_out}</Text>   phiếu
                                    </Text>
                                </View>

                                <FlatList
                                    data={Object.entries(item.customers)}
                                    keyExtractor={([CustCode]) => CustCode}
                                    renderItem={({ item: [CustCode, customers] }) => (
                                        <View style={{ paddingBottom: 8, paddingTop: 8, paddingHorizontal: 20 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '51%', justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'row-reverse' }}>
                                                    <Text style={[styles.groupTitle, { marginLeft: 5, color: "blue" }]}>{customers.CustName}</Text>
                                                    <Ionicons name="person-circle-sharp" size={23} color="blue" />
                                                </View>
                                                <Text style={[styles.groupTitle, style = { marginLeft: '10%', color: "blue" }]}>{customers.count} phiếu</Text>
                                            </View>

                                            <View style={{ width: '51%' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 15 }}>Tổng phiếu xuất: {customers.count_out}</Text>
                                                    <Text style={{ fontSize: 15, marginLeft: '16%' }}>{formatCurrency(customers.total_out)}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 15 }}>Tổng phiếu nhập: {customers.count_in}</Text>
                                                    <Text style={{ fontSize: 15, marginLeft: '15%' }}>{formatCurrency(customers.total_in)}</Text>
                                                </View>
                                            </View>

                                            {Object.entries(customers.products).length > 0 ? (
                                                <FlatList
                                                    data={Object.entries(customers.products)}
                                                    keyExtractor={([ProdCode]) => ProdCode}
                                                    renderItem={({ item: [ProdCode, products] }) => (
                                                        <View style={{ marginLeft: 15 }}>
                                                            <View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center', width: '51%', justifyContent: 'space-between' }}>
                                                                <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                                                                    <Text style={[styles.groupTitle, { marginLeft: 5 }]}>{products.ProdName}</Text>
                                                                    <Entypo name="box" size={18} color="#006600" />
                                                                </View>
                                                                <Text style={[styles.groupTitle, style = { marginLeft: '15%' }]}>{products.total_records} phiếu</Text>
                                                            </View>

                                                            <View style={{ width: '51%' }}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 15 }}>Phiếu xuất: {products.total_export}</Text>
                                                                    <Text style={{ fontSize: 15, marginLeft: '19%' }}>{formatCurrency(products.total_export_weight)}</Text>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 15 }}>Phiếu nhập: {products.total_import}</Text>
                                                                    <Text style={{ fontSize: 15, marginLeft: '18%' }}>{formatCurrency(products.total_import_weight)}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    )}
                                                />
                                            ) : (
                                                <View>
                                                    <Text>Không có dữ liệu sản phẩm</Text>
                                                </View>
                                            )}

                                            <View style={{ borderBottomWidth: 1, width: '55%', borderBottomColor: '#CCCCCC', paddingTop: 10 }} ></View>
                                        </View>
                                    )}
                                />
                            </View>
                        </Animated.View>
                    </View>
                );
            })}
        </Animated.ScrollView>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        overflow: 'hidden'
    },

    imageCard: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        aspectRatio: 1,
        borderRadius: 5
    },

    itemSeparator: {
        height: 1,
        backgroundColor: 'gray',
    },

    groupContainer: {
        backgroundColor: 'white',
        marginBottom: 10,
        marginVertical: 0,
        marginHorizontal: 0,
    },

    groupTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
    },

    ticketContainer: {
        backgroundColor: '#fff',
        padding: 8,
        marginVertical: 4,
        elevation: 2,
    },

    borderHeader: {
        backgroundColor: 'white',
        borderLeftWidth: 14,
        borderLeftColor: '#3399FF',
        padding: 10,
        margin: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#D0D0D0'
    }
});