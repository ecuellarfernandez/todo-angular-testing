import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskRepository } from '../repositories/task.repository';

@Injectable()
export class DeleteTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  execute(projectId: string, todoListId: string, taskId: string): Observable<void> {
    return this.taskRepository.deleteTask(projectId, todoListId, taskId);
  }
}