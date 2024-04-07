import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen';
import { useEffect, useState } from 'react';
import LoginPage from './Screens/Login&Register/Login';
import RegisterPage from './Screens/Login&Register/Register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TransactionsList from './Screens/TransactionsList';
import ProductsList from './Screens/ProductsList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserProvider from './contexts/UserContext';

const StackNav = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === 'Transactions') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (rn === 'Products') {
            iconName = focused ? 'bag' : 'bag-outline';
          }


          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductsList} />
      <Tab.Screen name="Transactions" component={TransactionsList} />
    </Tab.Navigator>
  );
};

const LoginNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Register" component={RegisterPage} />
    </Stack.Navigator>
  );
};
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setuserType] = useState(false);
  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    const userType1 = await AsyncStorage.getItem('userType');
    setIsLoggedIn(data);
    setuserType(userType1);
  }
  const RootStack = createNativeStackNavigator();

  useEffect(() => {
    getData();
    setTimeout(() => {
      SplashScreen.hide();
    }, 900);
  }, [isLoggedIn]);
  const data = AsyncStorage.getItem('isLoggedIn');

  return (
    <UserProvider>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName={data === 'true' ? 'MainApp' : 'Auth'} screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Auth" component={LoginNav} />
          <RootStack.Screen name="MainApp" component={StackNav} />
        </RootStack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
export default App;
