import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Api, { endpoints } from "../configs/Api";


export default ChartLine = ({ route, navigation }) => {
    const [month, setMonth] = useState(null)
    const [count, setCount] = useState(null)
    const [data, setData] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const { scaleId } = route.params;

    const loadStatsMonth = async () => {
        try {
            let res = await Api.get(endpoints['StatsWeightMonth'](scaleId));
            setMonth(res.data.map(item => item.month))
            setCount(res.data.map(item => item.count));
            setData(res.data)
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadStatsMonth();
    }, [scaleId]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadStatsMonth();
    };

    if (month === null || count === null) {
        return <ActivityIndicator />;
    }

    const formatCurrency = (value) => {
        // Lấy phần nguyên của giá trị
        const intValue = parseInt(value);

        // Định dạng số tiền với dấu phân cách hàng nghìn
        return intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const goToWeightDetail = (month) => {
        navigation.navigate("WeightChartMonth", { "month": month, "scaleId": scaleId })
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
            style={{ backgroundColor: 'white' }}
        >
            <LineChart
                data={{
                    labels: month,
                    datasets: [{
                        data: count
                    }]
                }}

                width={Dimensions.get("window").width} // from react-native
                height={250}
                yAxisLabel=""
                yAxisSuffix=""
                yAxisInterval={1} // optional, defaults to 1

                chartConfig={{
                    // pha mau 
                    backgroundColor: "#FFFFFF", //mau nen chinh
                    backgroundGradientFrom: "#FFFFFF", // mau nen dau tien
                    backgroundGradientTo: "#FFFFFF", // mau nen cuoi cung

                    decimalPlaces: 0, // số chữ số thập phân sau dấu phẩy ( mặc định là 2)

                    color: (opacity = 1) => `rgba(255, 48, 48, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

                    style: {
                        borderRadius: 10,
                        marginRight: 10
                    },
                    propsForDots: {
                        r: "5",
                        strokeWidth: "1",
                        stroke: "#990000",
                    }
                }}

                bezier
                // style tong cua toan bo bieu do
                style={{
                    borderRadius: 16,
                    marginTop: 10,
                    margin: 5,
                }}
            />

            <ScrollView>
                {data === null ? <ActivityIndicator /> : <>
                    {data.map(m => (
                        <TouchableOpacity style={styles.ItemMonth} key={m.month} onPress={() => goToWeightDetail(m.month)}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: 'blue', fontSize: 18, fontWeight: '800', alignItems: 'center' }}>Tháng {m.month}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 3 }}>
                                <Text style={{ fontSize: 16 }}>Tổng số phiếu cân: </Text>
                                <Text style={{ fontSize: 18, color: 'green', paddingLeft: 5, fontWeight: '700', color:'red' }}>{m.count}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 2 }}>
                                <Text style={{ fontSize: 16 }}>Tổng trọng lượng hàng: </Text>
                                <Text style={{ fontSize: 18, color: 'green', paddingLeft: 5, fontWeight: '700' }}>{formatCurrency(m.sum)}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </>}
            </ScrollView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    ItemMonth: {
        backgroundColor: 'white',
        width: '93%',
        height: 100,
        borderRadius: 20,
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 25,
        paddingRight: 25,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 13,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 7,
    }
})