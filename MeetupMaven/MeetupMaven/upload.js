// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, setDoc } = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBimKKlKxOZGFBvTdLx6khdtQ7VBGWF5I0",
  authDomain: "meetupmaven-6c65e.firebaseapp.com",
  projectId: "meetupmaven-6c65e",
  storageBucket: "meetupmaven-6c65e.firebasestorage.app",
  messagingSenderId: "837857488606",
  appId: "1:837857488606:web:670891a78453ee9bd69c4f",
  measurementId: "G-S79RF7XGYN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const sampleProducts = [
  {
    id: "3e89a734-2bbd-4cdb-b051-839f72901c1a",
    address: {
      city: "Jersey City",
      country: "United States",
      houseNo: "36 Spruce St",
      state: "NJ",
      street: "Spruce St",
    },
    createdAt: "2024-11-27T04:30:21.452Z",
    description:
      "Join us for an evening of music, food, and fun as we celebrate the season with great company.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/meetupmaven-6c65e.firebasestorage.app/o/event-images%2F1732681820650-event.jpg?alt=media&token=8dbe44be-a9ad-42bf-8879-0cdcea838d6a",
    latitude: 40.74212390355714,
    longitude: -74.06122786941974,
    time: "December 31, 2024 at 11:29:00 AM UTC-5",
    title: "New Year's Eve Party",
  },
  {
    id: "d1f826fa-95c7-4bb5-8b8a-0ec3a182f94a",
    address: {
      city: "Hoboken",
      country: "United States",
      houseNo: "42 Pine Ave",
      state: "NJ",
      street: "Pine Ave",
    },
    createdAt: "2024-11-26T04:10:15.452Z",
    description:
      "Celebrate the holidays with a festive gathering of friends and family. Enjoy great food and music.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/meetupmaven-6c65e.firebasestorage.app/o/event-images%2F1732681830400-event.jpg?alt=media&token=9a1f3a2c-839d-43f2-b404-6ed6c017dfd2",
    latitude: 40.735657,
    longitude: -74.033292,
    time: "December 25, 2024 at 8:00:00 PM UTC-5",
    title: "Holiday Celebration",
  },
  {
    id: "e12b4ff8-77b3-4d5f-9db7-8f9240569e6c",
    address: {
      city: "Long Beach",
      country: "United States",
      houseNo: "88 Ocean Blvd",
      state: "NY",
      street: "Ocean Blvd",
    },
    createdAt: "2024-11-25T03:40:12.452Z",
    description:
      "A fun-filled New Year's Eve beach party with an exciting countdown, music, and fireworks.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/meetupmaven-6c65e.firebasestorage.app/o/event-images%2F1732681840500-event.jpg?alt=media&token=682c4f2b-5a39-4d64-b6c1-6d7a75809d58",
    latitude: 40.586,
    longitude: -73.693,
    time: "December 31, 2024 at 11:00:00 PM UTC-5",
    title: "New Year Beach Countdown",
  },
  {
    id: "ce47078b-23e1-4ad6-b7c3-51cd5632f70b",
    address: {
      city: "Palo Alto",
      country: "United States",
      houseNo: "145 Willow Rd",
      state: "CA",
      street: "Willow Rd",
    },
    createdAt: "2024-11-24T03:20:05.452Z",
    description:
      "Tech professionals and startups meet to share ideas and network in a relaxed and inspiring environment.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/meetupmaven-6c65e.firebasestorage.app/o/event-images%2F1732681850600-event.jpg?alt=media&token=5f7ff5f2-9f09-4a7a-bdc3-fb1f4b8a29d6",
    latitude: 37.4419,
    longitude: -122.143,
    time: "December 12, 2024 at 10:00:00 AM UTC-5",
    title: "Tech Networking Meetup",
  },
  {
    id: "b982f58b-9088-4a5f-b9d7-6a4d9cc48961",
    address: {
      city: "Burlington",
      country: "United States",
      houseNo: "12 Maple Dr",
      state: "VT",
      street: "Maple Dr",
    },
    createdAt: "2024-11-23T02:55:09.452Z",
    description:
      "Get in the holiday spirit by exploring unique handmade gifts, crafts, and delicious food at this festive market.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/meetupmaven-6c65e.firebasestorage.app/o/event-images%2F1732681860700-event.jpg?alt=media&token=9b2c35d3-d1cc-4197-b72b-daffdb732c9b",
    latitude: 44.4759,
    longitude: -73.2121,
    time: "December 24, 2024 at 4:00:00 PM UTC-5",
    title: "Christmas Market",
  },
  {
    id: "c12b7ff1-378b-4506-bc7c-9067d8db06d0",
    address: {
      city: "Madison",
      country: "United States",
      houseNo: "205 Birch Rd",
      state: "WI",
      street: "Birch Rd",
    },
    createdAt: "2024-11-22T02:40:12.452Z",
    description:
      "A creative workshop for people of all skill levels to learn new crafts and techniques during the winter season.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/meetupmaven-6c65e.firebasestorage.app/o/event-images%2F1732681870800-event.jpg?alt=media&token=fb7beaad-dde3-43d4-a0ac-423734fc8de9",
    latitude: 43.0747,
    longitude: -89.3807,
    time: "December 5, 2024 at 1:00:00 PM UTC-5",
    title: "Creative Winter Workshop",
  },
  {
    id: "975ab1b9-b92d-4754-a1e0-2dcd91f2d6f5",
    address: {
      city: "Salt Lake City",
      country: "United States",
      houseNo: "29 Cherry Ln",
      state: "UT",
      street: "Cherry Ln",
    },
    createdAt: "2024-11-21T02:20:08.452Z",
    description:
      "Shop for unique handmade crafts, home decor, and holiday gifts at the annual Salt Lake City Holiday Crafts Fair.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/meetupmaven-6c65e.firebasestorage.app/o/event-images%2F1732681880900-event.jpg?alt=media&token=a2b5f30a-f2e9-43ca-98f4-bc038548d3b2",
    latitude: 40.7608,
    longitude: -111.891,
    time: "December 20, 2024 at 2:00:00 PM UTC-5",
    title: "Craft Fair",
  },
  {
    id: "b43817b5-b592-490a-8e9c-e7f72862b7c8",
    address: {
      city: "San Francisco",
      country: "United States",
      houseNo: "215 Mission St",
      state: "CA",
      street: "Mission St",
    },
    createdAt: "2024-11-20T01:15:09.452Z",
    description:
      "An evening of great networking opportunities and presentations from successful entrepreneurs in the tech field.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/meetupmaven-6c65e.firebasestorage.app/o/event-images%2F1732681890900-event.jpg?alt=media&token=b5be2c09-88d0-4312-94c0-0b0ec4e35099",
    latitude: 37.7749,
    longitude: -122.4194,
    time: "December 10, 2024 at 5:00:00 PM UTC-5",
    title: "Tech Entrepreneurs Meetup",
  },
  {
    id: "9f34e7b1-ea3f-4671-b49e-5414b40cf7ad",
    address: {
      city: "Los Angeles",
      country: "United States",
      houseNo: "389 Sunset Blvd",
      state: "CA",
      street: "Sunset Blvd",
    },
    createdAt: "2024-11-19T06:30:18.452Z",
    description:
      "Enjoy a vibrant cultural event featuring performances, food, and art at one of the city's top venues.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/meetupmaven-6c65e.firebasestorage.app/o/event-images%2F1732681900900-event.jpg?alt=media&token=35d8b82e-f8b9-4d45-a5ad-d4c3cbd62d6e",
    latitude: 34.0522,
    longitude: -118.2437,
    time: "December 8, 2024 at 6:00:00 PM UTC-5",
    title: "Cultural Festival",
  },
  {
    id: "334f9b89-bd34-4e4e-81b7-9c1c52e5cd6a",
    address: {
      city: "Chicago",
      country: "United States",
      houseNo: "50 W Chicago Ave",
      state: "IL",
      street: "Chicago Ave",
    },
    createdAt: "2024-11-18T08:40:22.452Z",
    description:
      "Join us for a fantastic evening of music, food, and holiday cheer with live performances from local artists.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/meetupmaven-6c65e.firebasestorage.app/o/event-images%2F1732681910900-event.jpg?alt=media&token=f7b3774c-01f2-4300-a905-b92d3a9b7209",
    latitude: 41.8781,
    longitude: -87.6298,
    time: "December 15, 2024 at 7:00:00 PM UTC-5",
    title: "Holiday Concert",
  },
  {
    id: "8c7db92b-f0b8-4b16-8c92-dc27b6b30dff",
    address: {
      city: "Austin",
      country: "United States",
      houseNo: "1201 Congress Ave",
      state: "TX",
      street: "Congress Ave",
    },
    createdAt: "2024-11-17T03:00:05.452Z",
    description:
      "A one-of-a-kind concert featuring local bands, food trucks, and a lively atmosphere to end the year on a high note.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/meetupmaven-6c65e.firebasestorage.app/o/event-images%2F1732681920900-event.jpg?alt=media&token=77f4552e-d7b0-4fa3-91ac-6b06cc0b1ad6",
    latitude: 30.2672,
    longitude: -97.7431,
    time: "December 18, 2024 at 6:00:00 PM UTC-5",
    title: "Live Music Festival",
  },
  {
    id: "b1f78df9-d350-4e92-b6fc-cbf7d6b167fb",
    address: {
      city: "Seattle",
      country: "United States",
      houseNo: "30 3rd Ave",
      state: "WA",
      street: "3rd Ave",
    },
    createdAt: "2024-11-16T05:10:07.452Z",
    description:
      "Enjoy the warmth and joy of the holidays with a mix of local vendors, food, and art in downtown Seattle.",
    image:
      "https://firebasestorage.googleapis.com/v0/b/meetupmaven-6c65e.firebasestorage.app/o/event-images%2F1732681930900-event.jpg?alt=media&token=cb6a383b-374b-47f8-8b4f-2e7f7a8f79a9",
    latitude: 47.6062,
    longitude: -122.3321,
    time: "December 23, 2024 at 4:00:00 PM UTC-5",
    title: "Holiday Vendor Market",
  },
];

// Function to upload data to Firestore
const uploadProducts = async () => {
  try {
    const productCollection = collection(db, "events"); // Reference to the products collection

    for (const product of sampleProducts) {
      const productDoc = doc(productCollection, product.id); // Create a document with a specific ID
      await setDoc(productDoc, product); // Add or overwrite data in the document
      console.log(`Product with ID ${product.id} added successfully.`);
    }
  } catch (error) {
    console.error("Error uploading products to Firestore:", error);
  }
};

// Call the function to upload products
uploadProducts();
