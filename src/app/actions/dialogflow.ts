
'use server';

// IMPORTANT: This is a placeholder action.
// It does NOT connect to Dialogflow.
// In a real application, this server action (or a Firebase Function)
// would use the Dialogflow SDK to interact with your agent.

// Placeholder for Firestore interactions (conceptual)
// import { firestore } from '@/lib/firebase-admin'; // Assuming firebase-admin is configured
// import { FieldValue } from 'firebase-admin/firestore';

export async function sendMessageToDialogflow(
  userMessage: string,
  sessionId: string // You'd generate/manage this per user session
): Promise<string> {
  console.log(`[Dialogflow Action Placeholder] Received message for session ${sessionId}: "${userMessage}"`);

  // 1. Log user message to Firestore (conceptual)
  // if (firestore) {
  //   try {
  //     const conversationRef = firestore.collection('chatConversations').doc(sessionId);
  //     await conversationRef.set({ 
  //       startTime: FieldValue.serverTimestamp(), // Only on first message of session
  //       lastActivityTime: FieldValue.serverTimestamp(), 
  //       // userId: 'current_user_id', // If user is authenticated
  //       sessionId 
  //     }, { merge: true });
  //     await conversationRef.collection('messages').add({
  //       sender: 'user',
  //       text: userMessage,
  //       timestamp: FieldValue.serverTimestamp(),
  //     });
  //   } catch (error) {
  //     console.error("Error logging user message to Firestore:", error);
  //   }
  // }


  // 2. Simulate Dialogflow API call & response
  await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 800)); // Simulate network delay

  let botResponseText: string;

  if (userMessage.toLowerCase().includes("hola") || userMessage.toLowerCase().includes("hi")) {
    botResponseText = "¡Hola! ¿En qué puedo ayudarte hoy con Pagómetro?";
  } else if (userMessage.toLowerCase().includes("pagómetro") || userMessage.toLowerCase().includes("que es")) {
    botResponseText = "Pagómetro es una aplicación para ayudarte a gestionar la paga de tus hijos basada en el cumplimiento de tareas y objetivos. ¡Cumple, Cobra, Ahorra!";
  } else if (userMessage.toLowerCase().includes("ayuda") || userMessage.toLowerCase().includes("soporte") || userMessage.toLowerCase().includes("contactar")) {
    botResponseText = "Puedo intentar ayudarte con preguntas frecuentes. Si necesitas soporte avanzado, puedes usar una de estas opciones. ¿Quieres escalar a un operador humano?";
  } else if (userMessage.toLowerCase().includes("gracias")) {
    botResponseText = "¡De nada! Si tienes más preguntas, no dudes en consultar.";
  } else {
    botResponseText = `Recibí tu mensaje: "${userMessage}". Como soy un bot de demostración, no puedo procesarlo completamente, pero en una app real, Dialogflow entendería tu intención.`;
  }
  
  // 3. Log bot response to Firestore (conceptual)
  // if (firestore) {
  //   try {
  //     const conversationRef = firestore.collection('chatConversations').doc(sessionId);
  //     await conversationRef.collection('messages').add({
  //       sender: 'bot',
  //       text: botResponseText,
  //       timestamp: FieldValue.serverTimestamp(),
  //     });
  //     await conversationRef.update({ lastActivityTime: FieldValue.serverTimestamp() });
  //   } catch (error) {
  //     console.error("Error logging bot response to Firestore:", error);
  //   }
  // }

  console.log(`[Dialogflow Action Placeholder] Simulated bot response: "${botResponseText}"`);
  return botResponseText;
}
