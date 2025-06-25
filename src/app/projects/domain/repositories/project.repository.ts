import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

export abstract class ProjectRepository {
  abstract getProjects(): Observable<Project[]>;
  abstract getProjectById(id: string): Observable<Project>;
  abstract createProject(name: string, description?: string): Observable<Project>;
  abstract updateProject(id: string, name: string, description?: string): Observable<Project>;
  abstract deleteProject(id: string): Observable<void>;
}