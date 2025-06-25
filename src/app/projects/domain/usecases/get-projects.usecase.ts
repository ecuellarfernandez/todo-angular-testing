import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { ProjectRepository } from '../repositories/project.repository';

@Injectable()
export class GetProjectsUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  execute(): Observable<Project[]> {
    return this.projectRepository.getProjects();
  }
}