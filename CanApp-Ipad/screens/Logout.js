import { useContext } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MyContext from "../configs/MyContext";


const heightWindow = Dimensions.get("window").height;

const Logout = ({navigation}) => {
    const [user, dispatch] = useContext(MyContext);

    const logout = () => {
        dispatch({
            "type": "logout"
        })
        navigation.navigate("Login")
    }

    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.buttonLogOut} onPress={logout}>
                <Text style={{ fontSize: 14, color: '#333' }}>
                    Đăng xuất
                </Text>
                <MaterialIcons style={{ paddingLeft: 24 }} name='logout' color="black" size={30} />
            </TouchableOpacity>
        </View>
    )
}
export default Logout;
const styles=StyleSheet.create({
    footer: {
        marginTop:0.1*heightWindow,
        width: '100%',
        backgroundColor: '#666',
        height: 0.15 * heightWindow,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonLogOut: {
        flexDirection: 'row',
        height: '40%',
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 8
    }
});