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

    let rutas = ['',"que-son-las-finanzas-personales",
    "uno-de-finanzas-personales-con-todo",
    "hablemos-de-ahorro",
    "el-presupuesto-nos-abre-los-ojos",
    "nombre-presupuesto",
    "como-construir-mis-metas",
    "agregar-metas",
    "de-que-van-los-ingresos",
    "agregar-ingresos",
    "gastos-gastos-y-mas-gastos",
    "agregar-gastos",
    "agregar-deudas",
    "determinar-tu-situacion-actual",
    "resumen",
    "final"]

    let rutaActual = (""+req.body.urlActual).replace("/tutorial/","");

    const docRef = doc(db, "usuarios", ""+req.body?req.body.userUID:"" );
    const docSnap = await getDoc(docRef);

    let rutaFS;
    let resultado=false;

    if (docSnap.exists()) {
        // Si existe el usuario se debe consultar en que paso del tutorial va, para regresar la url a cual se debe dirigir.
        rutaFS = docSnap.data().urlUltimoPaso.replace("/tutorial/","");        
    }
    
    if(rutas.indexOf(rutaFS) < rutas.indexOf(rutaActual)){
        console.log("Se debe cambiar paso");
        let resultadoSetDoc = await updateDoc(doc(db, "usuarios", req.body.userUID), {
            urlUltimoPaso:req.body.urlActual
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