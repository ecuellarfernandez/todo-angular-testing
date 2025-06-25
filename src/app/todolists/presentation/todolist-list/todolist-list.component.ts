import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoList } from '../../domain/models/todolist.model';
import { GetTodoListsUseCase } from '../../domain/usecases/get-todolists.usecase';
import { DeleteTodoListUseCase } from '../../domain/usecases/delete-todolist.usecase';
import { TodoListRepositoryImpl } from '../../data/todolist-repository.impl';
import { DialogService } from '../../../core/services/dialog.service';
// Importamos el modelo Project y el caso de uso desde el módulo de proyectos
import { Project } from '../../../projects/domain/models/project.model';
import { GetProjectByIdUseCase } from '../../../projects/domain/usecases/get-project-by-id.usecase';
import { ProjectRepositoryImpl } from '../../../projects/data/project-repository.impl';

@Component({
  selector: 'app-todolist-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todolist-list.component.html',
  providers: [
    TodoListRepositoryImpl,
    ProjectRepositoryImpl,
    {
      provide: GetTodoListsUseCase,
      useFactory: (repo: TodoListRepositoryImpl) => new GetTodoListsUseCase(repo),
      deps: [TodoListRepositoryImpl]
    },
    {
      provide: DeleteTodoListUseCase,
      useFactory: (repo: TodoListRepositoryImpl) => new DeleteTodoListUseCase(repo),
      deps: [TodoListRepositoryImpl]
    },
    {
      provide: GetProjectByIdUseCase,
      useFactory: (repo: ProjectRepositoryImpl) => new GetProjectByIdUseCase(repo),
      deps: [ProjectRepositoryImpl]
    }
  ]
})
export class TodoListListComponent implements OnInit {
  todoLists: TodoList[] = [];
  project: Project | null = null;
  projectId: string = '';
  loading = true;
  error = '';

  constructor(
    private getTodoListsUseCase: GetTodoListsUseCase,
    private deleteTodoListUseCase: DeleteTodoListUseCase,
    private getProjectByIdUseCase: GetProjectByIdUseCase,
    private route: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = id;
        this.loadProject(id);
        this.loadTodoLists(id);
      } else {
        this.error = 'ID de proyecto no encontrado';
        this.loading = false;
      }
    });
  }

  loadProject(id: string): void {
    this.getProjectByIdUseCase.execute(id).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (err) => {
        console.error('Error al cargar el proyecto:', err);
        this.error = 'No se pudo cargar la información del proyecto.';
        this.loading = false;
      }
    });
  }

  loadTodoLists(projectId: string): void {
    this.loading = true;
    this.getTodoListsUseCase.execute(projectId).subscribe({
      next: (todoLists) => {
        this.todoLists = todoLists;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar listas de tareas:', err);
        this.error = 'No se pudieron cargar las listas de tareas. Por favor, inténtelo de nuevo.';
        this.loading = false;
      }
    });
  }

  createTodoList(): void {
    this.router.navigate([`/projects/${this.projectId}/todolists/new`]);
  }

  editTodoList(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate([`/projects/${this.projectId}/todolists/${id}/edit`]);
  }

  deleteTodoList(id: string, event: Event): void {
    event.stopPropagation();
    
    this.dialogService.confirm({
      title: 'Eliminar lista de tareas',
      message: '¿Está seguro de que desea eliminar esta lista de tareas?',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(confirmed => {
      if (confirmed) {
        this.deleteTodoListUseCase.execute(this.projectId, id).subscribe({
          next: () => {
            this.todoLists = this.todoLists.filter(todoList => todoList.id !== id);
          },
          error: (err) => {
            console.error('Error al eliminar la lista de tareas:', err);
            this.dialogService.confirm({
              title: 'Error',
              message: 'No se pudo eliminar la lista de tareas. Por favor, inténtelo de nuevo.',
              confirmButtonText: 'Aceptar',
              cancelButtonText: ''
            });
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}