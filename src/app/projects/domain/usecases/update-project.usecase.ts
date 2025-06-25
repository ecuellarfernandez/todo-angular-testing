import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { ProjectRepository } from '../repositories/project.repository';

export class UpdateProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  execute(id: string, name: string, description?: string): Observable<Project> {
    return this.projectRepository.updateProject(id, name, description);
  }
}