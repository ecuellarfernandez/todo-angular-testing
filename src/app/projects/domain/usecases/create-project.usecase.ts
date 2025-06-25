import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { ProjectRepository } from '../repositories/project.repository';

export class CreateProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  execute(name: string, description?: string): Observable<Project> {
    return this.projectRepository.createProject(name, description);
  }
}