import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,  // Import ActivityIndicator for the loading screen
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseconfig'; // Firebase configuration
import { Calendar } from 'react-native-calendars';
import { FontAwesome6 } from '@expo/vector-icons'; // Icons
import * as Location from 'expo-location';
import moment from 'moment';

const Maps = () => {
  const [events, setEvents] = useState<any[]>([]); // Store events with location data
  const [region, setRegion] = useState({
    latitude: 37.7749, // Default to San Francisco
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [locationPermission, setLocationPermission] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for when fetching data

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsData = querySnapshot.docs.map(doc => doc.data());
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events: ', error);
        Alert.alert('Error', 'Unable to fetch events.');
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setLocationPermission(true);
    };

    getLocation();
  }, []);

  // Handle search functionality
  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  // Handle calendar date selection
  const handleDateChange = (date: any) => {
    setIsLoading(true); // Start loading when a date is selected
    setSelectedDate(date.dateString);
    setIsCalendarVisible(false);
  };

  // Filter events by title and selected date
  const filteredEvents = events.filter(event => {
    const matchesTitle = event.title.toLowerCase().includes(searchText.toLowerCase());
    if (selectedDate) {
      const eventDate = moment.unix(event.createdAt).format('YYYY-MM-DD');
      return matchesTitle && eventDate === selectedDate;
    }
    return matchesTitle;
  });

  useEffect(() => {
    if (selectedDate) {
      setIsLoading(false); // Stop loading once the date has been processed
    }
  }, [selectedDate]);

  // Dismiss keyboard and hide calendar
  const touchFeedback = () => {
    Keyboard.dismiss();
    setIsCalendarVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={touchFeedback}>
      <View style={styles.container}>
        {/* Header with Search and Calendar */}
        <View style={styles.header}>
          <TextInput
            style={styles.input}
            placeholder="Search events"
            value={searchText}
            onChangeText={handleSearch}
          />
          <TouchableOpacity onPress={() => setIsCalendarVisible(true)}>
            <FontAwesome6 name="calendar-days" size={24} color={selectedDate ? 'blue' : 'black'} />
          </TouchableOpacity>
        </View>

        {/* Calendar Modal */}
        <Modal
          transparent
          visible={isCalendarVisible}
          animationType="fade"
          onRequestClose={() => setIsCalendarVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Calendar
                onDayPress={handleDateChange}
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: 'blue' },
                }}
              />
            </View>
          </View>
        </Modal>

        {/* Loading Screen */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        {/* Map */}
        <MapView
          style={styles.map}
          initialRegion={region}
          region={locationPermission ? region : undefined}
          onRegionChange={region => setRegion(region)}
        >
          {filteredEvents.map((event, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(event.latitude),
                longitude: parseFloat(event.longitude),
              }}
              title={event.title}
              description={event.description}
            />
          ))}
        </MapView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    elevation: 3,
    position: 'absolute',
    top: 50,
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  map: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2,
  },
});

export default Maps;
