import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoList } from '../models/todolist.model';
import { TodoListRepository } from '../repositories/todolist.repository';

@Injectable()
export class CreateTodoListUseCase {
  constructor(private todoListRepository: TodoListRepository) {}

  execute(projectId: string, name: string): Observable<TodoList> {
    return this.todoListRepository.createTodoList(projectId, name);
  }
}