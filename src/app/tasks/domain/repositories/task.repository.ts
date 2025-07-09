import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

export abstract class TaskRepository {
  abstract getTasks(projectId: string, todoListId: string): Observable<Task[]>;
  abstract getTaskById(projectId: string, todoListId: string, taskId: string): Observable<Task>;
  abstract createTask(projectId: string, todoListId: string, title: string, description?: string, dueDate?: string): Observable<Task>;
  abstract updateTask(projectId: string, todoListId: string, taskId: string, title: string, description?: string, dueDate?: string): Observable<Task>;
  abstract updateTaskStatus(projectId: string, todoListId: string, taskId: string, completed: boolean): Observable<Task>;
  abstract updateTasksOrder(projectId: string, todoListId: string, taskIds: string[]): Observable<Task[]>;
  abstract deleteTask(projectId: string, todoListId: string, taskId: string): Observable<void>;
}