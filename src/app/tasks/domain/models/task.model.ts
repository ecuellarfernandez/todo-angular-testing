export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  todoListId: string;
  projectId: string;
  createdAt?: string;
  position?: number;
}