import { AntDesign, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Api, { endpoints } from '../configs/Api';

export default Register = ({ navigation }) => {
    //  luu tru thong tin dang ki
    const [firstName, setFirstName] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    //  luu tru du lieu bi sai
    const [isValidFirstName, setIsValidFirstName] = useState(false);
    const [isValidCompany, setIsValidCompany] = useState(false);
    const [isValidPhone, setIsValidPhone] = useState(false);
    const [isValidUsername, setIsValidUsername] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [stateConfirm, setStateConfirm] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);

    const [buttonColor, setButtonColor] = useState('blue'); // Màu mặc định

    const [formData, setFormData] = useState({
        first_name: "",
        company: "",
        phone: '',
        username: '',
        password: ''
    });

    const isEmpty = (formData) => {
        setIsValidFirstName(false);
        setIsValidCompany(false);
        setIsValidPhone(false);
        setIsValidPassword(false);
        setIsValidUsername(false);
        setStateConfirm(false);

        let status = false;

        if (formData.first_name === '') {
            setIsValidFirstName(true);
            status = true;
        }

        if (formData.company === '') {
            setIsValidCompany(true);
            status = true;
        }

        if (formData.phone === '') {
            setIsValidPhone(true);
            status = true;
        }

        if (formData.username === '') {
            setIsValidUsername(true);
            status = true;
        }

        if (formData.password === '') {
            setIsValidPassword(true);
            status = true;
        }

        return status;
    }

    const register = async () => {
        setLoading(true);

        //  kiem tra các truong co bi trong khong
        if (isEmpty(formData)) {
            setLoading(false)
            return
        };

        if (formData.password != passwordConfirm) {
            setLoading(false)
            setPasswordConfirm('');
            return setStateConfirm(true);
        }

        // kiem tra so dien thoai co du 10 so khong 
        if (formData.phone.length < 10 || formData.phone.length > 10) {
            setLoading(false)
            return Alert.alert("Cảnh báo!", "Định dạng số điện thoại không đủ 10 số !")
        }

        if (formData.password.length < 6) {
            setLoading(false)
            return Alert.alert("Cảnh báo!", "Mật khẩu phải có độ dài từ 6 kí tự trở lên !")
        }

        try {
            if (formData.username) {
                console.log(formData)

                // Kiểm tra xem tên đăng nhập có khoảng trắng không
                if (/\s/.test(formData.username)) {
                    Alert.alert(
                        'Thông báo',
                        'Tên đăng nhập phải dính liền, không có khoảng cách !!!',
                        [{ text: 'OK', onPress: () => console.log('OK pressed') }],
                        { cancelable: false }
                    );
                    setLoading(false)
                    return; // Dừng hàm nếu có khoảng trắng
                }

                // Kiểm tra tên đăng nhập trước khi đăng ký
                const usernameCheckResponse = await Api.post(endpoints[`check-username`], {
                    username: formData.username
                });

                if (usernameCheckResponse.data.exists) {
                    Alert.alert(
                        'Thông báo',
                        'Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.',

                        [{ text: 'OK', onPress: () => console.log('OK pressed') }],
                        { cancelable: false }
                    );
                    setLoading(false)
                    return; // Dừng hàm nếu tên đăng nhập đã tồn tại
                }

                //  Nếu tên đăng nhập hợp lệ, tiến hành đăng ký
                await Api.post(endpoints[`register`], formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'charset': 'utf-8'
                    }
                });

                // Xóa dữ liệu trong biến formData
                setPasswordConfirm('');
                setFormData({});
                setLoading(false)

                navigation.navigate('Login');
                ToastAndroid.show('Đăng ký thành công!', ToastAndroid.SHORT);
            }
        } catch (error) {
            setLoading(false)
            console.log("err", error);
            Alert.alert(
                'Lỗi',
                'Đang xảy ra lỗi! Thử lại sau!!',
                [{ text: 'OK', onPress: () => console.log('OK pressed') }],
                { cancelable: false }
            );
        }
    }

    const handleChangeInfo = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    return (
        <LinearGradient colors={['#2D99AE', '#764ba2']} style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Đăng ký tài khoản</Text>
                <ScrollView>
                    {/* ho ten nguoi dung */}
                    {isValidFirstName ?
                        <View style={styles.messageErr}>
                            <MaterialIcons name="error-outline" size={15} color="red" />
                            <Text style={styles.err}> Điền họ tên của bạn</Text>
                        </View> : err ?
                            <View style={styles.messageErr}>
                                <MaterialIcons name="error-outline" size={15} color="red" />
                                <Text style={styles.err}> Đang xảy ra lỗi</Text>
                            </View>
                            : <></>
                    }

                    <View style={{ ...styles.inputView, borderWidth: isValidFirstName ? 1 : 0, borderColor: isValidFirstName ? 'red' : '' }}>
                        <AntDesign name="user" size={22} color="#fff" style={styles.icon} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Họ tên người dùng ..."
                            placeholderTextColor="#fff"
                            value={formData.first_name}
                            onChangeText={(text) => handleChangeInfo('first_name', text)}
                        />
                    </View>

                    {/* company */}
                    {isValidCompany ?
                        <View style={styles.messageErr}>
                            <MaterialIcons name="error-outline" size={15} color="red" />
                            <Text style={styles.err}> Điền tên công ty của bạn</Text>
                        </View> : err ?
                            <View style={styles.messageErr}>
                                <MaterialIcons name="error-outline" size={15} color="red" />
                                <Text style={styles.err}> Đang xảy ra lỗi</Text>
                            </View>
                            : <></>
                    }

                    <View style={{ ...styles.inputView, borderWidth: isValidCompany ? 1 : 0, borderColor: isValidCompany ? 'red' : '' }}>
                        <AntDesign name="home" size={22} color="#fff" style={styles.icon} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Tên doanh nghiệp ..."
                            placeholderTextColor="#fff"
                            value={formData.company}
                            onChangeText={(text) => handleChangeInfo('company', text)}
                        />
                    </View>

                    {/* phone */}
                    {isValidPhone ?
                        <View style={styles.messageErr}>
                            <MaterialIcons name="error-outline" size={15} color="red" />
                            <Text style={styles.err}> Điền số điện thoại của bạn</Text>
                        </View> : err ?
                            <View style={styles.messageErr}>
                                <MaterialIcons name="error-outline" size={15} color="red" />
                                <Text style={styles.err}> Đang có lỗi</Text>
                            </View>
                            : <></>
                    }
                    <View style={{ ...styles.inputView, borderWidth: isValidPhone ? 1 : 0, borderColor: isValidPhone ? 'red' : '' }}>
                        <AntDesign name="phone" size={22} color="#fff" style={styles.icon} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Số điện thoại ..."
                            placeholderTextColor="#fff"
                            keyboardType="numeric"
                            value={formData.phone}
                            onChangeText={(text) => handleChangeInfo('phone', text)}
                        />
                    </View>

                    {/* username */}
                    {isValidUsername ?
                        <View style={styles.messageErr}>
                            <MaterialIcons name="error-outline" size={15} color="red" />
                            <Text style={styles.err}> Điền tên đăng nhập của bạn</Text>
                        </View> : err ?
                            <View style={styles.messageErr}>
                                <MaterialIcons name="error-outline" size={15} color="red" />
                                <Text style={styles.err}> Đang xảy ra lỗi</Text>
                            </View>
                            : <></>
                    }

                    <View style={{ ...styles.inputView, borderWidth: isValidUsername ? 1 : 0, borderColor: isValidUsername ? 'red' : '' }}>
                        <AntDesign name="user" size={22} color="#fff" style={styles.icon} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Tên đăng nhập"
                            placeholderTextColor="#fff"
                            autoCapitalize="none"
                            value={formData.username}
                            onChangeText={(text) => handleChangeInfo('username', text)}
                        />
                    </View>

                    {/* password */}
                    {isValidPassword ?
                        <View style={styles.messageErr}>
                            <MaterialIcons name="error-outline" size={14} color="red" />
                            <Text style={styles.err}> Điền mật khẩu của bạn</Text>
                        </View> : err ?
                            <View style={styles.messageErr}>
                                <MaterialIcons name="error-outline" size={14} color="red" />
                                <Text style={styles.err}> Đang xảy ra lỗi</Text>
                            </View>
                            : <></>
                    }

                    <View style={[styles.inputView, styles.inputBorder, { borderWidth: isValidPassword ? 1 : 0, borderColor: isValidPassword ? 'red' : '' }]}>
                        <AntDesign name="lock" size={22} color="#fff" style={styles.icon} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Mật khẩu"
                            placeholderTextColor="#fff"
                            secureTextEntry={!showPassword}
                            onChangeText={(text) => handleChangeInfo('password', text)}
                            value={formData.password}
                        />
                        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setShowPassword(!showPassword)}>
                            <Text style={styles.checkboxText}>{showPassword ? <Entypo name="eye-with-line" size={22} color="#fff" /> :
                                <Entypo name="eye" size={22} color="#fff" />}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* xac nhan password */}
                    {stateConfirm &&
                        <View style={styles.messageErr}>
                            <MaterialIcons name="error-outline" size={14} color="red" />
                            <Text style={styles.err}> Mật khẩu không trùng khớp</Text>
                        </View>
                    }

                    <View style={[styles.inputView, styles.inputBorder, { borderWidth: stateConfirm ? 1 : 0, borderColor: stateConfirm ? 'red' : '' }]}>
                        <AntDesign name="lock" size={22} color="#fff" style={styles.icon} />
                        <TextInput
                            style={styles.inputText}
                            placeholder="Nhập lại mật khẩu"
                            placeholderTextColor="#fff"
                            secureTextEntry={!showConfirmPassword}
                            value={passwordConfirm}
                            onChangeText={(text) => setPasswordConfirm(text)}
                        />
                        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Text style={styles.checkboxText}>{showConfirmPassword ? <Entypo name="eye-with-line" size={22} color="#fff" /> :
                                <Entypo name="eye" size={22} color="#fff" />}</Text>
                        </TouchableOpacity>
                    </View>

                    {loading === true ? <ActivityIndicator /> : <>
                        <TouchableOpacity style={styles.registerButton} onPress={register}>
                            <Text style={styles.registerButtonText}>Đăng ký</Text>
                        </TouchableOpacity>
                    </>}
                </ScrollView>
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderColor: '#fff',
        borderStyle: 'solid',
    },
    title: {
        fontSize: 24,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 15,
    },
    inputView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 25,
        height: 45,
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    inputText: {
        flex: 1,
        height: 45,
        color: '#fff',
        fontSize: 15
    },
    avatarButton: {
        backgroundColor: '#fff',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    avatarButtonText: {
        color: '#764ba2',
        fontSize: 16,
    },
    registerButton: {
        backgroundColor: '#fff',
        borderRadius: 25,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerButtonText: {
        color: '#764ba2',
        fontSize: 16,
    },
    icon: {
        marginRight: 10,
    },
    messageErr: {
        paddingBottom: 4,
        paddingLeft: 10,
        alignItems: "center",
        flexDirection: 'row',
        width: '75%',
        justifyContent: "flex-start"
    },
    err: {
        color: '#FF0000',
        fontSize: 14
    },
});

