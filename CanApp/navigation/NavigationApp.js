import { HeaderTitle } from '@react-navigation/elements';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, Text } from 'react-native';
import ChartBar from '../components/ChartBar';
import ChartLine from '../components/ChartLine';
import Account from '../screens/Account';
import Chart from '../screens/Chart';
import GeneralCustomerDetail from '../screens/GeneralCustomerDetail';
import GeneralCustomers from '../screens/GeneralCustomers';
import GeneralDate from '../screens/GeneralDate';
import GeneralProductDetail from '../screens/GeneralProductDetail';
import GeneralProducts from '../screens/GeneralProducts';
import GeneralWeightDetail from '../screens/GeneralWeightDetail';
import Home from "../screens/Home";
import Login from '../screens/Login';
import OldWeight from '../screens/OldWeight';
import Register from '../screens/Register';
import Scales from '../screens/Scales';
import ScalesChartBar from '../screens/ScalesChartBar';
import ScalesChartLine from '../screens/ScalesChartLine';
import ScalesSreachOfDay from '../screens/ScalesSreachOfDay';
import SearchCustomer from '../screens/SearchCustomer';
import SearchProduct from '../screens/SearchProduct';
import Weight from '../screens/Weight';
import WeightChartMonth from '../screens/WeightChartMonth';
import WeightDetail from '../screens/WeightDetail';

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
                <Stack.Screen name="Weight" component={Weight} options={{ title: 'Thông tin các cân', headerShown: true }} />
                <Stack.Screen name="WeightDetail" component={WeightDetail} options={{ title: 'Thông tin chi tiết phiếu cân', headerShown: true }} />

                <Stack.Screen name="ChartBar" component={ChartBar} options={{ title: 'Thống kê tuần', headerShown: true }} />
                <Stack.Screen name="ChartLine" component={ChartLine} options={{ title: 'Thống kê tháng', headerShown: true }} />
                <Stack.Screen name="OldWeight" component={OldWeight} options={{ title: 'Phiếu cân cũ', headerShown: true }} />
                <Stack.Screen name="Account" component={Account} options={{ title: 'Thông tin người dùng', headerShown: true }} />

                <Stack.Screen name="Chart" component={Chart} options={{ title: 'Các loại thống kê', headerShown: true }} />
                <Stack.Screen name="ScalesChartBar" component={ScalesChartBar} options={{ title: 'Thông tin các cân', headerShown: true }} />
                <Stack.Screen name="ScalesChartLine" component={ScalesChartLine} options={{ title: 'Thông tin các cân', headerShown: true }} />
                <Stack.Screen name="ScalesSreachOfDay" component={ScalesSreachOfDay} options={{ title: 'Thông tin các cân', headerShown: true }} />
                <Stack.Screen name="WeightChartMonth" component={WeightChartMonth} options={{ title: 'Thông tin tháng', headerShown: true }} />               
                
                <Stack.Screen name="SearchCustomer" component={SearchCustomer} options={{ title: 'Thông tin phiếu cân', headerShown: true }} />
                <Stack.Screen name="SearchProduct" component={SearchProduct} options={{ title: 'Thông tin phiếu cân', headerShown: true }} />

                <Stack.Screen name="GeneralProduct" component={GeneralProducts} options={{ headerShown: true, title: 'Thông tin tổng quát' }} />
                <Stack.Screen name="GeneralCustomer" component={GeneralCustomers} options={{ headerShown: true, title: 'Thông tin tổng quát' }} />
                <Stack.Screen name="GeneralDate" component={GeneralDate} options={{ headerShown: true, title: 'Thông tin tổng quát' }} />

                <Stack.Screen name="GeneralWeightDetail" component={GeneralWeightDetail} options={{ headerShown: true, title: 'Thống kê chi tiết trong ngày'  }} />
                <Stack.Screen name="GeneralCustomerDetail" component={GeneralCustomerDetail} options={{ headerShown: true, title: 'Thông tin chi tiết' }} />
                <Stack.Screen name="GeneralProductDetail" component={GeneralProductDetail} options={{ headerShown: true, title: 'Thông tin chi tiết' }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}