import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { TaskRepository } from '../repositories/task.repository';

@Injectable({ providedIn: 'root' })
export class UpdateTasksOrderUseCase {
  constructor(private taskRepository: TaskRepository) {}

  execute(projectId: string, todoListId: string, taskIds: string[]): Observable<Task[]> {
    return this.taskRepository.updateTasksOrder(projectId, todoListId, taskIds);
  }
}