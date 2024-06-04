import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import Api, { endpoints } from "../configs/Api";
import MyContext from "../configs/MyContext";

const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    color: (opacity = 1) => `rgba(0, 100, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    decimalPlaces: 0,
    barPercentage: 0.5, //be rong tung cot
    useShadowColorFromDataset: false, // 
};

export default ChartBar = ({ route }) => {
    const [week, setWeek] = useState(null)
    const [data, setData] = useState(null)
    const [count, setCount] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const [user, dispatch] = useContext(MyContext);
    const { scaleId } = route.params;
    const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];

    const handleRefresh = () => {
        setRefreshing(true);
        loadStatsWeek();
    };

    useEffect(() => {
        loadStatsWeek();
    }, [scaleId]);

    const loadStatsWeek = async () => {
        try {
            let res = await Api.get(endpoints['StatsWeightWeek'](scaleId));
            setData(res.data)
            setCount(res.data.map(item => item.count));
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    };

    if (count === null) {
        return <ActivityIndicator />;
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
            style={{ flex: 1, backgroundColor: 'white' }}>
            {/* chart 2 */}
            <View>
                <BarChart
                    data={{
                        labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
                        datasets: [{
                            data: count,
                            colors: [
                                (opacity = 1) => 'green',
                                (opacity = 1) => 'green',
                                (opacity = 1) => 'green',
                                (opacity = 1) => 'green',
                                (opacity = 1) => 'green',
                                (opacity = 1) => 'green',
                                (opacity = 1) => 'green']
                        }]
                    }}

                    // style={graphStyle}
                    width={Dimensions.get("window").width - 5}
                    height={300}
                    yAxisLabel=""
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                    showValuesOnTopOfBars // hien gia tri tren cot
                    showBarTops={false}
                    withCustomBarColorFromData
                    flatColor
                    style={{
                        borderRadius: 5,
                        marginTop: 15
                    }}
                />
            </View>

            {/* gắn weight detail và truyen tham so vao */}
            <ScrollView style={{ backgroundColor: 'white' }}>
                {data === null ? <ActivityIndicator /> : <>
                    {data.map((d, index) => (
                        <View style={{ marginTop: 10, marginBottom: 5 }} key={d.ngay}>
                            <View style={styles.ItemWeek}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                                    <Text style={{ fontSize: 17, fontWeight: '700' }}>{daysOfWeek[index]}</Text>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#006600' }}>{moment(d.ngay, 'YYYY-MM-DD').format('DD/MM/YYYY')}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                                    <Text style={{ fontSize: 15 }}>Tổng số phiếu cân:</Text>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: 'red' }}>{d.count}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 15 }}>Tổng trọng lượng hàng:</Text>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#006600' }}>{d.total_weight}</Text>
                                </View>
                            </View>

                            <LinearGradient
                                colors={['#00FF7F', '#008000']}
                                start={[0, 0]}
                                end={[0, 1]}
                                style={{
                                    padding: 5,
                                    width: '3%',
                                    borderTopLeftRadius: 10,
                                    borderBottomLeftRadius: 10,
                                    marginLeft: 15,
                                    height: 103,
                                    position: 'absolute',
                                    zIndex: 99,
                                    top: 0,
                                    bottom: 0,
                                    left: 2
                                }}
                            >
                                <View></View>
                            </LinearGradient>
                        </View>
                    ))}
                </>}
            </ScrollView>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    ItemWeek: {
        backgroundColor: '#F5F5F5',
        position: 'relative',
        height: 103,
        width: '90%',
        paddingTop: 10,
        paddingRight: 30,
        paddingBottom: 10,
        paddingLeft: 30,
        marginLeft: '5%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    }
})