import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {RAZORPAY_KEY_ID} from '@env';
import RazorpayCheckout from 'react-native-razorpay';
import {UserContext} from '../contexts/UserContext';
import axios from 'axios';
import {ScrollView} from 'react-native-virtualized-view';
export default function ProductsList() {
  const data = [
    {
      id: '1',
      text: 'BAG 1',
      description:
        'Coral orange and brown colourblocked shoulder bag, has 1 main',
      price: 300,
    },
    {
      id: '2',
      text: 'BAG 2',
      description:
        'Coral orange and brown colourblocked shoulder bag, has 1 main',
      price: 200,
    },
    {
      id: '3',
      text: 'BAG 3',
      description:
        'Coral orange and brown colourblocked shoulder bag, has 1 main',
      price: 100,
    },
    {
      id: '4',
      text: 'BAG 4',
      description:
        'Coral orange and brown colourblocked shoulder bag, has 1 main',
      price: 3000,
    },
    // Add more items...
  ];

  const {userData} = useContext(UserContext);

  const handleCheckout = (description, amount, name) => {
    var options = {
      description: description,
      image: 'https://i.imgur.com/3g7nmJC.jpg',
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      amount: amount * 100,
      name: name,
      order_id: '',
      prefill: {
        email: userData.email,
        contact: userData.mobile,
        name: userData.name,
      },
      theme: {color: '#53a20e'},
    };

    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
        alert(`Payment successful`);
        const savePaymetApi = 'http://192.168.51.163:5001/savepaymentdetails';
        const payload = {
          name: userData.name,
          email: userData.email,
          amount: amount,
          payment_id: data.razorpay_payment_id,
        };
        axios
          .post(savePaymetApi, payload)
          .then(response => console.log('Payment details saved', response.data))
          .catch(error => {
            console.error('Error:', error);
            // Handle any errors
          });
      })
      .catch(error => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'black',
            marginVertical: 16,
          }}>
          Products List
        </Text>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FlatList
            data={data}
            renderItem={({item}) => (
              <View style={styles.item}>
                <View>
                  <Image
                    height={150}
                    resizeMode="contain"
                    source={require('../assets/bag.jpg')}
                  />
                  <Text style={styles.text}>{item.text}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.price}>₹{item.price}</Text>
                  <TouchableOpacity
                    style={styles.inBut}
                    onPress={() =>
                      handleCheckout(item.description, item.price, item.name)
                    }>
                    <View>
                      <Text style={styles.textSign}>Buy Now</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={item => item.id}
            numColumns={2}
            ItemSeparatorComponent={() => <View style={{width: 10}} />}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  item: {
    // height: 450,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 12,
  },
  text: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'medium',
    width: 160,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  inBut: {
    // width: '90%',
    backgroundColor: '#420475',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
});
