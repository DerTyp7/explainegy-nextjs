import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: "AIzaSyB4U9wobUn7hpqt-gVuNQJPdhfpVdSGPIg",
	authDomain: "next-tutorials-7e130.firebaseapp.com",
	projectId: "next-tutorials-7e130",
	storageBucket: "next-tutorials-7e130.appspot.com",
	messagingSenderId: "500863392288",
	appId: "1:500863392288:web:4f2f667fef3a571b1d3a45",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore();
export const storage = getStorage(app);
