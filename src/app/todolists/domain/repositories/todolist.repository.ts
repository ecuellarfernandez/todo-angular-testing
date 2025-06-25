import { Observable } from 'rxjs';
import { TodoList } from '../models/todolist.model';

export abstract class TodoListRepository {
  abstract getTodoLists(projectId: string): Observable<TodoList[]>;
  abstract getTodoListById(projectId: string, todoListId: string): Observable<TodoList>;
  abstract createTodoList(projectId: string, name: string): Observable<TodoList>;
  abstract updateTodoList(projectId: string, todoListId: string, name: string): Observable<TodoList>;
  abstract deleteTodoList(projectId: string, todoListId: string): Observable<void>;
}