import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectRepository } from '../domain/repositories/project.repository';
import { Project } from '../domain/models/project.model';
import { environment } from '../../../enviroments/enviroment';

@Injectable()
export class ProjectRepositoryImpl implements ProjectRepository {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createProject(name: string, description?: string): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, { name, description });
  }

  updateProject(id: string, name: string, description?: string): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, { name, description });
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}