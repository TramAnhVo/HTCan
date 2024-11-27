import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DatePickers from '../components/DatePickers';
import FromDate from '../components/FromDate';
import ExportExcel from './ExportExcel';
import FromDateCustomer from './FromDateCustomer';
import FromDateProduct from './FromDateProduct';

export default RadioButton = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isHidden, setIsHidden] = useState(true);

    const handleOptionSelect = (option) => {
        if (selectedOption !== option) {
            setSelectedOption(option);
            setIsHidden(false);
        } else {
            setSelectedOption(null);
            setIsHidden(true);
        }
    };

    return (
        <View style={{ flexDirection: 'column', marginTop: 10 }}>
            {/* chọn khách hàng */}
            <TouchableOpacity onPress={() => handleOptionSelect('option1')} style={styles.Item}>
                <Text style={{ fontSize: 14, marginRight: 8 }}>Tìm kiếm theo khách hàng</Text>
                {selectedOption === 'option1' ? (
                    <MaterialCommunityIcons name="circle-slice-8" size={18} color="black" />
                ) : (
                    <FontAwesome name="circle-o" size={18} color="black" />
                )}
            </TouchableOpacity>
            {selectedOption === 'option1' && !isHidden && (
                <View style={[styles.ItemBackground, style = { height: 310 }]}>
                    <FromDateCustomer />
                </View>
            )}

            {/* chọn hàng hóa */}
            <TouchableOpacity onPress={() => handleOptionSelect('option2')} style={styles.Item}>
                <Text style={{ fontSize: 14, marginRight: 8 }}>Tìm kiếm theo hàng hóa</Text>
                {selectedOption === 'option2' ? (
                    <MaterialCommunityIcons name="circle-slice-8" size={18} color="black" />
                ) : (
                    <FontAwesome name="circle-o" size={18} color="black" />
                )}
            </TouchableOpacity>
            {selectedOption === 'option2' && !isHidden && (
                <View style={[styles.ItemBackground, style = { height: 310 }]}>
                    <FromDateProduct />
                </View>
            )}

            {/* chọn ngày cụ thể */}
            <TouchableOpacity onPress={() => handleOptionSelect('option3')} style={styles.Item}>
                <Text style={{ fontSize: 14, marginRight: 8 }}>Tìm kiếm theo ngày cụ thể</Text>
                {selectedOption === 'option3' ? (
                    <MaterialCommunityIcons name="circle-slice-8" size={18} color="black" />
                ) : (
                    <FontAwesome name="circle-o" size={18} color="black" />
                )}
            </TouchableOpacity>
            {selectedOption === 'option3' && !isHidden && (
                <View style={[styles.ItemBackground, style = { height: 60 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, marginRight: 10 }}>Chọn ngày cần xem:</Text>
                        <DatePickers />
                    </View>
                </View>
            )}

            {/* chọn ngày đến ngày khác */}
            <TouchableOpacity onPress={() => handleOptionSelect('option6')} style={styles.Item}>
                <Text style={{ fontSize: 14, marginRight: 8 }}>Tìm kiếm tổng hợp</Text>
                {selectedOption === 'option6' ? (
                    <MaterialCommunityIcons name="circle-slice-8" size={18} color="black" />
                ) : (
                    <FontAwesome name="circle-o" size={18} color="black" />
                )}
            </TouchableOpacity>
            {selectedOption === 'option6' && !isHidden && (
                <View style={[styles.ItemBackground, style = { height: 350 }]}>
                    <FromDate />
                </View>
            )}

            {/* xuất file excel */}
            <TouchableOpacity onPress={() => handleOptionSelect('option7')} style={styles.Item}>
                <Text style={{ fontSize: 14, marginRight: 8 }}>Xuất và chia sẻ File Excel</Text>
                {selectedOption === 'option7' ? (
                    <MaterialCommunityIcons name="circle-slice-8" size={18} color="black" />
                ) : (
                    <FontAwesome name="circle-o" size={18} color="black" />
                )}
            </TouchableOpacity>
            {selectedOption === 'option7' && !isHidden && (
                <View style={[styles.ItemBackground, style = { height: 320 }]}>
                    <ExportExcel />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    Item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        borderColor: 'gray',
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },

    ItemBackground: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 15,
        marginRight: 15,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: 'gray',
    },
})