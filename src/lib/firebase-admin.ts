
// En una aplicación real, configurarías Firebase Admin aquí.
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// Define un tipo para las credenciales de la cuenta de servicio
interface FirebaseServiceAccount extends ServiceAccount {
  private_key: string; // Asegúrate de que private_key esté explícitamente definido
  client_email: string;
  project_id: string;
}

let firestore: admin.firestore.Firestore | null = null;
let authAdmin: admin.auth.Auth | null = null;

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

    if (!projectId || !clientEmail || !privateKey) {
      let missingVars = [];
      if (!projectId) missingVars.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
      if (!clientEmail) missingVars.push("FIREBASE_CLIENT_EMAIL");
      if (!privateKey) missingVars.push("FIREBASE_PRIVATE_KEY");
      throw new Error(`Faltan variables de entorno necesarias para Firebase Admin SDK: ${missingVars.join(', ')}.`);
    }
    
    const serviceAccount: FirebaseServiceAccount = {
      projectId: projectId,
      clientEmail: clientEmail,
      // Reemplaza los escapes de nueva línea. MUY IMPORTANTE para variables de entorno.
      privateKey: privateKey.replace(/\\n/g, '\n'), 
      // Estos campos pueden o no ser necesarios dependiendo de tu clave de servicio,
      // pero es bueno tenerlos si tu clave los incluye.
      // Si no los tienes en tus variables de entorno y no son requeridos por tu clave,
      // puedes omitirlos o dejar que process.env los devuelva como undefined (que resultará en string vacío).
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "", 
      client_id: process.env.FIREBASE_CLIENT_ID || "",
      auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
      token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || "",
    };
    
    console.log('[Firebase Admin Debug] Intentando inicializar app con credenciales procesadas...');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    firestore = admin.firestore();
    authAdmin = admin.auth();
    console.log('Firebase Admin SDK inicializado correctamente.');

  } catch (error: any) {
    // Loguear el error específico de Firebase si está disponible
    console.error('Error CRÍTICO al inicializar Firebase Admin SDK:', error.message);
    if (error.errorInfo) {
      console.error('Detalles del error de Firebase:', error.errorInfo);
    }
    // También loguear el stack trace completo para más contexto si es necesario
    // console.error('Stack trace completo:', error);
  }
}

// Exportar las instancias (serán null si la inicialización falló)
export { firestore, authAdmin };


if (!admin.apps.length && process.env.NODE_ENV === 'development') { 
    console.warn(
      "ADVERTENCIA: Firebase Admin SDK NO está configurado o falló la inicialización. Las operaciones de backend con Firestore NO funcionarán. " +
      "Revisa los logs anteriores para errores específicos de inicialización (buscar 'Error CRÍTICO al inicializar Firebase Admin SDK'). " +
      "Asegúrate de que las variables de entorno (NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) están correctamente configuradas en tu entorno de servidor (ej. Firebase Studio Environment Variables)."
    );
}
