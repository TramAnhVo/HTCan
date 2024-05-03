import { HeaderTitle } from '@react-navigation/elements';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, Text } from 'react-native';
import Home from "../screens/Home";
import Scales from '../screens/Scales';
import Weight from '../screens/Weight';

const Stack = createNativeStackNavigator();

export default NavigationApp = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
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
                    }} />

                <Stack.Screen name="Scales" component={Scales} options={{ title: 'Thông tin các cân', headerShown: true }} />
                <Stack.Screen name="Weight" component={Weight} options={{ title: 'Thông tin các phiếu cân', headerShown: true }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}