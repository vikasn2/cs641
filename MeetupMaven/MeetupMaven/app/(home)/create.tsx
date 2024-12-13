import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  ImageBackground,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location"; // Import Location from expo
import { db, storage } from "../../firebaseconfig"; // Firebase configuration
import DateTimePicker from '@react-native-community/datetimepicker'; // Time picker library
import MapView, { Marker } from 'react-native-maps'; // To allow map selection
import { Ionicons, FontAwesome6 } from '@expo/vector-icons'; // For location picker icon

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(new Date());
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState({
    houseNo: "",
    street: "",
    city: "",
    state: "",
    country: "",
  });
  const [showMap, setShowMap] = useState(false); // To control map visibility
  const [userCity, setUserCity] = useState<string | null>(null); // To store user's city

  // Handle image selection
  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets?.[0]?.uri);
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your location.");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);

    // Reverse geocoding to get the address from coordinates
    const geocode = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    const locationDetails = geocode[0];
    setUserCity(locationDetails.city || "San Francisco");

    setAddress({
      houseNo: locationDetails.name || "",
      street: locationDetails.street || "",
      city: locationDetails.city || "San Francisco",
      state: locationDetails.region || "",
      country: locationDetails.country || "",
    });
  };

  const getLocationFromMap = async (coordinate: { latitude: number, longitude: number }) => {
    setLatitude(coordinate.latitude);
    setLongitude(coordinate.longitude);

    // You could use reverse geocoding here to populate the address fields based on the coordinates
    const geocode = await Location.reverseGeocodeAsync({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });

    const locationDetails = geocode[0];
    setAddress({
      houseNo: locationDetails.name || "",
      street: locationDetails.street || "",
      city: locationDetails.city || "San Francisco",
      state: locationDetails.region || "",
      country: locationDetails.country || "",
    });
    setShowMap(false); // Close map once location is picked
  };

  // Handle form submission
  const handleCreateEvent = async () => {
    if (!title || !description || !time || !image || !latitude || !longitude) {
      Alert.alert("Error", "Please fill all the required fields.");
      return;
    }

    setIsUploading(true);

    try {
      // Upload image to Firebase Storage
      const imageName = `${Date.now()}-event.jpg`; // Unique file name
      const storageRef = ref(storage, `event-images/${imageName}`);
      const response = await fetch(image);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Save event data to Firestore
      const docRef = await addDoc(collection(db, "events"), {
        title,
        description,
        time,
        image: downloadURL, // Save image URL in Firestore
        latitude,
        longitude,
        address,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Event created successfully!");
      console.log("Document written with ID: ", docRef.id);

      // Reset form
      setTitle("");
      setDescription("");
      setTime(new Date());
      setImage(null);
      setLatitude(null);
      setLongitude(null);
      setAddress({
        houseNo: "",
        street: "",
        city: "",
        state: "",
        country: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Failed to create the event. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <ImageBackground
      source={require("../../assets/Background_Frame.png")}
      style={styles.imageBackground}
      imageStyle={{ opacity: 0.5 }}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>Create Event</Text>

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          {/* Time Picker */}
          <View style={styles.containerForTimeAndLocation}>
            <View style={styles.timeContainer}>
                    <DateTimePicker
                        value={time}
                        mode="datetime"
                        display="default"
                        textColor="white"
                        accentColor="white"
                        themeVariant="dark"
                        onChange={(event, selectedDate) => {
                            if (selectedDate) setTime(selectedDate);
                        }}
                    />
            </View>
            <TouchableOpacity onPress={() => setShowMap(!showMap)} style={styles.locationIcon}>
                <Ionicons name="location-sharp" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={getCurrentLocation} 
                    style={styles.locationButton}>
                    <Text style={styles.imageButtonText}>
                    <FontAwesome6 name="location-crosshairs" size={24} color="white" />
                    </Text>
            </TouchableOpacity>
          </View>
          {/* Map to select location */}
          {showMap && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: latitude || 37.78825,
                  longitude: longitude || -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={(e) => getLocationFromMap(e.nativeEvent.coordinate)}
              >
                <Marker coordinate={{ latitude: latitude || 37.78825, longitude: longitude || -122.4324 }} />
              </MapView>
              <Text>Tap on the map to select location</Text>
            </View>
          )}

          {/* Address Inputs */}
          <View style={styles.locationSection}>
            <TextInput
              style={styles.inputForVennu}
              placeholder="House No"
              value={address.houseNo}
              onChangeText={(text) => setAddress({ ...address, houseNo: text })}
            />
            <TextInput
              style={styles.inputForVennu}
              placeholder="Street"
              value={address.street}
              onChangeText={(text) => setAddress({ ...address, street: text })}
            />
            <TextInput
              style={styles.inputForVennu}
              placeholder="City"
              value={address.city}
              onChangeText={(text) => setAddress({ ...address, city: text })}
            />
            <TextInput
              style={styles.inputForVennu}
              placeholder="State"
              value={address.state}
              onChangeText={(text) => setAddress({ ...address, state: text })}
            />
            <TextInput
              style={styles.inputForVennu}
              placeholder="Country"
              value={address.country}
              onChangeText={(text) => setAddress({ ...address, country: text })}
            />
          </View>

          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
          <TouchableOpacity onPress={handleImagePicker} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>
              {image ? "Change Image" : "Add Image"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCreateEvent} 
            disabled={isUploading}
            style={styles.imageButton}>
            <Text style={styles.imageButtonText}>
              {isUploading ? "Uploading..." : "Create Event"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: "black"
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "100%", 
    maxWidth: 400, 
    alignSelf: "center",
  },
  inputForTime: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "100%",
  },
  inputForVennu: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    width: "48%", 
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
  imageButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  locationSection: {
    marginBottom: 20,
    width: "100%",
    flexWrap: "wrap", 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
  },
  mapContainer: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    marginTop: 20
  },
  map: {
    width: "100%",
    height: "100%",
  },
  locationIcon: {
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 30,
  },
  locationButton: {
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 30,
  },
  containerForTimeAndLocation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeContainer: {
    width: "65%",
  },
  timePickerContainer: {
    backgroundColor: "#fff",
  },

});

export default CreateEvent;
