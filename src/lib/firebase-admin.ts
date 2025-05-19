
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
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // --- Inicio: Registro detallado para depuración ---
    console.log('--- Firebase Admin SDK Initialization Attempt ---');
    console.log(`[Firebase Admin Debug] NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${projectId ? 'Cargado' : 'NO ENCONTRADO'}`);
    console.log(`[Firebase Admin Debug] FIREBASE_CLIENT_EMAIL: ${clientEmail ? 'Cargado' : 'NO ENCONTRADO'}`);
    console.log(`[Firebase Admin Debug] FIREBASE_PRIVATE_KEY: ${privateKey ? 'Cargado (valor no mostrado por seguridad)' : 'NO ENCONTRADO'}`);
    // --- Fin: Registro detallado para depuración ---

    if (!projectId) {
      throw new Error("La variable de entorno NEXT_PUBLIC_FIREBASE_PROJECT_ID no está definida. Esta es necesaria para inicializar Firebase Admin SDK.");
    }
    if (!clientEmail) {
      throw new Error("La variable de entorno FIREBASE_CLIENT_EMAIL no está definida. Esta es necesaria para inicializar Firebase Admin SDK.");
    }
    if (!privateKey) {
      throw new Error("La variable de entorno FIREBASE_PRIVATE_KEY no está definida. Esta es necesaria para inicializar Firebase Admin SDK.");
    }
    
    const serviceAccount: FirebaseServiceAccount = {
      projectId: projectId,
      clientEmail: clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'), // Reemplaza los escapes de nueva línea
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "", 
      client_id: process.env.FIREBASE_CLIENT_ID || "",
      auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
      token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || "",
    };
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK inicializado correctamente.');

  } catch (error) {
    console.error('Error CRÍTICO al inicializar Firebase Admin SDK:', error);
  }
}

export const firestore = admin.apps.length ? admin.firestore() : null;
export const authAdmin = admin.apps.length ? admin.auth() : null;

if (!admin.apps.length && process.env.NODE_ENV === 'development') { // Muestra la advertencia solo en desarrollo para no llenar logs de producción si algo va muy mal.
    console.warn(
      "ADVERTENCIA: Firebase Admin SDK NO está configurado o falló la inicialización. Las operaciones de backend con Firestore NO funcionarán. " +
      "Revisa los logs anteriores para errores específicos de inicialización (buscar 'Error CRÍTICO al inicializar Firebase Admin SDK'). " +
      "Asegúrate de que las variables de entorno (NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) están correctamente configuradas en tu entorno de servidor (ej. archivo .env.local para desarrollo)."
    );
}
