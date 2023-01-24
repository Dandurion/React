import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import {
  Button,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
} from 'react-native';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Dialog from 'react-native-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAxios from 'axios-hooks';

const App: () => Node = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [cityName, setCityName] = useState('');
  const [cities, setCities] = useState([]);
  const [text, setText] = useState('');

  const openDialog = () => {
    setModalVisible(true);
  };

  const addCity = () => {
    setCities([
      ...cities,
      {
        id: Math.random(),
        name: cityName,
        text: text,
      },
    ]);
    setModalVisible(false);
  };

  const cancelCity = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    storeData();
  }, [cities]);

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@cities', JSON.stringify(cities));
    } catch (e) {
      console.log('Cities saving error!');
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@cities');
      if (value !== null) {
        setCities(JSON.parse(value));
      }
    } catch (e) {
      console.log('Cities loading error!');
    }
  };

  console.log(cities);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: 64.914665,
          longitude: 26.067255,
          latitudeDelta: 11,
          longitudeDelta: 0.05,
        }}>
        {cities.map(city => (
          <Places
            key={city.id}
            id={city.id}
            city={city.name}
            text={city.text}
          />
        ))}
      </MapView>
      <Pressable style={styles.button} onPress={openDialog}>
        <Text
          style={{
            fontSize: 40,
            color: 'white',
          }}>
          +
        </Text>
      </Pressable>
      <Dialog.Container visible={modalVisible}>
        <Dialog.Title>Add a new MyPlace</Dialog.Title>
        <View>
          <TextInput
            onChangeText={text => setCityName(text)}
            placeholder="City"
          />
          <TextInput onChangeText={text => setText(text)} placeholder="Text" />
        </View>
        <Dialog.Button label="Cancel" onPress={cancelCity} />
        <Dialog.Button label="Save" onPress={addCity} />
      </Dialog.Container>
    </View>
  );
};

const Places = params => {
  const city = params.city;
  const URL = 'https://nominatim.openstreetmap.org/search?city=$';

  const [{data, loading, error}, refetch] = useAxios(
    URL + city + '&format=json&limit=1',
  );

  if (loading) {
    console.log('Loading...');
    return <View></View>;
  }

  if (error) {
    console.log('Error loading data!');
    return <View></View>;
  }

  let lat = parseFloat(data[0].lat);
  let lon = parseFloat(data[0].lon);
  console.log(lat);
  console.log(lon);
  console.log(data);

  return (
    <Marker
      key={params.id}
      coordinate={{
        latitude: lat,
        longitude: lon,
      }}
      title={city}
      description={params.text}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    height: 750,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    alignSelf: 'flex-end',
    backgroundColor: 'dodgerblue',
    height: 70,
    width: 70,
    borderRadius: 100,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
