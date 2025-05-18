
'use server';

import type { Task, Child } from '@/types';
import { firestore } from '@/lib/firebase-admin'; // Importa la instancia de Firestore Admin
import { FieldValue } from 'firebase-admin/firestore'; // Para FieldValue.serverTimestamp() si es necesario

interface CreateTaskInput {
  userId: string; // ID del padre/usuario autenticado
  childId: string;
  categoryId: string;
  taskName: string;
  taskValue: number; // "peso"
  taskFrequency: 'diaria' | 'semanal';
}

export async function createTaskAction(input: CreateTaskInput): Promise<{ success: boolean; message: string; taskId?: string }> {
  const { userId, childId, categoryId, taskName, taskValue, taskFrequency } = input;

  if (!firestore) {
    console.error("Firestore Admin SDK no está disponible. No se puede crear la tarea.");
    return { success: false, message: "Error del servidor: Firestore no está configurado." };
  }

  // En una app real, verificarías la autenticación y autorización del usuario aquí.
  // Por ejemplo, usando `authAdmin` o el sistema de autenticación que estés usando.
  // const sessionUser = await getAuthenticatedUser(); // Función hipotética
  // if (!sessionUser || sessionUser.uid !== userId) {
  //   return { success: false, message: "No autorizado." };
  // }

  if (!userId || !childId || !categoryId || !taskName || taskValue <= 0) {
    return { success: false, message: "Datos de entrada inválidos." };
  }
  
  // Lógica real con Firebase Admin SDK:
  try {
    const childRef = firestore.collection('users').doc(userId).collection('children').doc(childId);
    const childDoc = await childRef.get();

    if (!childDoc.exists) {
      return { success: false, message: "Hijo no encontrado." };
    }

    const childData = childDoc.data() as Child;
    const categories = childData.categories || [];

    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) {
      return { success: false, message: "Categoría no encontrada." };
    }

    // Generar un ID único para la nueva tarea (Firestore lo hace automáticamente si no se especifica .doc(id))
    // o puedes usar una librería como uuid
    const newTaskId = firestore.collection('temp_ids').doc().id; // Manera sencilla de obtener un ID único

    const finalNewTask: Task = {
      id: newTaskId,
      name: taskName,
      completed: false,
      value: taskValue,
      isActive: true,
      frequency: taskFrequency,
      creadaPorUsuario: true,
    };

    // Clonamos las categorías para evitar modificar directamente el objeto obtenido de Firestore
    const updatedCategories = categories.map((cat, index) => {
      if (index === categoryIndex) {
        return {
          ...cat,
          tasks: [...(cat.tasks || []), finalNewTask], // Añade la nueva tarea al array de tareas
        };
      }
      return cat;
    });
    
    // Actualizar el documento del hijo con las categorías modificadas
    await childRef.update({ categories: updatedCategories });

    console.log(`Tarea "${finalNewTask.name}" creada para el hijo ${childId} en la categoría ${categoryId} por el usuario ${userId}.`);
    return { success: true, message: "Tarea creada exitosamente en Firestore.", taskId: finalNewTask.id };

  } catch (error) {
    console.error("Error al crear tarea en Firestore:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido al escribir en Firestore.";
    return { success: false, message: `Error del servidor: ${errorMessage}` };
  }
}
