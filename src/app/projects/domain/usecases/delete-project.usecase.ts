import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectRepository } from '../repositories/project.repository';

@Injectable({ providedIn: 'root' })
export class DeleteProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  execute(id: string): Observable<void> {
    return this.projectRepository.deleteProject(id);
  }
}