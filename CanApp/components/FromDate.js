import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const FromDate = () => {
    const [fromDateVisible, setFromDateVisible] = useState(false)
    const [toDateVisible, setToDateVisible] = useState(false)

    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const navigation = useNavigation();

    const showFromDate = () => {
        setFromDateVisible(true);
    };

    const showToDate = () => {
        setToDateVisible(true);
    };

    const hideFromDate = () => {
        setFromDateVisible(false);
    };

    const hideToDate = () => {
        setToDateVisible(false);
    };

    const handleConfirm = () => {
        const yearFrom = fromDate.getFullYear();
        const monthFrom = fromDate.getMonth() + 1;
        const dayFrom = fromDate.getDate();

        const yearTo = toDate.getFullYear();
        const monthTo = toDate.getMonth() + 1;
        const dayTo = toDate.getDate();

        navigation.navigate('SearchFromTime', { yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo });
    };

    const handleConfirmFromDate = (date) => {
        setFromDate(date);
        hideFromDate();
    };

    const handleConfirmToDate = (date) => {
        setToDate(date);
        hideToDate();
    };

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <Text style={{ fontSize: 17, marginRight: 15 }}>Từ ngày:</Text>
                <Text style={{ borderWidth: 1, padding: 8, borderRadius: 8, fontSize: 17, marginRight: 8, width: 120, height: 40, textAlign: 'center' }}>
                    {fromDate.getDate().toString().padStart(2, '0')}-{(fromDate.getMonth() + 1).toString().padStart(2, '0')}-{fromDate.getFullYear()}
                </Text>

                <TouchableOpacity onPress={showFromDate} >
                    <FontAwesome name="calendar" size={30} color="black" />
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={fromDateVisible}
                    mode="date"
                    onConfirm={handleConfirmFromDate}
                    onCancel={hideFromDate}
                />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
                    <Text style={{ fontSize: 17, marginRight: 5 }}>Đến ngày:</Text>
                    <Text style={{ borderWidth: 1, padding: 8, borderRadius: 8, fontSize: 17, marginRight: 8, width: 120, height: 40, textAlign: 'center' }}>
                        {toDate.getDate().toString().padStart(2, '0')}-{(toDate.getMonth() + 1).toString().padStart(2, '0')}-{toDate.getFullYear()}
                    </Text>

                    <TouchableOpacity onPress={showToDate} >
                        <FontAwesome name="calendar" size={30} color="black" />
                    </TouchableOpacity>

                    <DateTimePickerModal
                        isVisible={toDateVisible}
                        mode="date"
                        onConfirm={handleConfirmToDate}
                        onCancel={hideToDate}
                    />
                </View>

                <TouchableOpacity style={styles.SreachButton} onPress={handleConfirm}>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 18, fontWeight: '700' }}>Tìm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FromDate;

const styles = StyleSheet.create({
    SreachButton: {
        backgroundColor: '#0099FF',
        height: 40,
        padding: 5,
        borderRadius: 10,
        width: '25%',
        marginLeft: '5%',
        marginTop: 14
    }
})