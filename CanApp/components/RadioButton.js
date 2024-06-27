import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ComboxCategory from '../components/ComboxCategory';
import ComboxItem from '../components/ComboxItem';
import ComboxMonth from '../components/ComboxMonth';
import DatePickers from '../components/DatePickers';
import FromDate from '../components/FromDate';

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
            {/* chọn tháng năm */}
            <TouchableOpacity onPress={() => handleOptionSelect('option1')} style={styles.Item}>
                <Text style={{ fontSize: 17, marginRight: 8 }}>Chọn tháng năm</Text>
                {selectedOption === 'option1' ? (
                    <MaterialCommunityIcons name="circle-slice-8" size={24} color="black" />
                ) : (
                    <FontAwesome name="circle-o" size={24} color="black" />
                )}
            </TouchableOpacity>
            {selectedOption === 'option1' && !isHidden && (
                <View style={[styles.ItemBackground, style = { height: 140 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ComboxMonth />
                    </View>
                </View>
            )}

            {/* chọn mốc thời gian */}
            <TouchableOpacity onPress={() => handleOptionSelect('option2')} style={styles.Item}>
                <Text style={{ fontSize: 17, marginRight: 8 }}>Chọn mốc thời gian</Text>
                {selectedOption === 'option2' ? (
                    <MaterialCommunityIcons name="circle-slice-8" size={24} color="black" />
                ) : (
                    <FontAwesome name="circle-o" size={24} color="black" />
                )}
            </TouchableOpacity>
            {selectedOption === 'option2' && !isHidden && (
                <View style={[styles.ItemBackground, style = { height: 100 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 17 }}>Mốc thời gian:</Text>
                        <ComboxItem />
                    </View>
                </View>
            )}

            {/* chọn ngày cụ thể */}
            <TouchableOpacity onPress={() => handleOptionSelect('option3')} style={styles.Item}>
                <Text style={{ fontSize: 17, marginRight: 8 }}>Chọn ngày cụ thể</Text>
                {selectedOption === 'option3' ? (
                    <MaterialCommunityIcons name="circle-slice-8" size={24} color="black" />
                ) : (
                    <FontAwesome name="circle-o" size={24} color="black" />
                )}
            </TouchableOpacity>
            {selectedOption === 'option3' && !isHidden && (
                <View style={[styles.ItemBackground, style = { height: 60 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 17, marginRight: 10 }}>Chọn ngày cần xem:</Text>
                        <DatePickers />
                    </View>
                </View>

            )}

            {/* chọn ngày đến ngày */}
            <TouchableOpacity onPress={() => handleOptionSelect('option5')} style={styles.Item}>
                <Text style={{ fontSize: 17, marginRight: 8 }}>Chọn từ ngày đến ngày</Text>
                {selectedOption === 'option5' ? (
                    <MaterialCommunityIcons name="circle-slice-8" size={24} color="black" />
                ) : (
                    <FontAwesome name="circle-o" size={24} color="black" />
                )}
            </TouchableOpacity>
            {selectedOption === 'option5' && !isHidden && (
                <View style={[styles.ItemBackground, style = { height: 130 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FromDate />
                    </View>
                </View>
            )}

            {/* chọn loại phiếu */}
            <TouchableOpacity onPress={() => handleOptionSelect('option4')} style={styles.Item}>
                <Text style={{ fontSize: 17, marginRight: 8 }}>Chọn loại phiếu cân</Text>
                {selectedOption === 'option4' ? (
                    <MaterialCommunityIcons name="circle-slice-8" size={24} color="black" />
                ) : (
                    <FontAwesome name="circle-o" size={24} color="black" />
                )}
            </TouchableOpacity>
            {selectedOption === 'option4' && !isHidden && (
                <View style={[styles.ItemBackground, style = { height: 100 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 17 }}>Mốc loại phiếu cân:</Text>
                        <ComboxCategory />
                    </View>
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