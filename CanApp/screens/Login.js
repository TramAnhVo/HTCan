import { AntDesign, Entypo } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Api, { authApi, endpoints } from '../configs/Api';
import MyConText from '../configs/MyContext';
import { CLIENT_ID, CLIENT_SECRET } from "../utils/key";

const Login = ({ navigation }) => {
    const [user, dispatch] = useContext(MyConText);
    const [loading, setLoading] = useState();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const login = async () => {
        setLoading(true);
        try {
            const { data } = await Api.post(endpoints['login'], {
                "username": username,
                "password": password,
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "grant_type": "password"
            });

            await AsyncStorage.setItem("access-token", data.access_token);
            let user = await authApi(data.access_token).get(endpoints['current-user']);

            if (user.data.state === false) {
                Alert.alert(
                    'Chú ý',
                    'Tài khoản của bạn chưa được kích hoạt',
                    [{ text: 'OK', onPress: () => console.log('OK pressed') }],
                    { cancelable: false }
                );
                return;
            }

            dispatch({
                type: "login",
                payload: user.data
            });

            setPassword(null)
            setUsername(null)

            navigation.navigate("Home")
        } catch (error) {
            Alert.alert(
                'Lỗi',
                'Thông tin tài khoản không đúng',
                [{ text: 'OK', onPress: () => console.log('OK pressed') }],
                { cancelable: false }
            );
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <LinearGradient colors={['#2D99AE', '#764ba2']} style={styles.container}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>Welcome!!</Text>

                <View style={[styles.inputView, styles.inputBorder]}>
                    <AntDesign name="user" size={24} color="#fff" style={styles.icon} />
                    <TextInput
                        style={styles.inputText}
                        value={username}
                        placeholder="Tên đăng nhập"
                        placeholderTextColor="#fff"
                        onChangeText={(text) => setUsername(text)}
                    />
                </View>

                <View style={[styles.inputView, styles.inputBorder]}>
                    <AntDesign name="lock" size={24} color="#fff" style={styles.icon} />
                    <TextInput
                        style={styles.inputText}
                        placeholder="Mật khẩu"
                        value={password}
                        placeholderTextColor="#fff"
                        secureTextEntry={!showPassword}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <TouchableOpacity style={styles.checkboxContainer} onPress={() => setShowPassword(!showPassword)}>
                        <Text style={styles.checkboxText}>{showPassword ? <Entypo name="eye-with-line" size={24} color="#fff" /> :
                            <Entypo name="eye" size={24} color="#fff" />}</Text>
                    </TouchableOpacity>
                </View>

                {loading === true ? <ActivityIndicator /> : <>
                    <TouchableOpacity style={styles.loginBtn} onPress={login}>
                        <Text style={styles.loginText}>Đăng nhập</Text>
                    </TouchableOpacity>
                </>}

                <View style={styles.registerTextContainer}>
                    <Text style={styles.registerText}>Bạn có tài khoản? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text style={[styles.registerText, styles.registerLink]}>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        width: '88%',
        borderWidth: 2,
        borderRadius: 25,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 20,
        paddingTop: 40,
        borderColor: '#fff',
        borderStyle: 'solid',
    },
    inputView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    inputText: {
        height: 50,
        color: '#fff',
        flex: 1,
        fontSize: 17
    },

    checkboxContainer: {
        marginLeft: 10,
    },
    checkboxText: {
        color: '#fff',
    },
    loginBtn: {
        backgroundColor: '#fff',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    welcomeText: {
        fontSize: 28,
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    loginText: {
        color: '#764ba2',
        fontSize: 18
    },
    registerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    registerText: {
        color: '#fff',
        fontSize: 18
    },
    registerLink: {
        textDecorationLine: 'underline',
    },
    icon: {
        marginRight: 10,
    },
});

export default Login;
