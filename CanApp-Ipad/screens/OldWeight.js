import { useNavigation } from '@react-navigation/native';
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import RadioButton from '../components/RadioButton';

export default OldWeight = () => {
    const [searchText, setSearchText] = useState('');
    const navigation = useNavigation();

    const handleSearch = () => {
        const keyword = searchText
        navigation.navigate("SearchString", {keyword})
    };

    return (
        <View style={{ flex: 1 }}>
            {/* <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                <TextInput style={styles.Input}
                    placeholder="Tên sản phẩm hoặc tên khách hàng"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <TouchableOpacity onPress={handleSearch}>
                    <AntDesign name="search1" size={30} color="black" style={{ marginLeft: 5 }} />
                </TouchableOpacity>
            </View> */}

            <RadioButton />
        </View>
    )
}

const styles = StyleSheet.create({
    Input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        fontSize: 15,
        padding: 5,
        width: '90%'
    },
})

