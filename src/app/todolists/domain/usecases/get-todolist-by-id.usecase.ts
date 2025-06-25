import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoList } from '../models/todolist.model';
import { TodoListRepository } from '../repositories/todolist.repository';

@Injectable()
export class GetTodoListByIdUseCase {
  constructor(private todoListRepository: TodoListRepository) {}

  execute(projectId: string, todoListId: string): Observable<TodoList> {
    return this.todoListRepository.getTodoListById(projectId, todoListId);
  }
}