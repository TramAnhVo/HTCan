import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

export default ChartBar = ({ route, navigation }) => {
    const [week, setWeek] = useState(null)
    const [data, setData] = useState(null)
    const [count, setCount] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const [user, dispatch] = useContext(MyContext);
    const { scaleId } = route.params;
    const daysOfWeek = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
    const [stateWeek, setStateWek] = useState(0)
    const [selectedOption, setSelectedOption] = useState(null);

    const handleRefresh = () => {
        setRefreshing(true);
        loadStatsWeek();
    };

    useEffect(() => {
        loadStatsWeek(stateWeek);
    }, [scaleId, stateWeek]);

    const loadStatsWeek = async (stateWeek) => {
        try {
            let res = await Api.get(endpoints['StatsWeightWeek'](scaleId, stateWeek));
            setData(res.data)
            setCount(res.data.map(item => item.count));
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    };

    const formatCurrency = (value) => {
        // Lấy phần nguyên của giá trị
        const intValue = parseInt(value);

        // Định dạng số tiền với dấu phân cách hàng nghìn
        return intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const goToWeightDetail = (date) => {
        const keyDate = date
        const d = new Date(keyDate)

        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();

        navigation.navigate("GeneralWeightDetail", {  "scaleId": scaleId, "day": day, "month": month, "year": year})
    }

    if (count === null) {
        return <ActivityIndicator />;
    }

    //  hàm hiện thị nút đang hoạt động (tô màu nút đã chọn)
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        if (option === 'option1') {
            setStateWek(0);
        } else if (option === 'option2') {
            setStateWek(1)
        } else if (option === 'option3') {
            setStateWek(2)
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
            style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
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
                        borderRadius: 5
                    }}
                />
            </View>

            <View style={{ backgroundColor: 'white' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity style={[styles.TagWeek, , selectedOption === 'option1' && styles.selectedItem]} onPress={() => handleOptionSelect('option1')}>
                        <Text style={{ textAlign: 'center', fontSize: 13 }}>Tuần hiện tại</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.TagWeek, , selectedOption === 'option2' && styles.selectedItem]} onPress={() => handleOptionSelect('option2')}>
                        <Text style={{ textAlign: 'center', fontSize: 13 }}>1 tuần trước</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.TagWeek, , selectedOption === 'option3' && styles.selectedItem]} onPress={() => handleOptionSelect('option3')}>
                        <Text style={{ textAlign: 'center', fontSize: 13 }}>2 tuần trước</Text>
                    </TouchableOpacity>
                </View>

                {data === null ? <ActivityIndicator /> : <>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 10, flexWrap: 'wrap', marginLeft: 5 }} >
                        {data.map((d, index) => (
                            <TouchableOpacity key={d.ngay} style={styles.ItemWeek} onPress={() => goToWeightDetail(d.ngay)}>
                                <Text style={styles.textDay}>{daysOfWeek[index]}</Text>
                                <Text style={styles.textDate}>{moment(d.ngay, 'YYYY-MM-DD').format('DD/MM/YYYY')}</Text>

                                <Text style={{ fontSize: 13, fontWeight: '800', color: 'red', textAlign: 'center' }}>{d.count} phiếu</Text>
                                <Text style={{ fontSize: 13, fontWeight: '800', color: '#006600', textAlign: 'center', marginTop: 3 }}>{formatCurrency(d.total_weight)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    ItemWeek: {
        backgroundColor: 'white',
        height: 100,
        width: '30%',
        marginVertical: 5,
        marginHorizontal: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    },

    TagWeek: {
        backgroundColor: 'white',
        width: '28%',
        height: 35,
        paddingTop: 8,
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

    textDay: {
        fontSize: 13,
        fontWeight: '700',
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#3CB371',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingVertical: 2,
        backgroundColor: '#3CB371'
    },

    textDate: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        borderBottomWidth: 1,
        paddingVertical: 2
    }
})