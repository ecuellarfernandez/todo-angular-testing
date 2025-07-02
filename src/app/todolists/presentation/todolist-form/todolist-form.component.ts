import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoList } from '../../domain/models/todolist.model';
import { CreateTodoListUseCase } from '../../domain/usecases/create-todolist.usecase';
import { GetTodoListByIdUseCase } from '../../domain/usecases/get-todolist-by-id.usecase';
import { UpdateTodoListUseCase } from '../../domain/usecases/update-todolist.usecase';
import { TodoListRepositoryImpl } from '../../data/todolist-repository.impl';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-todolist-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todolist-form.component.html',
  providers: [
    TodoListRepositoryImpl,
    {
      provide: CreateTodoListUseCase,
      useFactory: (repo: TodoListRepositoryImpl) => new CreateTodoListUseCase(repo),
      deps: [TodoListRepositoryImpl]
    },
    {
      provide: GetTodoListByIdUseCase,
      useFactory: (repo: TodoListRepositoryImpl) => new GetTodoListByIdUseCase(repo),
      deps: [TodoListRepositoryImpl]
    },
    {
      provide: UpdateTodoListUseCase,
      useFactory: (repo: TodoListRepositoryImpl) => new UpdateTodoListUseCase(repo),
      deps: [TodoListRepositoryImpl]
    }
  ]
})
export class TodoListFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  error = '';
  projectId = '';
  todoListId = '';

  constructor(
    private fb: FormBuilder,
    private createTodoListUseCase: CreateTodoListUseCase,
    private getTodoListByIdUseCase: GetTodoListByIdUseCase,
    private updateTodoListUseCase: UpdateTodoListUseCase,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const projectId = params.get('projectId');
      const todoListId = params.get('todoListId');

      if (!projectId) {
        this.error = 'ID de proyecto no encontrado';
        return;
      }

      this.projectId = projectId;
      
      if (todoListId) {
        this.isEditMode = true;
        this.todoListId = todoListId;
        this.loadTodoList(projectId, todoListId);
      }
    });
  }

  loadTodoList(projectId: string, todoListId: string): void {
    this.loading = true;
    this.getTodoListByIdUseCase.execute(projectId, todoListId).subscribe({
      next: (todoList) => {
        this.form.patchValue({
          name: todoList.name
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar la lista de tareas:', err);
        this.error = 'No se pudo cargar la información de la lista de tareas.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const { name } = this.form.value;

    if (this.isEditMode) {
      this.updateTodoListUseCase.execute(this.projectId, this.todoListId, name).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate([`/projects/${this.projectId}/todolists`]);
        },
        error: (err) => {
          console.error('Error al actualizar la lista de tareas:', err);
          this.error = 'No se pudo actualizar la lista de tareas. Por favor, inténtelo de nuevo.';
          this.submitting = false;
        }
      });
    } else {
      this.createTodoListUseCase.execute(this.projectId, name).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate([`/projects/${this.projectId}/todolists`]);
        },
        error: (err) => {
          console.error('Error al crear la lista de tareas:', err);
          this.error = 'No se pudo crear la lista de tareas. Por favor, inténtelo de nuevo.';
          this.submitting = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate([`/projects/${this.projectId}/todolists`]);
  }
}