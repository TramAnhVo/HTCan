import { FontAwesome, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomeCarousel from '../components/CustomeCarousel';

export default Home = ({navigation}) => {
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

            <View style={{ margin: 20, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <TouchableOpacity style={{ padding: 20, alignItems: 'center' }} onPress={() => navigation.navigate("Scales")}>
                    <FontAwesome6 name="weight-scale" size={30} color="black" />
                    <Text style={{ paddingTop: 5, fontSize: 16 }}>Cân</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ padding: 20, alignItems: 'center' }}>
                <FontAwesome name="bar-chart" size={30} color="black" />
                    <Text style={{ paddingTop: 5, fontSize: 16 }}>Thống kê</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ padding: 20, alignItems: 'center' }}>
                    <MaterialCommunityIcons name="account" size={30} color="black" />
                    <Text style={{ paddingTop: 5, fontSize: 16 }}>Tài khoản</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    carouselContainer: {
        marginTop: '20%'
    }
});