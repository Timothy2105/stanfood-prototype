import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import Colors from '@/constants/Colors';
import { useNavigation } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';

const CustomMarker = () => (
  <View style={styles.markerContainer}>
    <View style={styles.markerContent}>
      <View style={styles.markerIcon}>
        <Ionicons name="person-outline" size={20} color="white" />
      </View>
      <View style={styles.markerTriangle} />
    </View>
    <View style={styles.markerCircle} />
  </View>
);

const LocationSearch = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [location, setLocation] = useState({
    latitude: 37.4277,
    longitude: -122.1701,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [locationDescription, setLocationDescription] = useState('');

  const findNearestLandmark = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`
      );
      const data = await response.json();
      console.log('Nearby Search API Response:', data);

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const nearestPlace = data.results[0];
        return `Near ${nearestPlace.name}`;
      } else {
        return `Latitude: ${lat.toFixed(4)}, Longitude: ${lng.toFixed(4)}`;
      }
    } catch (error) {
      console.error('Error fetching nearest landmark:', error);
      return `Error: ${error.message}`;
    }
  };

  const handleLocationChange = async (lat, lng, description) => {
    setLocation((prevLocation) => ({
      ...prevLocation,
      latitude: lat,
      longitude: lng,
    }));

    // If we have a description from the search, use it
    if (description) {
      setLocationDescription(description);
    } else {
      // Otherwise, find the nearest landmark
      const landmark = await findNearestLandmark(lat, lng);
      setLocationDescription(landmark);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <GooglePlacesAutocomplete
        placeholder="Search for a location"
        fetchDetails={true}
        onPress={(data, details) => {
          const point = details?.geometry?.location;
          if (!point) return;
          handleLocationChange(point.lat, point.lng, data.description);
          mapRef.current?.animateToRegion({
            latitude: point.lat,
            longitude: point.lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          language: 'en',
        }}
        renderLeftButton={() => (
          <View style={styles.boxIcon}>
            <Ionicons name="search-outline" size={24} color={Colors.medium} />
          </View>
        )}
        styles={{
          container: {
            flex: 0,
          },
          textInput: {
            backgroundColor: Colors.grey,
            paddingLeft: 35,
            borderRadius: 10,
          },
          textInputContainer: {
            backgroundColor: Colors.ultraLightGrey,
            paddingHorizontal: 8,
            paddingTop: 8,
            paddingBottom: 4,
          },
        }}
      />
      <MapView ref={mapRef} showsUserLocation={true} style={styles.map} initialRegion={location}>
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Selected Location"
          description={locationDescription}
        >
          <CustomMarker />
        </Marker>
      </MapView>

      <View style={styles.absoluteBox}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  absoluteBox: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    alignItems: 'center',
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  boxIcon: {
    position: 'absolute',
    left: 15,
    top: 18,
    zIndex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 10, // Change value to adjust central point
  },
  markerContent: {
    alignItems: 'center',
  },
  markerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  markerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 13.5,
    borderRightWidth: 13.5,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.primary,
    marginTop: -6,
  },
  markerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'white',
    marginTop: 2,
  },
});

export default LocationSearch;
