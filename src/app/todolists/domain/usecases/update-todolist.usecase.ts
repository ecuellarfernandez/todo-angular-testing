import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoList } from '../models/todolist.model';
import { TodoListRepository } from '../repositories/todolist.repository';

@Injectable({ providedIn: 'root' })
export class UpdateTodoListUseCase {
  constructor(private todoListRepository: TodoListRepository) {}

  execute(projectId: string, todoListId: string, name: string): Observable<TodoList> {
    return this.todoListRepository.updateTodoList(projectId, todoListId, name);
  }
}