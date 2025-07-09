import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskRepository } from '../domain/repositories/task.repository';
import { Task } from '../domain/models/task.model';
import { environment } from '../../../enviroments/enviroment';

@Injectable()
export class TaskRepositoryImpl implements TaskRepository {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTasks(projectId: string, todoListId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseApiUrl}/projects/${projectId}/todolists/${todoListId}/tasks`);
  }

  getTaskById(projectId: string, todoListId: string, taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.baseApiUrl}/projects/${projectId}/todolists/${todoListId}/tasks/${taskId}`);
  }

  createTask(projectId: string, todoListId: string, title: string, description?: string, dueDate?: string): Observable<Task> {
    return this.http.post<Task>(`${this.baseApiUrl}/projects/${projectId}/todolists/${todoListId}/tasks`, {
      title,
      description,
      dueDate,
      completed: false // Asegurar que las tareas nuevas siempre se creen como no completadas
    });
  }

  updateTask(projectId: string, todoListId: string, taskId: string, title: string, description?: string, dueDate?: string): Observable<Task> {
    return this.http.put<Task>(`${this.baseApiUrl}/projects/${projectId}/todolists/${todoListId}/tasks/${taskId}`, {
      title,
      description,
      dueDate
    });
  }

  updateTaskStatus(projectId: string, todoListId: string, taskId: string, completed: boolean): Observable<Task> {
    return this.http.patch<Task>(`${this.baseApiUrl}/projects/${projectId}/todolists/${todoListId}/tasks/${taskId}/status`, {
      completed
    });
  }

  updateTasksOrder(projectId: string, todoListId: string, taskIds: string[]): Observable<Task[]> {
    return this.http.patch<Task[]>(`${this.baseApiUrl}/projects/${projectId}/todolists/${todoListId}/tasks/reorder`, {
      taskIds
    });
  }

  deleteTask(projectId: string, todoListId: string, taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/projects/${projectId}/todolists/${todoListId}/tasks/${taskId}`);
  }
}