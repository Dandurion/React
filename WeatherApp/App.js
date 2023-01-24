import React, {useState, useEffect} from 'react';

import type {Node} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  View,
  TouchableHighlight,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from 'react-native-dialog';
import {Header, Card, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import useAxios from 'axios-hooks';

const App: () => Node = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [cityName, setCityName] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    storeData();
  }, [cities]);

  const openDialog = () => {
    setModalVisible(true);
  };

  const cancelCity = () => {
    setModalVisible(false);
  };

  const addCity = () => {
    setCities([...cities, {id: Math.random(), name: cityName}]);
    setModalVisible(false);
  };

  const deleteCity = id => {
    let filteredArray = cities.filter(city => city.id !== id);
    setCities(filteredArray);
  };

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@cities', JSON.stringify(cities));
    } catch (e) {
      // saving error
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

  const WeatherForecast = params => {
    const city = params.city;
    const API_KEY = '1f9cf94460f953ec4fcc262e34fc9474';
    const URL = 'https://api.openweathermap.org/data/2.5/weather?q=';

    const [{data, loading, error}, refetch] = useAxios(
      URL + city.name + '&appid=' + API_KEY + '&units=metric',
    );

    if (loading)
      return (
        <Card>
          <Card.Title>Loading....</Card.Title>
        </Card>
      );
    if (error)
      return (
        <Card>
          <Card.Title>Error loading weather forecast!</Card.Title>
        </Card>
      );

    const deleteCity = () => {
      params.deleteCity(city.id);
    };

    // just for testing
    console.log(data);
    const refreshForecast = () => {
      refetch();
    };

    let imageUrl = {
      uri:
        'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png',
    };

    return (
      <Card>
        <Card.Title>{city.name}</Card.Title>
        <Text>Main: {data.weather[0].main}</Text>
        <Text>Temp: {data.main.temp} °C</Text>
        <Text>Highest: {data.main.temp_max} °C</Text>
        <Text>Lowest: {data.main.temp_min} °C</Text>
        <Text>Feels like: {data.main.feels_like} °C</Text>
        <Card.Image source={imageUrl} style={styles.weatherIcon}></Card.Image>
        <View style={{width: 200, flexDirection: 'row', flex: 1}}>
          <TouchableHighlight onPress={refreshForecast} underlayColor="white">
            <View style={{marginRight: 150, marginTop: 40}}>
              <Text>Refresh</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={deleteCity} underlayColor="white">
            <View style={{marginLeft: 80, marginTop: 40}}>
              <Text>Delete</Text>
            </View>
          </TouchableHighlight>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView>
      <Header
        centerComponent={{text: 'Weather App', style: {color: '#fff'}}}
        rightComponent={{icon: 'add', color: '#fff', onPress: openDialog}}
      />
      <ScrollView>
        {!modalVisible &&
          cities.map(city => (
            <WeatherForecast
              key={city.id}
              city={city}
              deleteCity={deleteCity}
            />
          ))}
      </ScrollView>

      <Dialog.Container visible={modalVisible}>
        <Dialog.Title>Add a new city</Dialog.Title>
        <View>
          <Input
            onChangeText={text => setCityName(text)}
            placeholder="Type cityname here"
          />
        </View>
        <Dialog.Button label="Cancel" onPress={cancelCity} />
        <Dialog.Button label="Add" onPress={addCity} />
      </Dialog.Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  weatherIcon: {
    height: 60,
    width: 60,
  },
});

export default App;
