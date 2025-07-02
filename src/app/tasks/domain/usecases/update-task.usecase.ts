import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { TaskRepository } from '../repositories/task.repository';

@Injectable()
export class UpdateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  execute(projectId: string, todoListId: string, taskId: string, title: string, description?: string, dueDate?: string): Observable<Task> {
    return this.taskRepository.updateTask(projectId, todoListId, taskId, title, description, dueDate);
  }
}