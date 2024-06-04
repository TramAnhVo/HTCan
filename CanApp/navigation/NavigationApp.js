import { HeaderTitle } from '@react-navigation/elements';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, Text } from 'react-native';
import ChartBar from '../components/ChartBar';
import ChartLine from '../components/ChartLine';
import RadioButton from '../components/RadioButton';
import Account from '../screens/Account';
import Chart from '../screens/Chart';
import Home from "../screens/Home";
import Login from '../screens/Login';
import OldWeight from '../screens/OldWeight';
import Register from '../screens/Register';
import Scales from '../screens/Scales';
import ScalesChartBar from '../screens/ScalesChartBar';
import ScalesChartLine from '../screens/ScalesChartLine';
import SearchMonthYear from '../screens/SearchMonthYear';
import SearchOfDay from '../screens/SearchOfDay';
import SearchString from '../screens/SearchString';
import SearchTime from '../screens/SearchTime';
import Weight from '../screens/Weight';

const Stack = createNativeStackNavigator();

export default NavigationApp = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen name="Home" component={Home}
                    options={{
                        headerTitle: props => (
                            <HeaderTitle {...props}>
                                <Image
                                    source={require('../images/logo.jpg')}
                                    style={{ width: 30, height: 30, resizeMode: 'contain' }}
                                />
                                <Text>TÂN QUỐC HƯNG</Text>
                            </HeaderTitle>
                        ),
                        headerTitleAlign: 'center',
                        headerBackVisible: false
                    }} />
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />

                <Stack.Screen name="Scales" component={Scales} options={{ title: 'Thông tin các cân', headerShown: true }} />
                <Stack.Screen name="Weight" component={Weight} options={{ title: 'Thông tin các phiếu cân', headerShown: true }} />
                <Stack.Screen name="ChartBar" component={ChartBar} options={{ title: 'Thống kê tuần', headerShown: true }} />
                <Stack.Screen name="ChartLine" component={ChartLine} options={{ title: 'Thống kê tháng', headerShown: true }} />
                <Stack.Screen name="OldWeight" component={OldWeight} options={{ title: 'Phiếu cân cũ', headerShown: true }} />
                <Stack.Screen name="Account" component={Account} options={{ title: 'Thông tin người dùng', headerShown: true }} />

                <Stack.Screen name="Chart" component={Chart} options={{ title: 'Các loại thống kê', headerShown: true }} />
                <Stack.Screen name="ScalesChartBar" component={ScalesChartBar} options={{ title: 'Thông tin các cân', headerShown: true }} />
                <Stack.Screen name="ScalesChartLine" component={ScalesChartLine} options={{ title: 'Thông tin các cân', headerShown: true }} />

                <Stack.Screen name="SearchOfDay" component={SearchOfDay} options={{ title: 'Thông tin phiếu cân', headerShown: true }} />
                <Stack.Screen name="SearchTime" component={SearchTime} options={{ title: 'Thông tin phiếu cân', headerShown: true }} />
                <Stack.Screen name="SearchMonthYear" component={SearchMonthYear} options={{ title: 'Thông tin phiếu cân', headerShown: true }} />
                <Stack.Screen name="SearchString" component={SearchString} options={{ title: 'Thông tin phiếu cân', headerShown: true }} />
                <Stack.Screen name="RadioButton" component={RadioButton} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}