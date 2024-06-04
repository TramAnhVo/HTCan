import { AntDesign, FontAwesome, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Api, { endpoints } from '../configs/Api';
import MyContext from '../configs/MyContext';

export default ProfileView = ({ navigation }) => {
    const [hidden, setHidden] = useState(false)
    const [hiddenPassword, setHiddenPassword] = useState(false)
    const [edit, setEdit] = useState(false)
    const [isButtonVisible, setIsButtonVisible] = useState(false);

    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const initialInputText = ''; // Giá trị ban đầu của inputText
    const [user, dispatch] = useContext(MyContext);
    const logout = () => {
        dispatch({
            "type": "logout"
        })
        navigation.navigate("Login")
    }

    const UpdatePhone = async (text) => {
        try {
            const res = await Api.patch(endpoints["update-user"](user.id), { "phone": text })

            dispatch({
                type: "login",
                payload: res.data
            });
        } catch (ex) {
            console.error(ex);
        }
    }

    const UpdateName = async (text) => {
        try {
            const res = await Api.patch(endpoints["update-user"](user.id), { "first_name": text })

            dispatch({
                type: "login",
                payload: res.data
            });
        } catch (ex) {
            console.error(ex);
        }
    }

    const UpdatePassword = async (text) => {
        try {
            const res = await Api.patch(endpoints["update-user"](user.id), { "password": text })

            dispatch({
                type: "login",
                payload: res.data
            });
        } catch (ex) {
            console.error(ex);
        }
    }

    //  thay doi trang thai bat tat cua thanh tai khoan nguoi dung
    const toggleHiddenText = () => {
        setHidden(!hidden);
    };

    const toggleHidden = () => {
        setHiddenPassword(!hiddenPassword);
    };

    const StateEditing = () => {
        setEdit(!edit)
        setIsButtonVisible(!isButtonVisible)
    }

    const EditingPhone = () => {
        if (phone.length == 10) {
            Alert.alert('Thông báo', 'Bạn có muốn lưu lại không!', [
                {
                    text: 'Cannel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        UpdatePhone(phone);
                        StateEditing();
                        setPhone();
                    }
                },
            ])
        }
        else {
            Alert.alert('Cảnh báo', 'Không đúng định dạng số điện thoại!')
        }
    }

    const EditingName = () => {
        if (name === " ") {
            Alert.alert('Thông báo', 'Họ tên không thể bỏ trống!')
        }
        else {
            Alert.alert('Thông báo', 'Bạn có muốn lưu lại không!', [
                {
                    text: 'Cannel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        UpdateName(name);
                        StateEditing();
                        setName();
                    }
                },
            ])
        }
    }

    const EditingPassword = () => {
        if (password === passwordConfirm) {
            Alert.alert('Thông báo', 'Bạn xác nhận muốn thay đổi mật khẩu không!', [
                {
                    text: 'Cannel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        UpdatePassword(password);
                        setPassword();
                        setPasswordConfirm();
                    }
                },
            ])
        }
        else {
            Alert.alert("Cảnh báo", 'Mật khẩu không trùng khớp!')
            setPasswordConfirm();
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.avatar}>
                        <FontAwesome name="user" size={65} color="white" style={{ textAlign: 'center', height: 100, width: 100, paddingTop: '15%', paddingRight: '8%' }} />
                    </View>
                    <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: '800' }}>{user.first_name}</Text>
                </View>
            </View>

            <ScrollView style={{ marginTop: '25%' }}>
                <Text style={{ fontSize: 20, fontWeight: '800', marginLeft: 20 }}>Thông tin tài khoản</Text>

                {/* thông tin tai khoan nguoi dung */}
                <View style={{ marginTop: 15 }} >
                    <TouchableOpacity style={styles.button} onPress={toggleHiddenText}>
                        <Ionicons name="person" size={24} color="black" style={{ marginLeft: 10 }} />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Thông tin tài khoản </Text>
                    </TouchableOpacity>
                    {hidden && (
                        <View style={styles.accountUser}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                <Text style={{ fontSize: 16 }}>Chủ tài khoản:</Text>
                                <TextInput
                                    placeholderTextColor="black"
                                    style={[styles.titleInput, { color: edit ? 'black' : 'black' }]}
                                    placeholder={user.first_name}
                                    editable={edit}
                                    value={name}
                                    onChangeText={(text) => setName(text)}
                                />
                                <TouchableOpacity onPress={StateEditing}>
                                    <FontAwesome6 name="pen-to-square" size={24} color="black" />
                                </TouchableOpacity>

                                {isButtonVisible && (
                                    <TouchableOpacity onPress={EditingName}>
                                        <AntDesign name="checkcircle" size={24} color="#00CC99" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16 }}>Số điện thoại:</Text>
                                <TextInput
                                    placeholderTextColor="black"
                                    style={[styles.titleInput, { color: edit ? 'black' : 'black' }]}
                                    keyboardType='numeric'
                                    placeholder={user.phone}
                                    editable={edit}
                                    value={phone}
                                    onChangeText={(text) => setPhone(text)}
                                />

                                <TouchableOpacity onPress={StateEditing}>
                                    <FontAwesome6 name="pen-to-square" size={24} color="black" />
                                </TouchableOpacity>

                                {isButtonVisible && (
                                    <TouchableOpacity onPress={EditingPhone}>
                                        <AntDesign name="checkcircle" size={24} color="#00CC99" />
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16 }}>Tên Công ty:</Text>
                                <TextInput
                                    placeholderTextColor="black"
                                    style={styles.titleCompanyInput}
                                    multiline={true}
                                    placeholder={user.company}
                                    editable={false}
                                />
                            </View>
                        </View>
                    )}

                    <LinearGradient
                        colors={['#00FF7F', '#008B00']}
                        start={[0, 0]}
                        end={[0, 1]}
                        style={{
                            height: 5,
                            width: '4%',
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            height: 50,
                            position: 'absolute',
                            top: 0,
                            left: 18
                        }}
                    >
                        <View></View>
                    </LinearGradient>
                </View>

                {/* doi mat khau */}
                <View style={{ marginTop: 15 }} >
                    <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={toggleHidden} >
                        <FontAwesome5 name="key" size={24} color="black" style={{ marginLeft: 10 }}/>
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Đổi mật khẩu</Text>
                    </TouchableOpacity>

                    { hiddenPassword && (
                        <View style={styles.PasswordContainer}>
                            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16 }}>Mật khẩu mới:</Text>
                                <TextInput
                                    placeholderTextColor="black"
                                    style={styles.titleInput}
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChangeText={(text) => setPassword(text)}
                                />
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16 }}>Xác nhận mật khẩu:</Text>
                                <TextInput
                                    placeholderTextColor="black"
                                    style={styles.titleInput}
                                    placeholder="Nhập lại mật khẩu"
                                    value={passwordConfirm}
                                    onChangeText={(text) => setPasswordConfirm(text)}
                                />
                            </View>

                            <TouchableOpacity style={styles.inputPassword} onPress={EditingPassword}>
                                <Text style={{color: 'white', fontSize: 15, textAlign: 'center'}}>Cập nhật mật khẩu</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <LinearGradient
                        colors={['#00FF7F', '#008B00']}
                        start={[0, 0]}
                        end={[0, 1]}
                        style={{
                            height: 5,
                            width: '4%',
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            height: 50,
                            position: 'absolute',
                            top: 0,
                            left: 18
                        }}
                    >
                        <View></View>
                    </LinearGradient>
                </View>

                {/* Dang xuat */}
                <View style={{ marginTop: 15, marginBottom: 15 }} >
                    <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={logout} >
                        <Ionicons name="exit" size={24} color="black" style={{ marginLeft: 10 }} />
                        <Text style={{ fontSize: 17, marginLeft: 5 }}>Đăng xuất</Text>
                    </TouchableOpacity>

                    <LinearGradient
                        colors={['#00FF7F', '#008B00']}
                        start={[0, 0]}
                        end={[0, 1]}
                        style={{
                            height: 5,
                            width: '4%',
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            height: 50,
                            position: 'absolute',
                            top: 0,
                            left: 18
                        }}
                    >
                        <View></View>
                    </LinearGradient>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'green',
        height: 120
    },

    headerContent: {
        backgroundColor: 'white',
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        padding: 20,
        alignItems: 'center',
        marginTop: 40,
        borderRadius: 30,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5, // Áp dụng cho Android
    },

    avatar: {
        backgroundColor: '#1E90FF',
        width: 100,
        height: 100,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: '#1E90FF',
        marginBottom: 10,
        marginRight: 10,
        position: 'relative'
    },

    button: {
        flexDirection: 'row',
        height: 50,
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'white',
        width: '88%',
        marginLeft: '7%',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5, // Áp dụng cho Android
    },

    accountUser: {
        backgroundColor: 'white',
        width: '86%',
        height: 250,
        padding: 10,
        marginTop: 5,
        marginLeft: '7%',
        marginRight: '7%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5, // Áp dụng cho Android
    },

    modalUser: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    model: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 8,
    },

    titleInput: {
        width: '50%',
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#C0C0C0',
        padding: 8,
        fontSize: 16
    },

    titleCompanyInput: {
        width: '68%',
        height: 60,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#C0C0C0',
        padding: 8,
        fontSize: 16
    },

    PasswordContainer: {
        backgroundColor: 'white',
        width: '86%',
        height: 190,
        padding: 10,
        marginTop: 5,
        marginLeft: '7%',
        marginRight: '7%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5, // Áp dụng cho Android
    },

    inputPassword: {
        backgroundColor: '#1E90FF',
        padding: 8,
        borderColor: '#1E90FF',
        borderRadius: 30,
        borderWidth: 1,
        width: '90%',
        marginTop: 10,
        marginLeft: '5%'
    }
})