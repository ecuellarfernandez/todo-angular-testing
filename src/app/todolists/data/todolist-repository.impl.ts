import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoListRepository } from '../domain/repositories/todolist.repository';
import { TodoList } from '../domain/models/todolist.model';
import { environment } from '../../../enviroments/enviroment';

@Injectable()
export class TodoListRepositoryImpl implements TodoListRepository {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTodoLists(projectId: string): Observable<TodoList[]> {
    return this.http.get<TodoList[]>(`${this.baseApiUrl}/projects/${projectId}/todolists`);
  }

  getTodoListById(projectId: string, todoListId: string): Observable<TodoList> {
    return this.http.get<TodoList>(`${this.baseApiUrl}/projects/${projectId}/todolists/${todoListId}`);
  }

  createTodoList(projectId: string, name: string): Observable<TodoList> {
    return this.http.post<TodoList>(`${this.baseApiUrl}/projects/${projectId}/todolists`, { name });
  }

  updateTodoList(projectId: string, todoListId: string, name: string): Observable<TodoList> {
    return this.http.put<TodoList>(`${this.baseApiUrl}/projects/${projectId}/todolists/${todoListId}`, { name });
  }

  deleteTodoList(projectId: string, todoListId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/projects/${projectId}/todolists/${todoListId}`);
  }
}