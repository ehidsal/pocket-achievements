
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@/types';
import { createTaskAction } from '@/app/actions/tasks';

const taskFormSchema = z.object({
  taskName: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }).max(100, { message: "El nombre no puede exceder los 100 caracteres." }),
  taskValue: z.coerce.number().min(1, { message: "El valor debe ser al menos 1." }).max(100, { message: "El valor no puede ser mayor a 100." }),
  taskFrequency: z.enum(['diaria', 'semanal'], { required_error: "Debes seleccionar una frecuencia." }),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface CreateTaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string | null;
  childId: string;
  userId: string;
  onTaskCreated: (newTask: Task, categoryId: string) => void;
  categoryName?: string;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  open,
  onOpenChange,
  categoryId,
  childId,
  userId,
  onTaskCreated,
  categoryName
}) => {
  const { toast } = useToast();
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      taskName: '',
      taskValue: 5,
      taskFrequency: 'diaria',
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (values: TaskFormValues) => {
    if (!categoryId) {
      toast({ title: "Error", description: "No se ha seleccionado una categoría.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      // En una app real, userId vendría de la sesión del usuario autenticado.
      const result = await createTaskAction({
        userId,
        childId,
        categoryId,
        taskName: values.taskName,
        taskValue: values.taskValue,
        taskFrequency: values.taskFrequency,
      });

      if (result.success && result.taskId) {
        const newTask: Task = {
          id: result.taskId,
          name: values.taskName,
          value: values.taskValue,
          frequency: values.taskFrequency,
          completed: false,
          isActive: true,
          creadaPorUsuario: true,
        };
        onTaskCreated(newTask, categoryId);
        toast({ title: "Tarea Creada", description: `"${values.taskName}" ha sido añadida a ${categoryName}.` });
        form.reset();
        onOpenChange(false); 
      } else {
        toast({ title: "Error al Crear Tarea", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      toast({ title: "Error del Servidor", description: "No se pudo crear la tarea. Inténtalo de nuevo.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      form.reset({
        taskName: '',
        taskValue: 5,
        taskFrequency: 'diaria',
      });
    }
  }, [open, categoryId, form]);

  if (!open || !categoryId) return null; 

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>Añadir Nueva Tarea {categoryName ? `en "${categoryName}"` : ''}</DialogTitle>
          <DialogDescription>
            Completa los detalles de la nueva tarea personalizada. Se marcará como "creada por usuario".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Tarea</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Hacer la cama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taskValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor/Peso de la Tarea</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 10" {...field} />
                  </FormControl>
                  <FormDescription>
                    Cuánto contribuye esta tarea a la categoría (1-100).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taskFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frecuencia</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una frecuencia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="diaria">Diaria</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Tarea'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskForm;
