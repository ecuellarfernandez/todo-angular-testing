import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { TaskRepository } from '../repositories/task.repository';

@Injectable()
export class GetTaskByIdUseCase {
  constructor(private taskRepository: TaskRepository) {}

  execute(projectId: string, todoListId: string, taskId: string): Observable<Task> {
    return this.taskRepository.getTaskById(projectId, todoListId, taskId);
  }
}