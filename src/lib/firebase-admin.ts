
// En una aplicación real, configurarías Firebase Admin aquí.
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// Define un tipo para las credenciales de la cuenta de servicio
interface FirebaseServiceAccount extends ServiceAccount {
  private_key: string; // Asegúrate de que private_key esté explícitamente definido
  client_email: string;
  project_id: string;
}

if (!admin.apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("La variable de entorno FIREBASE_PRIVATE_KEY no está definida.");
    }
    
    const serviceAccount: FirebaseServiceAccount = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: privateKey.replace(/\\n/g, '\n'), // Reemplaza los escapes de nueva línea
      // Los siguientes campos son opcionales si los básicos están presentes, 
      // pero los incluimos para que el tipo ServiceAccount sea más completo.
      // Si tu JSON de clave de servicio los tiene, mantenlos. Si no, puedes omitirlos.
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "", 
      client_id: process.env.FIREBASE_CLIENT_ID || "",
      auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
      token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || "",
    };

    // Valida que los campos requeridos para la inicialización estén presentes
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      throw new Error('Faltan credenciales de Firebase Admin SDK (projectId, clientEmail, privateKey). Asegúrate de que las variables de entorno estén configuradas.');
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com` // Si usas Realtime Database
    });
    console.log('Firebase Admin SDK inicializado correctamente.');

  } catch (error) {
    console.error('Error al inicializar Firebase Admin SDK:', error);
    // Puedes decidir si quieres que la app falle o continúe con funcionalidades limitadas.
    // Por ahora, lanzaremos un error para que sea evidente durante el desarrollo.
    // throw error; // Comenta esto si quieres que la app intente correr sin admin SDK funcional
  }
}

export const firestore = admin.apps.length ? admin.firestore() : null;
export const authAdmin = admin.apps.length ? admin.auth() : null;

if (!admin.apps.length) {
    console.warn(
      "Firebase Admin SDK NO está configurado o falló la inicialización. Las operaciones de backend con Firestore no funcionarán. " +
      "Revisa la consola para errores de inicialización y asegúrate de que las variables de entorno (NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) están correctamente configuradas en tu entorno de servidor."
    );
}
