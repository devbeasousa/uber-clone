import { StatusBar } from 'expo-status-bar';
import {  Text, TouchableOpacity, View } from 'react-native';
import { css } from './assets/css/css';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState, useRef } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import { MaterialIcons } from '@expo/vector-icons'; 


export default function App() {
  const mapEl = useRef(null);
  const [origin, setOrigin]=useState(null);
  const [destination, setDestination]=useState(null);
  const [distance, setDistance]=useState(null);
    const [price, setPrince]=useState(null);


  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({enableHighAccurancy: true});
      setOrigin({latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
       });
      })();
  }, []);

  return (
    <View style={css.container}>
      <MapView style={css.map} initialRegion={origin} showsUserLocation={true}
      loadingEnabled={true}
          ref={mapEl}

      >
        { destination &&
          <MapViewDirections
    origin={origin}
    destination={destination}
    apikey={'AIzaSyA4Boz6MlZM8M9rObU5RuKjhVwOsT1XETU'}
    strokeWidth={3}
    onReady={result => {
      setDistance(result.distance);
      setPrince(result.distance*2);
      mapEl.current.fitToCoordinates(result.coordinates, {edgePadding:{
      top:50,
      bottom:50,
      left:50,
      right:50
    }})}}
  />}
      </MapView>

      <View style={css.search}>
        <GooglePlacesAutocomplete
        placeholder='Digite seu destino'
        onPress={(data, details = null) => {
                setDestination({latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.000922,
                longitudeDelta: 0.000421
                });
        }}
        query={{
          key: 'AIzaSyCwwkBJQJGz7Ad7mU-r3YVFnwv-e_JGjQU',
          language: 'pt-br',
        }} 
        enablePoweredByContainer={false}
      fetchDetails={true}
      styles={{listView: {backgroundColor: '#fff', zIndex:10},      container: {position: 'absolute', width: '100%'}}}
        />
        {distance &&
        <View style={css.distance}>
                    <Text style={css.distance__text}>Distância: {distance.toFixed(2).replace('.',',')}km</Text>
          <TouchableOpacity style={css.price}>
                                <Text style={css.price__text}><MaterialIcons name="payment" size={24} color="white" />Pagar: R${price.toFixed(2).replace('.',',')}</Text>
          </TouchableOpacity>
        </View>}
      </View>
    </View>
  );
}

