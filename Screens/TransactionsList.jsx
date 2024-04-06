import {
  View,
  Text,
  Alert,
  BackHandler,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {UserContext} from '../contexts/UserContext';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {ScrollView} from 'react-native-virtualized-view';

export default function TransactionsList() {
  const {userData} = useContext(UserContext);
  const [allTransactions, setAllTransactions] = useState([]);

  async function getData() {
    axios
      .post('http://192.168.51.163:5001/getAllTransactions', {
        email: userData.email,
      })
      .then(res => {
        console.log('User data', res.data);
        setAllTransactions(res.data.data);
      });
  }

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

  console.log('All transaction  data', allTransactions);

  return (
    <ScrollView>
      <Text
        style={{
          fontSize: 18,
          textAlign: 'center',
          fontWeight: 'bold',
          color: 'black',
          marginVertical: 16,
        }}>
        Your all transactions
      </Text>
      <View style={{marginHorizontal: 8}}>
        <View style={styles.item}>
          <Text style={[styles.text, styles.email]}>Email</Text>
          <Text style={[styles.text, styles.amount]}>Amount</Text>
          <Text style={[styles.text, styles.payment_id]}>Payment Id</Text>
        </View>
        <FlatList
          data={allTransactions}
          renderItem={({item}) => (
            <View style={styles.item}>
              <Text style={[styles.text, styles.email]}>{item.email}</Text>
              <Text style={[styles.text, styles.amount]}>{item.amount}</Text>
              <Text style={[styles.text, styles.payment_id]}>
                {item.payment_id}
              </Text>
            </View>
          )}
          keyExtractor={item => item._id}
          numColumns={1}
          ItemSeparatorComponent={() => <View style={{width: 10}} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    borderWidth: 2,
    padding: 8,
    borderColor: 'black',
  },
  email: {
    flex: 4,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  amount: {
    flex: 2,
    textAlign: 'center',
    borderRightWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  payment_id: {
    flex: 4,
    textAlign: 'center',
    padding: 10,
    borderColor: '#ddd',
  },
});
