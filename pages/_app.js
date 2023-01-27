import "./styles.css";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState, useEffect } from "react";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAjfG8RsO9mgYNdUOD9d_IwBsZAY-LwniU",
  authDomain: "my-ai-doc.firebaseapp.com",
  projectId: "my-ai-doc",
  storageBucket: "my-ai-doc.appspot.com",
  messagingSenderId: "855573263280",
  appId: "1:855573263280:web:ba00427c24e8e9caa5dc75",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  signInWithPopup(auth, provider);
};
const signOutFromGoogle = () => {
  signOut(auth, provider);
};

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  // const dispatch = useDispatch();
  const addNewUser = async (uid) => {
    const userRef = doc(db, "users", uid);

    const data = {
      promptsList: [],
    };
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      console.log("Document already exist");
    } else {
      console.log("No such document!");
      setDoc(userRef, data)
        .then(() => {
          console.log("Document has been added successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user is", user);
        setUser(user);
        addNewUser(user.uid);
      } else {
        setUser(null);
      }
    });
  }, []);
  return (
    <Component
      {...pageProps}
      user={user}
      signIn={signInWithGoogle}
      signOut={signOutFromGoogle}
    />
  );
}
export default MyApp;
