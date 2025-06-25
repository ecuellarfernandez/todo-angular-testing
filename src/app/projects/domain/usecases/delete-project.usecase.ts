import { Observable } from 'rxjs';
import { ProjectRepository } from '../repositories/project.repository';

export class DeleteProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  execute(id: string): Observable<void> {
    return this.projectRepository.deleteProject(id);
  }
}