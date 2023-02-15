import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyAwGxFog20BUXzKLyrT2mbdrmJ3V9zUu6Y",
	authDomain: "open-chat-lo2-app.firebaseapp.com",
	databaseURL: "https://open-chat-lo2-app-default-rtdb.firebaseio.com",
	projectId: "open-chat-lo2-app",
	storageBucket: "open-chat-lo2-app.appspot.com",
	messagingSenderId: "163455633717",
	appId: "1:163455633717:web:04e5e471e64959e77ee47c",
	measurementId: "G-8HE5YESM0H",
};

const app = initializeApp(firebaseConfig);

export default app;
