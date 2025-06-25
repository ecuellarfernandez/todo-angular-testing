import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../domain/models/task.model';
import { CreateTaskUseCase } from '../../domain/usecases/create-task.usecase';
import { GetTaskByIdUseCase } from '../../domain/usecases/get-task-by-id.usecase';
import { UpdateTaskUseCase } from '../../domain/usecases/update-task.usecase';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { TaskRepositoryImpl } from '../../data/task-repository.impl';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  providers: [
    CreateTaskUseCase,
    GetTaskByIdUseCase,
    UpdateTaskUseCase,
    { provide: TaskRepository, useClass: TaskRepositoryImpl }
  ]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  isLoading = false;
  error: string | null = null;
  projectId: string = '';
  todoListId: string = '';
  taskId: string = '';

  constructor(
    private fb: FormBuilder,
    private createTaskUseCase: CreateTaskUseCase,
    private getTaskByIdUseCase: GetTaskByIdUseCase,
    private updateTaskUseCase: UpdateTaskUseCase,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      dueDate: [''],
      completed: [false]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.todoListId = params['todoListId'];
      this.taskId = params['taskId'];

      if (this.taskId && this.taskId !== 'new') {
        this.isEditMode = true;
        this.loadTask();
      }
    });
  }

  loadTask(): void {
    this.isLoading = true;
    this.getTaskByIdUseCase.execute(this.projectId, this.todoListId, this.taskId).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description || '',
          dueDate: task.dueDate ? this.formatDateForInput(task.dueDate) : '',
          completed: task.completed
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar la tarea: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const { title, description, dueDate, completed } = this.taskForm.value;

    if (this.isEditMode) {
      this.updateTaskUseCase.execute(
        this.projectId,
        this.todoListId,
        this.taskId,
        title,
        description,
        dueDate
      ).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/projects', this.projectId, 'todolists', this.todoListId, 'tasks']);
        },
        error: (err) => {
          this.error = 'Error al actualizar la tarea: ' + err.message;
          this.isSubmitting = false;
        }
      });
    } else {
      this.createTaskUseCase.execute(
        this.projectId,
        this.todoListId,
        title,
        description,
        dueDate
      ).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/projects', this.projectId, 'todolists', this.todoListId, 'tasks']);
        },
        error: (err) => {
          this.error = 'Error al crear la tarea: ' + err.message;
          this.isSubmitting = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/projects', this.projectId, 'todolists', this.todoListId, 'tasks']);
  }

  // Método auxiliar para formatear la fecha para el input type="date"
  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}