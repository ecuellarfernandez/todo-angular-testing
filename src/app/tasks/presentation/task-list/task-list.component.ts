import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Task } from '../../domain/models/task.model';
import { TodoList } from '../../../todolists/domain/models/todolist.model';
import { Project } from '../../../projects/domain/models/project.model';
import { GetTasksUseCase } from '../../domain/usecases/get-tasks.usecase';
import { DeleteTaskUseCase } from '../../domain/usecases/delete-task.usecase';
import { UpdateTaskStatusUseCase } from '../../domain/usecases/update-task-status.usecase';
import { GetTodoListByIdUseCase } from '../../../todolists/domain/usecases/get-todolist-by-id.usecase';
import { GetProjectByIdUseCase } from '../../../projects/domain/usecases/get-project-by-id.usecase';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { TaskRepositoryImpl } from '../../data/task-repository.impl';
import { TodoListRepository } from '../../../todolists/domain/repositories/todolist.repository';
import { TodoListRepositoryImpl } from '../../../todolists/data/todolist-repository.impl';
import { ProjectRepository } from '../../../projects/domain/repositories/project.repository';
import { ProjectRepositoryImpl } from '../../../projects/data/project-repository.impl';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  providers: [
    GetTasksUseCase,
    DeleteTaskUseCase,
    UpdateTaskStatusUseCase,
    GetTodoListByIdUseCase,
    GetProjectByIdUseCase,
    { provide: TaskRepository, useClass: TaskRepositoryImpl },
    { provide: TodoListRepository, useClass: TodoListRepositoryImpl },
    { provide: ProjectRepository, useClass: ProjectRepositoryImpl }
  ]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  todoList: TodoList | null = null;
  project: Project | null = null;
  projectId: string = '';
  todoListId: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private getTasksUseCase: GetTasksUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase,
    private updateTaskStatusUseCase: UpdateTaskStatusUseCase,
    private getTodoListByIdUseCase: GetTodoListByIdUseCase,
    private getProjectByIdUseCase: GetProjectByIdUseCase,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.todoListId = params['todoListId'];
      this.loadProject();
      this.loadTodoList();
      this.loadTasks();
    });
  }

  loadProject(): void {
    if (!this.projectId) return;
    
    this.isLoading = true;
    this.getProjectByIdUseCase.execute(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el proyecto: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  loadTodoList(): void {
    if (!this.projectId || !this.todoListId) return;
    
    this.isLoading = true;
    this.getTodoListByIdUseCase.execute(this.projectId, this.todoListId).subscribe({
      next: (todoList) => {
        this.todoList = todoList;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar la lista de tareas: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  loadTasks(): void {
    if (!this.projectId || !this.todoListId) return;
    
    this.isLoading = true;
    this.error = null;
    
    this.getTasksUseCase.execute(this.projectId, this.todoListId).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las tareas: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  createTask(): void {
    this.router.navigate(['/projects', this.projectId, 'todolists', this.todoListId, 'tasks', 'new']);
  }

  editTask(taskId: string): void {
    this.router.navigate(['/projects', this.projectId, 'todolists', this.todoListId, 'tasks', taskId, 'edit']);
  }

  deleteTask(taskId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.isLoading = true;
      this.deleteTaskUseCase.execute(this.projectId, this.todoListId, taskId).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(task => task.id !== taskId);
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Error al eliminar la tarea: ' + err.message;
          this.isLoading = false;
        }
      });
    }
  }

  toggleTaskStatus(task: Task): void {
    this.isLoading = true;
    this.updateTaskStatusUseCase.execute(
      this.projectId, 
      this.todoListId, 
      task.id, 
      !task.completed
    ).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al actualizar el estado de la tarea: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects', this.projectId, 'todolists']);
  }

  goToProjects(): void {
    this.router.navigate(['/projects']);
  }

}