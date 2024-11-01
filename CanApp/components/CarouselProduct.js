import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import moment from "moment";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

export default CarouselProduct = ({ data, canId}) => {
    const [newData] = useState([{ key: 'spacer-left' }, ...data, { key: 'spacer-right' }])
    const { width } = useWindowDimensions();
    const SIZE = width * 0.93;
    const SPACER = (width - SIZE) / 3;
    const x = useSharedValue(0);
    const navigation = useNavigation();

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

    const goToDetail = (date, prodCode, prodName) => {
        const dateTimeString = date;
        const dateTime = new Date(dateTimeString);

        const year = dateTime.getFullYear();
        const month = dateTime.getMonth() + 1;
        const day = dateTime.getDate();

        navigation.navigate('GeneralProductDetail', { "scaleId": canId, "day": day, "month": month, "year": year, "ProdCode": prodCode, "ProdName": prodName });
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
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={[styles.groupTitle, style = { color: 'red', fontSize: 16 }]}>Mã hàng: {item.code}</Text>
                                    </View>

                                    <Text style={{ fontSize: 15, marginTop: 2 }}>Tên hàng hóa:
                                        <Text style={{ fontWeight: '800', color: '#006633' }}> {item.nameProd}</Text>
                                    </Text>
                                    <Text style={{ fontSize: 15, marginTop: 4 }}>Tổng số phiếu:
                                        <Text style={{ fontWeight: '800', color: '#006633' }}>  {item.count} phiếu</Text>
                                    </Text>
                                    <Text style={{ fontSize: 15, marginTop: 4 }}>Tổng trọng lượng:
                                        <Text style={{ fontWeight: '800', color: '#006633' }}>  {formatCurrency(item.total)}</Text>
                                    </Text>
                                    <Text style={{ fontSize: 15, marginTop: 4 }}>Tổng phiếu nhập:
                                        <Text style={{ fontWeight: '800', color: '#006633' }}>  {item.phieuNhap}</Text>  phiếu
                                    </Text>
                                    <Text style={{ fontSize: 15, marginTop: 4 }}>Tổng phiếu xuất:
                                        <Text style={{ fontWeight: '800', color: '#006633' }}>  {item.phieuXuat}</Text>   phiếu
                                    </Text>
                                </View>

                                <FlatList
                                    data={Object.entries(item.dateGroups)}
                                    keyExtractor={([name]) => name}
                                    renderItem={({ item: [name, dateGroups] }) => (
                                        <View style={{ paddingBottom: 10, paddingTop: 10, paddingHorizontal: 20 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '53%', justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'row-reverse' }}>
                                                    <Text style={[styles.groupTitle, { marginLeft: 5, color: "blue" }]}>Ngày {moment(name, 'YYYY-MM-DD').format('DD/MM/YYYY')}</Text>
                                                    <FontAwesome5 name="calendar-day" size={20} color="blue" />
                                                </View>

                                                <TouchableOpacity style={{ padding: 5, flexDirection: 'row-reverse', alignItems: 'center' }} 
                                                onPress={() => goToDetail(name, item.code, item.nameProd )}>
                                                    <Text style={{ fontSize: 15, fontWeight: '700', color: 'blue', marginLeft: 3 }}>Xem chi tiết</Text>
                                                    <Entypo name="eye" size={20} color="blue" />
                                                </TouchableOpacity>
                                            </View>

                                            <View style={{ width: '52%' }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 15 }}>Tổng phiếu cân: {dateGroups.count}</Text>
                                                    <Text style={{ fontSize: 15 }}>{formatCurrency(dateGroups.total)}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', marginTop: 4, justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 15 }}>Tổng phiếu xuất: {dateGroups.phieuXuat}</Text>
                                                    <Text style={{ fontSize: 15 }}>{formatCurrency(dateGroups.totalOut)}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', marginTop: 4, justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 15 }}>Tổng phiếu nhập: {dateGroups.phieuNhap}</Text>
                                                    <Text style={{ fontSize: 15 }}>{formatCurrency(dateGroups.totalIn)}</Text>
                                                </View>
                                            </View>

                                            {Object.entries(dateGroups.customerGroups).length > 0 ? (
                                                <FlatList
                                                    data={Object.entries(dateGroups.customerGroups)}
                                                    keyExtractor={([name]) => name}
                                                    renderItem={({ item: [name, customerGroups] }) => (
                                                        <View style={{ marginLeft: 20 }}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, alignItems: 'center', width: '50%' }}>
                                                                <View style={{ flexDirection: 'row-reverse' }}>
                                                                    <Text style={[styles.groupTitle, { marginLeft: 5 }]}>{name}</Text>
                                                                    <FontAwesome5 name="user-alt" size={18} color="black" />
                                                                </View>

                                                                <Text style={styles.groupTitle}>{customerGroups.count} phiếu</Text>
                                                            </View>

                                                            <View style={{ width: '50%' }}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 15 }}>Phiếu xuất: {customerGroups.phieuXuat}</Text>
                                                                    <Text style={{ fontSize: 15 }}>{formatCurrency(customerGroups.totalOut)}</Text>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', marginTop: 4, justifyContent: 'space-between' }}>
                                                                    <Text style={{ fontSize: 15 }}>Phiếu nhập: {customerGroups.phieuNhap}</Text>
                                                                    <Text style={{ fontSize: 15 }}>{formatCurrency(customerGroups.totalIn)}</Text>
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

                                            <View style={{ borderBottomWidth: 1, width: '50%', borderBottomColor: '#CCCCCC', paddingTop: 10 }} ></View>
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
        borderRadius: 5,
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
        padding: 12,
        margin: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#D0D0D0'
    }
});