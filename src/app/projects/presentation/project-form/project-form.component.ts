import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectRepositoryImpl } from '../../data/project-repository.impl';
import { CreateProjectUseCase } from '../../domain/usecases/create-project.usecase';
import { GetProjectByIdUseCase } from '../../domain/usecases/get-project-by-id.usecase';
import { UpdateProjectUseCase } from '../../domain/usecases/update-project.usecase';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  providers: [
    ProjectRepositoryImpl,
    {
      provide: CreateProjectUseCase,
      useFactory: (repo: ProjectRepositoryImpl) => new CreateProjectUseCase(repo),
      deps: [ProjectRepositoryImpl]
    },
    {
      provide: GetProjectByIdUseCase,
      useFactory: (repo: ProjectRepositoryImpl) => new GetProjectByIdUseCase(repo),
      deps: [ProjectRepositoryImpl]
    },
    {
      provide: UpdateProjectUseCase,
      useFactory: (repo: ProjectRepositoryImpl) => new UpdateProjectUseCase(repo),
      deps: [ProjectRepositoryImpl]
    }
  ]
})
export class ProjectFormComponent implements OnInit {
  form: any;
  projectId: string | null = null;
  isEditMode = false;
  loading = false;
  submitting = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private createProjectUseCase: CreateProjectUseCase,
    private getProjectByIdUseCase: GetProjectByIdUseCase,
    private updateProjectUseCase: UpdateProjectUseCase
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });

    this.projectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = this.route.snapshot.url[1]?.path === 'edit';

    if (this.isEditMode && this.projectId) {
      this.loadProject(this.projectId);
    }
  }

  loadProject(id: string): void {
    this.loading = true;
    this.getProjectByIdUseCase.execute(id).subscribe({
      next: (project) => {
        this.form.patchValue({
          name: project.name,
          description: project.description || ''
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el proyecto:', err);
        this.error = 'No se pudo cargar el proyecto. Por favor, inténtelo de nuevo.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid && !this.submitting) {
      this.submitting = true;
      const name = this.form.get('name')?.value;
      const description = this.form.get('description')?.value;

      if (this.isEditMode && this.projectId) {
        this.updateProjectUseCase.execute(this.projectId, name, description).subscribe({
          next: () => {
            this.router.navigate(['/projects']);
          },
          error: (err) => {
            console.error('Error al actualizar el proyecto:', err);
            this.error = 'No se pudo actualizar el proyecto. Por favor, inténtelo de nuevo.';
            this.submitting = false;
          }
        });
      } else {
        this.createProjectUseCase.execute(name, description).subscribe({
          next: () => {
            this.router.navigate(['/projects']);
          },
          error: (err) => {
            console.error('Error al crear el proyecto:', err);
            this.error = 'No se pudo crear el proyecto. Por favor, inténtelo de nuevo.';
            this.submitting = false;
          }
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/projects']);
  }
}