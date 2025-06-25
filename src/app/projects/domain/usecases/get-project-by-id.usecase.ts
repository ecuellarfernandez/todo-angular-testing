import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { ProjectRepository } from '../repositories/project.repository';

export class GetProjectByIdUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  execute(id: string): Observable<Project> {
    return this.projectRepository.getProjectById(id);
  }
}