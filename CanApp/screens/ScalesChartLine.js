import { Fontisto, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Api, { endpoints } from '../configs/Api';
import MyContext from '../configs/MyContext';

export default ScalesChartLine = ({ navigation }) => {
    const [scales, setScales] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const [user, dispatch] = useContext(MyContext);

    const loadScales = async () => {
        try {
            let res = await Api.get(endpoints['scale'](user.id));
            setScales(res.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    }

    const handleRefresh = () => {
        setRefreshing(true);
        loadScales();
    };

    useEffect(() => {
        loadScales();
    }, [])

    const goToScaleDetail = (scaleId) => {
        navigation.navigate("ChartLine", { "scaleId": scaleId })
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
        >
            {scales === null ? <ActivityIndicator /> : <>
                {scales.map(s => (
                    <View key={s.id}>
                        <TouchableOpacity style={styles.ScalesItem} onPress={() => goToScaleDetail(s.id)}>
                            <View style={{ flexDirection: 'row', marginBottom: 10, marginLeft: 5 }}>
                                <Ionicons name="scale" size={20} color="black" style={{ paddingRight: 5 }} />
                                <Text style={{ paddingRight: 10, fontSize: 16, fontWeight: '700' }}>Tên cân:</Text>
                                <Text style={{ fontSize: 16 }}>{s.TenCan}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                                <Fontisto name="date" size={20} color="black" style={{ paddingRight: 5 }} />
                                <Text style={{ paddingRight: 10, fontSize: 16, fontWeight: '700' }}>Ngày thiết lập:</Text>
                                <Text style={{ fontSize: 16 }}>{moment(s.NgayTao, 'YYYY-MM-DD').format('DD/MM/YYYY')}</Text>
                            </View>
                        </TouchableOpacity>

                        <LinearGradient
                            colors={['#00FF7F', '#008B00']}
                            start={[0, 0]}
                            end={[0, 1]}
                            style={{
                                padding: 5,
                                height: 50,
                                width: '4%',
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10,
                                margin: 10,
                                height: 100,
                                position: 'absolute',
                                top: 3
                            }}
                        >
                            <View></View>
                        </LinearGradient>
                    </View>
                ))}
            </>}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    ScalesItem: {
        height: 100,
        backgroundColor: 'white',
        margin: 13,
        padding: 20,
        borderRadius: 10,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    },
});