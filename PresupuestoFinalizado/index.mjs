import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
 
 export default async function (context, req) {
     /**
      * Se debe recibir 
      *     userUID: string
      *     urlActual: string
      */

    const firebaseConfig = {
        apiKey: process.env["firebase_apiKey"],
        authDomain: process.env["firebase_authDomain"],
        projectId: process.env["firebase_projectId"],
        storageBucket: process.env["firebase_storageBucket"],
        messagingSenderId: process.env["firebase_messagingSenderId"],
        appId: process.env["firebase_appId"]
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    //Se crea conexion con Firestore
    const db = getFirestore(app);

    let rutaFS;
    let resultado=false;

    if(req.body && req.body.userUID){
        let resultadoSetDoc = await updateDoc(doc(db, "usuarios", req.body.userUID), {
            presupuestoFinalizado:true
        });
        console.log(resultadoSetDoc);
        resultado = true;
    }

    context.res = {
        body: {
            resultado: resultado
        }
    };
}