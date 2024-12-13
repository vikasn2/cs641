import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../../firebaseconfig";

const EventDetails = () => {
  const { id: eventId } = useLocalSearchParams(); // Get eventId from URL
  const [event, setEvent] = useState<any | null>(null);
  const [registered, setRegistered] = useState(false); // Track registration status
  const router = useRouter();
  const userId = "demoUserId"; // Replace with your user ID logic (e.g., authentication)

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventDoc = await getDocs(collection(db, "events"));
        const eventData = eventDoc.docs
          .map((doc) => doc.data())
          .find((event: any) => event.id === eventId);

        if (eventData) {
          setEvent(eventData);
        } else {
          Alert.alert("Error", "Event not found");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        Alert.alert("Error", "Unable to fetch event details.");
      }
    };

    const checkRegistration = async () => {
      try {
        const registeredQuery = query(
          collection(db, "registeredEvents"),
          where("userId", "==", userId),
          where("eventId", "==", eventId)
        );
        const querySnapshot = await getDocs(registeredQuery);
        setRegistered(!querySnapshot.empty);
      } catch (error) {
        console.error("Error checking registration:", error);
      }
    };

    fetchEventDetails();
    checkRegistration();
  }, [eventId]);

  const handleRegister = async () => {
    if (registered) {
      // Unregister
      try {
        const registeredQuery = query(
          collection(db, "registeredEvents"),
          where("userId", "==", userId),
          where("eventId", "==", eventId)
        );
        const querySnapshot = await getDocs(registeredQuery);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        setRegistered(false);
        Alert.alert("Unregistered successfully!");
      } catch (error) {
        console.error("Error unregistering:", error);
        Alert.alert("Error", "Unable to unregister.");
      }
    } else {
      // Register
      try {
        const registrationRef = doc(collection(db, "registeredEvents"));
        await setDoc(registrationRef, { userId, eventId });
        setRegistered(true);
        Alert.alert("Registered successfully!");
      } catch (error) {
        console.error("Error registering:", error);
        Alert.alert("Error", "Unable to register.");
      }
    }
  };

  if (!event) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{event.title}</Text>
      </View>

      {/* Event Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.image }}
          style={styles.eventImage}
          resizeMode="cover"
        />
      </View>

      {/* Event Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.details}>📅 Date and Time: {event.time}</Text>
        <Text style={styles.details}>📍 Location: {event.venue}</Text>
        <Text style={styles.details}>🎤 Speakers: {event.speakers}</Text>
        <Text style={styles.details}>
          💰 Admission: {event.admission} (Early bird discount: 10% if registered
          by {event.discountDeadline})
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>
            {registered ? "Unregister" : "Register"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: { marginRight: 10 },
  backButtonText: { fontSize: 18, fontWeight: "bold", color: "#007BFF" },
  headerTitle: { fontSize: 20, fontWeight: "bold", flex: 1, textAlign: "center" },
  imageContainer: {
    height: 200,
    width: "100%",
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  details: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EventDetails;
