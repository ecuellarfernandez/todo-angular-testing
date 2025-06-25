import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { TaskRepository } from '../repositories/task.repository';

@Injectable()
export class UpdateTaskStatusUseCase {
  constructor(private taskRepository: TaskRepository) {}

  execute(projectId: string, todoListId: string, taskId: string, completed: boolean): Observable<Task> {
    return this.taskRepository.updateTaskStatus(projectId, todoListId, taskId, completed);
  }
}