import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Project } from '../../../projects/domain/models/project.model';
import { Task } from '../../../tasks/domain/models/task.model';
import { GetProjectsUseCase } from '../../../projects/domain/usecases/get-projects.usecase';
import { ProjectRepository } from '../../../projects/domain/repositories/project.repository';
import { ProjectRepositoryImpl } from '../../../projects/data/project-repository.impl';
import { TaskRepository } from '../../../tasks/domain/repositories/task.repository';
import { TaskRepositoryImpl } from '../../../tasks/data/task-repository.impl';
import { GetRecentTasksUseCase } from '../../../tasks/domain/usecases/get-recent-tasks.usecase';
import { TodoListRepository } from '../../../todolists/domain/repositories/todolist.repository';
import { TodoListRepositoryImpl } from '../../../todolists/data/todolist-repository.impl';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    GetProjectsUseCase,
    GetRecentTasksUseCase,
    { provide: ProjectRepository, useClass: ProjectRepositoryImpl },
    { provide: TaskRepository, useClass: TaskRepositoryImpl },
    { provide: TodoListRepository, useClass: TodoListRepositoryImpl }
  ]
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  recentTasks: Task[] = [];
  loading: boolean = false;
  loadingTasks: boolean = false;
  error: string | null = null;
  errorTasks: string | null = null;

  constructor(
    private getProjectsUseCase: GetProjectsUseCase,
    private getRecentTasksUseCase: GetRecentTasksUseCase,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadRecentTasks();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = null;
    
    this.getProjectsUseCase.execute().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar proyectos: ' + err.message;
        this.loading = false;
      }
    });
  }

  loadRecentTasks(): void {
    this.loadingTasks = true;
    this.errorTasks = null;
    
    this.getRecentTasksUseCase.execute().subscribe({
      next: (tasks) => {
        this.recentTasks = tasks;
        this.loadingTasks = false;
      },
      error: (err) => {
        this.errorTasks = 'Error al cargar tareas recientes: ' + err.message;
        this.loadingTasks = false;
      }
    });
  }
  
  navigateToTaskDetail(projectId: string, todoListId: string, taskId: string): void {
    this.router.navigate(['/projects', projectId, 'todolists', todoListId, 'tasks', taskId, 'edit']);
  }
  
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  
  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }
}