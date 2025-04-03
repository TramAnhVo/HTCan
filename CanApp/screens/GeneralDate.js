import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import CarouselWeight from "../components/CarouselWeight";
import Api, { endpoints } from "../configs/Api";

export default GeneralDate = ({ route }) => {
    const [groups, setGroups] = useState('');
    const [loading, setLoading] = useState(true);
    const { yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, value } = route.params;

    const fetchData = async () => {
        try {
            const response = await Api.get(endpoints['GeneralFromDate'](yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, value));
            setGroups(response.data.days);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Kết thúc loading trong finally
        }
    };

    useEffect(() => {
        fetchData();
    }, [yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo, value]);

    const formatDate = (day, month, year) => {
        return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (groups.length > 0 && (
                <View style={{ flex: 1 }}>
                    <View style={styles.barTime}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: 'white' }}>Từ ngày </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: 'white' }}>{formatDate(dayFrom, monthFrom, yearFrom)} </Text>
                        </View>

                        <AntDesign name="arrowright" size={18} color="white" />

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: 'white' }}>Đến ngày </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: 'white' }}>{formatDate(dayTo, monthTo, yearTo)} </Text>
                        </View>
                    </View>

                    <CarouselWeight
                        data={groups}
                        canId={value}
                    />
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8E8E8',
    },

    searchButton: {
        width: '20%',
        padding: 5,
        backgroundColor: 'green',
        borderRadius: 5,
        height: 30,
        marginLeft: 5
    },

    barTime: {
        flexDirection: 'row', 
        justifyContent: 'space-evenly', 
        backgroundColor: '#009966', 
        padding: 12, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    }
});