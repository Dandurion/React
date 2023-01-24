import React, {useState} from 'react';
import type {Node} from 'react';
import {SafeAreaView, Platform, Button, TextInput, Linking} from 'react-native';

const App: () => Node = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const launchMap = () => {
    const location = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `maps:${location}`,
      android: `geo:${location}?center=${location}&q=${location}&z=16`,
    });
    Linking.openURL(url);
  };

  return (
    <SafeAreaView>
      <TextInput
        placeholder="Latitude"
        onChangeText={text => setLatitude(text)}
      />
      <TextInput
        placeholder="Longitude"
        onChangeText={text => setLongitude(text)}
      />
      <Button title="Launch a Map" onPress={launchMap} />
    </SafeAreaView>
  );
};

export default App;
