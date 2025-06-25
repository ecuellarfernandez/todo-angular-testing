import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoList } from '../models/todolist.model';
import { TodoListRepository } from '../repositories/todolist.repository';

@Injectable()
export class GetTodoListsUseCase {
  constructor(private todoListRepository: TodoListRepository) {}

  execute(projectId: string): Observable<TodoList[]> {
    return this.todoListRepository.getTodoLists(projectId);
  }
}