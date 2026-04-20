 
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth"
 
 
const firebaseConfig = {
  apiKey:  "AIzaSyArSH4EWhAbqLq2yze3xGR43a3RUKKxmaw",
  authDomain: "zestycart-410d3.firebaseapp.com",
  projectId: "zestycart-410d3",
  storageBucket: "zestycart-410d3.firebasestorage.app",
  messagingSenderId: "119870787443",
  appId: "1:119870787443:web:16514735a23aea9ea5ff06"
};

 
const app = initializeApp(firebaseConfig);
const auth= getAuth(app);
export {app,auth};