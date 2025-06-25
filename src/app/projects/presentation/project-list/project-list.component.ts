import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectRepositoryImpl } from '../../data/project-repository.impl';
import { GetProjectsUseCase } from '../../domain/usecases/get-projects.usecase';
import { DeleteProjectUseCase } from '../../domain/usecases/delete-project.usecase';
import { Project } from '../../domain/models/project.model';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-list.component.html',
  providers: [
    ProjectRepositoryImpl,
    {
      provide: GetProjectsUseCase,
      useFactory: (repo: ProjectRepositoryImpl) => new GetProjectsUseCase(repo),
      deps: [ProjectRepositoryImpl]
    },
    {
      provide: DeleteProjectUseCase,
      useFactory: (repo: ProjectRepositoryImpl) => new DeleteProjectUseCase(repo),
      deps: [ProjectRepositoryImpl]
    }
  ]
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  loading = true;
  error = '';

  constructor(
    private getProjectsUseCase: GetProjectsUseCase,
    private deleteProjectUseCase: DeleteProjectUseCase,
    private router: Router,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.getProjectsUseCase.execute().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar proyectos:', err);
        this.error = 'No se pudieron cargar los proyectos. Por favor, inténtelo de nuevo.';
        this.loading = false;
      }
    });
  }

  createProject(): void {
    this.router.navigate(['/projects/new']);
  }

  editProject(id: string): void {
    this.router.navigate([`/projects/${id}/edit`]);
  }

  deleteProject(id: string, event: Event): void {
    event.stopPropagation();
    
    this.dialogService.confirm({
      title: 'Eliminar proyecto',
      message: '¿Está seguro de que desea eliminar este proyecto?',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(confirmed => {
      if (confirmed) {
        this.deleteProjectUseCase.execute(id).subscribe({
          next: () => {
            this.projects = this.projects.filter(project => project.id !== id);
          },
          error: (err) => {
            console.error('Error al eliminar el proyecto:', err);
            this.dialogService.confirm({
              title: 'Error',
              message: 'No se pudo eliminar el proyecto. Por favor, inténtelo de nuevo.',
              confirmButtonText: 'Aceptar',
              cancelButtonText: ''
            });
          }
        });
      }
    });
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }
}