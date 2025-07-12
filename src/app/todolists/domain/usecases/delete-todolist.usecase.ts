import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoListRepository } from '../repositories/todolist.repository';

@Injectable({ providedIn: 'root' })
export class DeleteTodoListUseCase {
  constructor(private todoListRepository: TodoListRepository) {}

  execute(projectId: string, todoListId: string): Observable<void> {
    return this.todoListRepository.deleteTodoList(projectId, todoListId);
  }
}