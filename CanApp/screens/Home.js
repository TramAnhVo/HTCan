import { AntDesign, FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomeCarousel from '../components/CustomeCarousel';

export default Home = ({ navigation }) => {
    const data = [
        {
            image: require('../images/can.png')
        },
        {
            image: require('../images/can1.png')
        },
        {
            image: require('../images/can2.png')
        },
        {
            image: require('../images/can3.png')
        },
        {
            image: require('../images/can4.png')
        },
        {
            image: require('../images/can5.png')
        }
    ];

    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginTop: 25 }}>
                <CustomeCarousel data={data} />
            </View>

            <View style={{flexDirection: 'row', marginTop: 50, marginLeft: '2%', marginRight: '2%'}}>
                <View style={{width: '50%'}}>
                    <TouchableOpacity style={[styles.MenuItemLeft, style={backgroundColor: '#33CCCC'}]} onPress={() => navigation.navigate("Scales")} >
                        <Text style={{ fontSize: 17, marginRight: 20 }} >Phiếu cân mới</Text>
                        <FontAwesome6 name="weight-scale" size={30} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.MenuItemLeft, style={marginTop: 10, backgroundColor: '#66CC66'}]} onPress={() => navigation.navigate("OldWeight")} >
                        <Text style={{ fontSize: 17, marginRight: 20 }} >Phiếu cân cũ</Text>
                        <AntDesign name="carryout" size={30} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={{width: '50%'}}>
                    <TouchableOpacity style={[styles.MenuItemRight, style={backgroundColor: '#33CCCC'}]} onPress={() => navigation.navigate("Chart")}>
                        <Text style={{ fontSize: 17, marginLeft: 20 }} >Thống kê</Text>
                        <FontAwesome name="bar-chart" size={30} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.MenuItemRight, style={marginTop: 10, backgroundColor: '#66CC66'}]} onPress={() => navigation.navigate("Account")}>
                        <Text style={{ fontSize: 17, marginLeft: 20 }} >Tài khoản</Text>
                        <Ionicons name="person-sharp" size={30} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
        height: 80, 
        justifyContent:'center', 
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
        // backgroundColor: 'lightblue', 
        alignItems: 'center', 
        height: 80, 
        justifyContent:'center', 
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    }
});