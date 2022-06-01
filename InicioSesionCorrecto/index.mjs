import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export default async function (context, req) {

    /**
     * Se debe recibir 
     *     userUID: string
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

    //Se consulta en la coleccion ususarios para saber si ya existe el usuario
    const docRef = doc(db, "usuarios", ""+req.body?req.body.userUID:"" );
    const docSnap = await getDoc(docRef);
    
    let urlRespuesta = "";
    let presupuestoFinalizado = "";

    if (docSnap.exists()) {
        // Si existe el usuario se debe consultar en que paso del tutorial va, para regresar la url a cual se debe dirigir.
        urlRespuesta = docSnap.data().urlUltimoPaso;
        presupuestoFinalizado = docSnap.data().presupuestoFinalizado;
        
    } else {
        // Si no exitse se agrega el ducumento a la coleccion usuarios se regresa la url del index del tutorial
        await setDoc(doc(db, "usuarios", req.body.userUID), {
            urlUltimoPaso:"/tutorial/",
            presupuestoFinalizado: false
        });

        urlRespuesta = "/tutorial/";
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            urlRespuesta: urlRespuesta,
            presupuestoFinalizado: presupuestoFinalizado
        }
    };
}