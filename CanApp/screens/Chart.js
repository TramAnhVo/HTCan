import { AntDesign, FontAwesome } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default Chart = ({navigation}) => {
    return (
        <View style={{ flex: 1 }}>
            <View>
                <TouchableOpacity style={styles.itemView}  onPress={() => navigation.navigate("ScalesChartBar")}>
                    <FontAwesome name="bar-chart" size={30} color="#0066FF" />
                    <Text style={{ fontWeight: '700', fontSize: 16, marginLeft: 8 }}>THỐNG KÊ TUẦN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.itemView} onPress={() => navigation.navigate("ScalesChartLine")} >
                    <AntDesign name="linechart" size={30} color="#0066FF" />
                    <Text style={{ fontWeight: '700', fontSize: 16, marginLeft: 8 }}>THỐNG KÊ THÁNG</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    itemView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: '90%',
        height: 63,
        borderColor: '#CFCFCF',
        borderWidth: 1,
        borderRadius: 25,
        marginTop: 20,
        marginLeft: '5%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 7,
    }
})