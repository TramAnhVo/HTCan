import { AntDesign, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomeCarousel from "../components/CustomeCarousel";
import Api, { endpoints } from "../configs/Api";

export default Home = ({ navigation }) => {
    const [data, setData] = useState([]); // Khởi tạo state để lưu dữ liệu
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            let res = await Api.get(endpoints['image']);
            const images = res.data.map(image => ({
                image: image.image_url // Thay đổi theo thuộc tính thực tế của hình ảnh
            }));
            setData(images);
        } catch (ex) {
            console.error(ex);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData(); // Gọi loadData khi component mount
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        loadData();
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
            {data.length > 0 && (
                <View>
                    <CustomeCarousel data={data} />
                </View>
            )}

            {/* menu chinh trong trang chu */}
            <View style={{ flexDirection: 'row', marginTop: 15, marginLeft: '2%', marginRight: '2%', marginBottom: 50 }}>
                <View style={{ width: '50%' }}>
                    <TouchableOpacity style={[styles.MenuItemLeft, style = { backgroundColor: '#33CCCC' }]} onPress={() => navigation.navigate("Scales")} >
                        <Text style={{ fontSize: 18, marginRight: 8 }} >Phiếu cân mới</Text>
                        <FontAwesome6 name="weight-scale" size={30} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.MenuItemLeft, style = { marginTop: 10, backgroundColor: '#66CC66' }]} onPress={() => navigation.navigate("OldWeight")} >
                        <Text style={{ fontSize: 18, marginRight: 8 }} >Phiếu cân cũ</Text>
                        <AntDesign name="carryout" size={30} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={{ width: '50%' }}>
                    <TouchableOpacity style={[styles.MenuItemRight, style = { backgroundColor: '#33CCCC' }]} onPress={() => navigation.navigate("Chart")}>
                        <Text style={{ fontSize: 18, marginLeft: 8 }} >Thống kê</Text>
                        <FontAwesome name="bar-chart" size={30} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.MenuItemRight, style = { marginTop: 10, backgroundColor: '#66CC66' }]} onPress={() => navigation.navigate("Account")}>
                        <Text style={{ fontSize: 18, marginLeft: 8 }} >Tài khoản</Text>
                        <Ionicons name="person-sharp" size={30} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    carouselContainer: {
        marginTop: '20%'
    },

    MenuItemLeft: {
        flexDirection: 'row',
        backgroundColor: 'lightblue',
        alignItems: 'center',
        height: 85,
        justifyContent: 'center',
        borderRadius: 20,
        marginRight: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    },

    MenuItemRight: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        height: 85,
        justifyContent: 'center',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    }
});