import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useContext} from 'react';
import Mobile from 'react-native-vector-icons/Entypo';
import Email from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {UserContext} from '../contexts/UserContext';
import {BASE_URL} from '../constants';

function HomeScreen(props) {
  const navigation = useNavigation();
  console.log(props);
  const {userData, setUserData} = useContext(UserContext);

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios.post(`${BASE_URL}/userdata`, {token: token}).then(res => {
      setUserData(res.data.data);
    });
  }

  const handleLogout = () => {
    AsyncStorage.removeItem('token');
    AsyncStorage.setItem('isLoggedIn', JSON.stringify(false));
    navigation.navigate('Auth');
  };

  const handleBackPress = () => {
    Alert.alert('Exit App', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Exit',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, []),
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <View style={{position: 'relative'}}>
          <Image
            width={100}
            height={60}
            resizeMode="contain"
            style={{marginTop: -150}}
            source={require('../assets/wave.png')}
          />
        </View>
        <View style={{marginTop: -50}}>
          <Text style={styles.nameText}>{userData?.name}</Text>
        </View>

        <View style={{marginTop: 20, marginHorizontal: 25}}>
          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, {backgroundColor: '#ff9500'}]}>
                <Email name="email" size={24} style={{color: 'white'}} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Email</Text>
                <Text style={styles.infoLarge_Text} numberOfLines={1}>
                  {userData?.email}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoMain}>
            <View style={styles.infoCont}>
              <View style={[styles.infoIconCont, {backgroundColor: '#f2276e'}]}>
                <Mobile name="mobile" size={24} style={{color: 'white'}} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoSmall_Text}>Mobile</Text>
                <Text style={styles.infoLarge_Text}>{userData?.mobile}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.inBut} onPress={handleLogout}>
            <Text style={styles.textSign}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  // 420475
  nameText: {
    color: 'black',
    fontSize: 28,
    fontStyle: 'normal',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoMain: {
    marginTop: 10,
  },
  infoCont: {
    width: '100%',
    flexDirection: 'row',
  },
  infoIconCont: {
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    elevation: -5,
    borderColor: 'black',
    backgroundColor: 'black',
  },

  infoText: {
    width: '80%',
    flexDirection: 'column',
    marginLeft: 25,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderColor: '#e6e6e6',
  },
  infoSmall_Text: {
    fontSize: 13,
    color: '#b3b3b3',
    fontWeight: '500',
  },
  infoLarge_Text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  inBut: {
    backgroundColor: '#2371EC',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
export default HomeScreen;
