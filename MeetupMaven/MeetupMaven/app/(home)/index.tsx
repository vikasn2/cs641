import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet, TouchableOpacity, ImageBackground, Modal, Image, TouchableWithoutFeedback, Keyboard, Pressable } from "react-native";
import { collection, DocumentData, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig"; // Firebase configuration
import { Calendar } from 'react-native-calendars';
import { MaterialIcons, FontAwesome, FontAwesome6, } from '@expo/vector-icons'; 
import { useRouter } from "expo-router";

import moment from "moment"; // Use moment for time formatting

const Home = () => {
  const [events, setEvents] = useState<DocumentData[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [userPopupVisible, setUserPopupVisible] = useState(false); // Manage popup visibility
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 }); // Store the position of the user icon

  const router = useRouter();

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData = querySnapshot.docs.map(doc => doc.data());
        setEvents(eventsData);
      } catch (error) {
        Alert.alert("Error", "Unable to fetch events.");
      }
    };

    fetchEvents();
  }, []);
  // Filter events by title
  const filteredEvents = events.filter(event => {
    return event.title.toLowerCase().includes(searchText.toLowerCase());
  });

  // Handle date change from calendar
  const handleDateChange = (date: any) => {
    setSelectedDate(date.dateString);
    setIsCalendarVisible(false); // Close calendar after selecting a date
  };

  // Reset selected date
  const handleUnselectDate = () => {
    setSelectedDate(""); // Clear selected date
  };

  // Filter events by selected date
  const filteredByDate = selectedDate
    ? filteredEvents.filter(event => {
        // Convert the UNIX timestamp in seconds to a moment object and format it
        const eventDate = moment.unix(event.time.seconds).format("YYYY-MM-DD");
        return eventDate === selectedDate;
      })
    : filteredEvents;

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  // Handle user icon press to toggle popup
  const handleUserIconPress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setPopupPosition({ x: pageX, y: pageY });
    setUserPopupVisible(!userPopupVisible);
  };

  const touchFeedBack = () => {
    Keyboard.dismiss();
    setUserPopupVisible(false);
  }

  
  
  return (
    <TouchableWithoutFeedback onPress={()=> touchFeedBack}>
      <ImageBackground
        source={require("../../assets/Background_Frame.png")}
        style={styles.imageBackground}
        imageStyle={{ opacity: 0.5 }}
      >
        <View style={styles.container}>
          {/* Header with Search and Calendar Icon */}
          <View style={styles.header}>
            <TextInput
              style={styles.input}
              placeholder="Search by event title"
              value={searchText}
              onChangeText={handleSearch}
            />
            <TouchableOpacity onPress={() => setIsCalendarVisible(true)}>
              <FontAwesome6 name="calendar-days" size={24} color={selectedDate ? "blue" : "black" } />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUserIconPress}>
              <FontAwesome name="user" size={24} color="black" />          
            </TouchableOpacity>
          </View>

          {/* Calendar Modal */}
          <Modal
            transparent={true}
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

          {/* Date Badge if Date is Selected */}
          {selectedDate && (
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>{selectedDate}</Text>
              {/* Unselect Button */}
              <TouchableOpacity onPress={handleUnselectDate} style={styles.unselectButton}>
                <MaterialIcons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {/* Event List */}

          <FlatList
            data={filteredByDate}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const houseNo = item.address ? item.address.houseNo : '';
              const street = item.address ? item.address.street : ''; 
              const city = item.address ? item.address.city : ''; 
              const state = item.address ? item.address.state : ''; 
              const country = item.address ? item.address.country : '';
              const formattedDate = moment(item?.createdAt).format("MMMM D, YYYY [at] h:mm A");


              return (
                <Pressable onPress={() => router.push({ pathname: `/(events)/[id]`, 
                params: { id: item.id.toString() } })}>
                  <View style={styles.eventCard} >
                    {/* Event Image */}
                    <Image
                      source={{ uri: item.image }}
                      style={styles.eventImage}
                    />

                    {/* Event Title */}
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    
                    {/* Event Description */}
                    <Text style={styles.eventDescription}>{item.description}</Text>

                    {/* Date and Calendar Icon */}
                    <View style={styles.eventDetailsRow}>
                      <MaterialIcons name="calendar-today" size={20} color="#007BFF" />
                      <Text style={styles.eventDetails}>{formattedDate}</Text>
                    </View>

                    {/* Location and Address Icon */}
                    <View style={styles.eventDetailsRow}>
                      <MaterialIcons name="location-on" size={20} color="#007BFF" />
                      <Text style={styles.eventDetails}>
                        {houseNo}, {street}, {city}, {state}, {country}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            }}
          />



          {/* User Popup for Logout */}
          {userPopupVisible && (
            <View style={[styles.popup, { top: popupPosition.y - 30, left: popupPosition.x - 120 }]}>
              <TouchableOpacity style={styles.logoutCloseButton} onPress={() => setUserPopupVisible(false)}>
                <FontAwesome6 name="circle-xmark" size={24} color="black" />
              </TouchableOpacity>
             <Button
                title="Logout"
                onPress={() => {
                  console.log("User Successfully Logout");
                  // Implement actual logout logic here
                }}
              />
              
            </View>
          )}

          {/* Button for logout (if needed) */}
          
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    gap: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    flex: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    width: "60%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  dateBadge: {
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  dateBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 5,
  },
  unselectButton: {
    marginLeft: 5,
    padding: 5,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
 eventCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  eventImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 10,
    color: "#555",
  },
  eventDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  eventDetails: {
    fontSize: 14,
    marginLeft: 8,
    color: "#333",
  },
  logoutCloseButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "flex-end",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
  popup: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    width: 150,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    gap: 10,
  },
});

export default Home;
