import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { GetProjectsUseCase } from '../../../projects/domain/usecases/get-projects.usecase';
import { GetRecentTasksUseCase } from '../../../tasks/domain/usecases/get-recent-tasks.usecase';
import { GetTodoListsUseCase } from '../../../todolists/domain/usecases/get-todolists.usecase';
import { GetTasksUseCase } from '../../../tasks/domain/usecases/get-tasks.usecase';
import { UpdateTaskStatusUseCase } from '../../../tasks/domain/usecases/update-task-status.usecase';
import { DeleteTaskUseCase } from '../../../tasks/domain/usecases/delete-task.usecase';
import { DeleteTodoListUseCase } from '../../../todolists/domain/usecases/delete-todolist.usecase';
import { DeleteProjectUseCase } from '../../../projects/domain/usecases/delete-project.usecase';
import { CreateTodoListUseCase } from '../../../todolists/domain/usecases/create-todolist.usecase';
import { UpdateTodoListUseCase } from '../../../todolists/domain/usecases/update-todolist.usecase';
import { CreateTaskUseCase } from '../../../tasks/domain/usecases/create-task.usecase';
import { UpdateTaskUseCase } from '../../../tasks/domain/usecases/update-task.usecase';
import { UpdateTasksOrderUseCase } from '../../../tasks/domain/usecases/update-tasks-order.usecase';
import { CreateProjectUseCase } from '../../../projects/domain/usecases/create-project.usecase';
import { UpdateProjectUseCase } from '../../../projects/domain/usecases/update-project.usecase';
import { GetCurrentUserUsecase } from '../../../auth/domain/usecases/get-current-user.usecase';
import { Project } from '../../../projects/domain/models/project.model';
import { Task } from '../../../tasks/domain/models/task.model';
import { TodoList } from '../../../todolists/domain/models/todolist.model';
import { TodoListModalComponent } from '../todolist-modal/todolist-modal.component';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DragDropModule, TodoListModalComponent, TaskModalComponent, ProjectModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  recentTasks: Task[] = [];
  projectTodoLists: { [projectId: string]: TodoList[] } = {};
  todoListTasks: { [todoListId: string]: Task[] } = {};
  
  // Estados de carga y error
  loading = false;
  loadingTasks: { [todoListId: string]: boolean } = {};
  loadingTodoLists: { [projectId: string]: boolean } = {};
  error: string | null = null;
  errorTasks: string | null = null;
  todoListErrors: { [projectId: string]: string | null } = {};
  taskErrors: { [todoListId: string]: string | null } = {};
  
  // Estados de expansión para acordeones
  expandedProjects: string[] = [];
  expandedTodoLists: { [projectId: string]: string[] } = {};

  // Estados para modales
  todoListModalOpen = false;
  todoListEditMode = false;
  selectedProjectId = '';
  selectedTodoList: TodoList | null = null;
  
  taskModalOpen = false;
  taskEditMode = false;
  selectedTodoListId = '';
  selectedTask: Task | null = null;
  
  projectModalOpen = false;
  projectEditMode = false;
  selectedProject: Project | null = null;

  // Usuario actual
  userName: string = '';

  constructor(
    private getCurrentUserUsecase: GetCurrentUserUsecase,
    private getProjectsUseCase: GetProjectsUseCase,
    private getRecentTasksUseCase: GetRecentTasksUseCase,
    private getTodoListsUseCase: GetTodoListsUseCase,
    private getTasksUseCase: GetTasksUseCase,
    private updateTaskStatusUseCase: UpdateTaskStatusUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase,
    private deleteTodoListUseCase: DeleteTodoListUseCase,
    private deleteProjectUseCase: DeleteProjectUseCase,
    private createTodoListUseCase: CreateTodoListUseCase,
    private updateTodoListUseCase: UpdateTodoListUseCase,
    private createTaskUseCase: CreateTaskUseCase,
    private updateTaskUseCase: UpdateTaskUseCase,
    private updateTasksOrderUseCase: UpdateTasksOrderUseCase,
    private createProjectUseCase: CreateProjectUseCase,
    private updateProjectUseCase: UpdateProjectUseCase,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadProjects();
    this.loadRecentTasks();
  }

  loadCurrentUser(): void {
    this.getCurrentUserUsecase.execute().subscribe({
      next: (user) => {
        this.userName = user.username || 'Usuario';
      },
      error: (err) => {
        console.error('Error loading current user', err);
        this.userName = 'Usuario'; // Fallback simple
      }
    });
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
        console.error('Error loading projects', err);
        this.error = 'Error al cargar los proyectos. Por favor, inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }

  loadRecentTasks(): void {
    this.errorTasks = null;

    this.getRecentTasksUseCase.execute().subscribe({
      next: (tasks) => {
        this.recentTasks = tasks;
      },
      error: (err) => {
        console.error('Error loading recent tasks', err);
        this.errorTasks = 'Error al cargar las tareas recientes. Por favor, inténtalo de nuevo.';
      }
    });
  }

  loadTodoLists(projectId: string): void {
    if (this.projectTodoLists[projectId]) return; // Ya cargadas
    
    this.loadingTodoLists[projectId] = true;
    this.todoListErrors[projectId] = null;

    this.getTodoListsUseCase.execute(projectId).subscribe({
      next: (todoLists) => {
        this.projectTodoLists[projectId] = todoLists;
        this.loadingTodoLists[projectId] = false;
      },
      error: (err) => {
        console.error(`Error loading todo lists for project ${projectId}`, err);
        this.todoListErrors[projectId] = 'Error al cargar las listas. Por favor, inténtalo de nuevo.';
        this.loadingTodoLists[projectId] = false;
      }
    });
  }

  loadTasks(projectId: string, todoListId: string): void {
    if (this.todoListTasks[todoListId]) return; // Ya cargadas
    
    this.loadingTasks[todoListId] = true;
    this.taskErrors[todoListId] = null;

    this.getTasksUseCase.execute(projectId, todoListId).subscribe({
      next: (tasks) => {
        // Ordenar las tareas por posición si está disponible, sino por fecha de creación
        const sortedTasks = tasks.sort((a, b) => {
          if (a.position !== undefined && b.position !== undefined) {
            return a.position - b.position;
          }
          return 0;
        });
        this.todoListTasks[todoListId] = sortedTasks;
        this.loadingTasks[todoListId] = false;
      },
      error: (err) => {
        console.error(`Error loading tasks for todo list ${todoListId}`, err);
        this.taskErrors[todoListId] = 'Error al cargar las tareas. Por favor, inténtalo de nuevo.';
        this.loadingTasks[todoListId] = false;
      }
    });
  }


  toggleProject(projectId: string): void {
    const index = this.expandedProjects.indexOf(projectId);
    if (index === -1) {
      this.expandedProjects.push(projectId);
      this.loadTodoLists(projectId);
    } else {
      this.expandedProjects.splice(index, 1);
    }
  }

  toggleTodoList(projectId: string, todoListId: string): void {
    if (!this.expandedTodoLists[projectId]) {
      this.expandedTodoLists[projectId] = [];
    }

    const index = this.expandedTodoLists[projectId].indexOf(todoListId);
    if (index === -1) {
      this.expandedTodoLists[projectId].push(todoListId);
      this.loadTasks(projectId, todoListId);
    } else {
      this.expandedTodoLists[projectId].splice(index, 1);
    }
  }

  isExpandedTodoList(projectId: string, todoListId: string): boolean {
    return this.expandedTodoLists[projectId]?.includes(todoListId) || false;
  }

  // Métodos para filtrar tareas
  getPendingTasks(todoListId: string): Task[] {
    return this.todoListTasks[todoListId]?.filter(task => !task.completed) || [];
  }

  getCompletedTasks(todoListId: string): Task[] {
    return this.todoListTasks[todoListId]?.filter(task => task.completed) || [];
  }

  // Métodos para acciones de usuario
  toggleTaskStatus(projectId: string, todoListId: string, task: Task, event: Event): void {
    event.stopPropagation();
    const updatedTask = { ...task, completed: !task.completed };
    
    this.updateTaskStatusUseCase.execute(projectId, todoListId, task.id, updatedTask.completed).subscribe({
      next: () => {
        const taskIndex = this.todoListTasks[todoListId].findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
          this.todoListTasks[todoListId][taskIndex].completed = updatedTask.completed;
        }
        
        const recentTaskIndex = this.recentTasks.findIndex(t => t.id === task.id);
        if (recentTaskIndex !== -1) {
          this.recentTasks[recentTaskIndex].completed = updatedTask.completed;
        }
      },
      error: (err) => {
        console.error('Error updating task status', err);
        task.completed = !task.completed;
      }
    });
  }

  createProject(): void {
    this.projectEditMode = false;
    this.selectedProject = null;
    this.projectModalOpen = true;
  }

  editProject(projectId: string, event: Event): void {
    event.stopPropagation();
    this.projectEditMode = true;
    
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      this.selectedProject = project;
      this.projectModalOpen = true;
    } else {
      console.error('Project not found');
      this.dialogService.confirm(
        'Error',
        'No se pudo encontrar el proyecto para editar.',
        'Aceptar'
      );
    }
  }
  
  onProjectModalClose(): void {
    this.projectModalOpen = false;
    this.selectedProject = null;
    this.projectEditMode = false;
  }
  
  onProjectSave(data: {projectId?: string, project: Partial<Project>}): void {
    if (this.projectEditMode && data.projectId) {
      this.updateProjectUseCase.execute(data.projectId, data.project.name || '', data.project.description).subscribe({
        next: (updatedProject) => {
          const index = this.projects.findIndex(p => p.id === data.projectId);
          if (index !== -1) {
            this.projects[index] = updatedProject;
          }
          this.projectModalOpen = false;
          this.selectedProject = null;
          this.projectEditMode = false;
        },
        error: (err) => {
          console.error('Error updating project', err);
          this.dialogService.confirm(
            'Error',
            'Error al actualizar el proyecto. Por favor, inténtalo de nuevo.',
            'Aceptar'
          );
        }
      });
    } else {
      this.createProjectUseCase.execute(data.project.name || '', data.project.description).subscribe({
        next: (newProject) => {
          this.projects.push(newProject);
          this.projectModalOpen = false;
          this.selectedProject = null;
          this.projectEditMode = false;
        },
        error: (err) => {
          console.error('Error creating project', err);
          this.dialogService.confirm(
            'Error',
            'Error al crear el proyecto. Por favor, inténtalo de nuevo.',
            'Aceptar'
          );
        }
      });
    }
  }

  deleteProject(projectId: string, event: Event): void {
    event.stopPropagation();
    this.dialogService.confirm(
      'Eliminar proyecto',
      '¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.',
      'Eliminar',
      'Cancelar'
    ).then(confirmed => {
      if (confirmed) {
        this.deleteProjectUseCase.execute(projectId).subscribe({
          next: () => {
            this.projects = this.projects.filter(p => p.id !== projectId);
            delete this.projectTodoLists[projectId];
            delete this.loadingTodoLists[projectId];
            delete this.todoListErrors[projectId];
            delete this.expandedTodoLists[projectId];
            
            this.recentTasks = this.recentTasks.filter(t => t.projectId !== projectId);
          },
          error: (err) => {
            console.error('Error deleting project', err);
            this.dialogService.confirm(
              'Error',
              'Error al eliminar el proyecto. Por favor, inténtalo de nuevo.',
              'Aceptar'
            );
          }
        });
      }
    });
  }

  createTodoList(projectId: string, event: Event): void {
    event.stopPropagation();
    this.selectedProjectId = projectId;
    this.todoListEditMode = false;
    this.selectedTodoList = null;
    this.todoListModalOpen = true;
  }

  editTodoList(projectId: string, todoListId: string, event: Event): void {
    event.stopPropagation();
    this.selectedProjectId = projectId;
    this.todoListEditMode = true;
    
    const todoList = this.projectTodoLists[projectId]?.find(list => list.id === todoListId);
    if (todoList) {
      this.selectedTodoList = todoList;
      this.todoListModalOpen = true;
    } else {
      console.error('TodoList not found');
      this.dialogService.confirm(
        'Error',
        'No se pudo encontrar la lista para editar.',
        'Aceptar'
      );
    }
  }
  
  onTodoListModalClose(): void {
    this.todoListModalOpen = false;
    this.selectedTodoList = null;
    this.todoListEditMode = false;
  }
  
  onTodoListSave(data: {projectId: string, todoListId?: string, name: string}): void {
    if (this.todoListEditMode && data.todoListId) {
      this.updateTodoListUseCase.execute(data.projectId, data.todoListId, data.name).subscribe({
        next: (updatedTodoList) => {
          const index = this.projectTodoLists[data.projectId].findIndex(list => list.id === data.todoListId);
          if (index !== -1) {
            this.projectTodoLists[data.projectId][index] = updatedTodoList;
          }
          this.todoListModalOpen = false;
          this.selectedTodoList = null;
          this.todoListEditMode = false;
        },
        error: (err) => {
          console.error('Error updating todo list', err);
          this.dialogService.confirm(
            'Error',
            'Error al actualizar la lista. Por favor, inténtalo de nuevo.',
            'Aceptar'
          );
        }
      });
    } else {
      this.createTodoListUseCase.execute(data.projectId, data.name).subscribe({
        next: (newTodoList) => {
          if (!this.projectTodoLists[data.projectId]) {
            this.projectTodoLists[data.projectId] = [];
          }
          this.projectTodoLists[data.projectId].push(newTodoList);
          this.todoListModalOpen = false;
          this.selectedTodoList = null;
          this.todoListEditMode = false;
        },
        error: (err) => {
          console.error('Error creating todo list', err);
          this.dialogService.confirm(
            'Error',
            'Error al crear la lista. Por favor, inténtalo de nuevo.',
            'Aceptar'
          );
        }
      });
    }
  }

  deleteTodoList(projectId: string, todoListId: string, event: Event): void {
    event.stopPropagation();
    this.dialogService.confirm(
      'Eliminar lista',
      '¿Estás seguro de que deseas eliminar esta lista? Se eliminarán todas las tareas asociadas.',
      'Eliminar',
      'Cancelar'
    ).then(confirmed => {
      if (confirmed) {
        this.deleteTodoListUseCase.execute(projectId, todoListId).subscribe({
          next: () => {
            if (this.projectTodoLists[projectId]) {
              this.projectTodoLists[projectId] = this.projectTodoLists[projectId].filter(list => list.id !== todoListId);
            }
            
            delete this.todoListTasks[todoListId];
            delete this.loadingTasks[todoListId];
            delete this.taskErrors[todoListId];
            
            if (this.expandedTodoLists[projectId]) {
              const index = this.expandedTodoLists[projectId].indexOf(todoListId);
              if (index !== -1) {
                this.expandedTodoLists[projectId].splice(index, 1);
              }
            }
            
            this.recentTasks = this.recentTasks.filter(t => t.todoListId !== todoListId);
          },
          error: (err) => {
            console.error('Error deleting todo list', err);
            this.dialogService.confirm(
              'Error',
              'Error al eliminar la lista. Por favor, inténtalo de nuevo.',
              'Aceptar'
            );
          }
        });
      }
    });
  }

  createTask(projectId: string, todoListId: string, event: Event): void {
    event.stopPropagation();
    this.selectedProjectId = projectId;
    this.selectedTodoListId = todoListId;
    this.taskEditMode = false;
    this.selectedTask = null;
    this.taskModalOpen = true;
  }

  editTask(projectId: string, todoListId: string, taskId: string, event: Event): void {
    event.stopPropagation();
    this.selectedProjectId = projectId;
    this.selectedTodoListId = todoListId;
    this.taskEditMode = true;
    
    const task = this.todoListTasks[todoListId]?.find(task => task.id === taskId);
    if (task) {
      this.selectedTask = task;
      this.taskModalOpen = true;
    } else {
      console.error('Task not found');
      this.dialogService.confirm(
        'Error',
        'No se pudo encontrar la tarea para editar.',
        'Aceptar'
      );
    }
  }
  
  onTaskModalClose(): void {
    this.taskModalOpen = false;
    this.selectedTask = null;
    this.taskEditMode = false;
    this.selectedProjectId = '';
    this.selectedTodoListId = '';
  }
  
  onTaskSave(data: {projectId: string, todoListId: string, taskId?: string, task: Partial<Task>}): void {
    if (this.taskEditMode && data.taskId) {
      this.updateTaskUseCase.execute(data.projectId, data.todoListId, data.taskId, data.task.title || '', data.task.description, data.task.dueDate).subscribe({
        next: (updatedTask) => {
          const index = this.todoListTasks[data.todoListId].findIndex(task => task.id === data.taskId);
          if (index !== -1) {
            this.todoListTasks[data.todoListId][index] = updatedTask;
          }
          
          const recentIndex = this.recentTasks.findIndex(task => task.id === data.taskId);
          if (recentIndex !== -1) {
            this.recentTasks[recentIndex] = updatedTask;
          }
          
          this.taskModalOpen = false;
          this.selectedTask = null;
          this.taskEditMode = false;
        },
        error: (err) => {
          console.error('Error updating task', err);
          this.dialogService.confirm(
            'Error',
            'Error al actualizar la tarea. Por favor, inténtalo de nuevo.',
            'Aceptar'
          );
        }
      });
    } else {
      this.createTaskUseCase.execute(data.projectId, data.todoListId, data.task.title || '', data.task.description, data.task.dueDate).subscribe({
        next: (newTask) => {
          newTask.completed = false;
          
          if (!this.todoListTasks[data.todoListId]) {
            this.todoListTasks[data.todoListId] = [];
          }
          this.todoListTasks[data.todoListId].push(newTask);
          
          this.recentTasks.unshift(newTask);
          if (this.recentTasks.length > 5) {
            this.recentTasks.pop();
          }
          
          this.taskModalOpen = false;
          this.selectedTask = null;
          this.taskEditMode = false;
        },
        error: (err) => {
          console.error('Error creating task', err);
          this.dialogService.confirm(
            'Error',
            'Error al crear la tarea. Por favor, inténtalo de nuevo.',
            'Aceptar'
          );
        }
      });
    }
  }

  deleteTask(projectId: string, todoListId: string, taskId: string, event: Event): void {
    event.stopPropagation();
    this.dialogService.confirm(
      'Eliminar tarea',
      '¿Estás seguro de que deseas eliminar esta tarea?',
      'Eliminar',
      'Cancelar'
    ).then(confirmed => {
      if (confirmed) {
        this.deleteTaskUseCase.execute(projectId, todoListId, taskId).subscribe({
          next: () => {
            if (this.todoListTasks[todoListId]) {
              this.todoListTasks[todoListId] = this.todoListTasks[todoListId].filter(task => task.id !== taskId);
            }
            
            this.recentTasks = this.recentTasks.filter(t => t.id !== taskId);
          },
          error: (err) => {
            console.error('Error deleting task', err);
            this.dialogService.confirm(
              'Error',
              'Error al eliminar la tarea. Por favor, inténtalo de nuevo.',
              'Aceptar'
            );
          }
        });
      }
    });
  }

  navigateToProject(projectId: string, todoListId: string): void {
    if (!this.expandedProjects.includes(projectId)) {
      this.expandedProjects.push(projectId);
      this.loadTodoLists(projectId);
    }
    
    setTimeout(() => {
      if (!this.expandedTodoLists[projectId]) {
        this.expandedTodoLists[projectId] = [];
      }
      
      if (!this.expandedTodoLists[projectId].includes(todoListId)) {
        this.expandedTodoLists[projectId].push(todoListId);
        this.loadTasks(projectId, todoListId);
      }
    }, 300);
  }

  navigateToTaskDetail(projectId: string, todoListId: string, taskId: string): void {
    this.router.navigate(['/projects', projectId, 'todolists', todoListId, 'tasks', taskId, 'edit']);
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  private findProjectIdByTodoListId(todoListId: string): string | null {
    for (const projectId in this.projectTodoLists) {
      const todoLists = this.projectTodoLists[projectId];
      if (todoLists && todoLists.some(todoList => todoList.id === todoListId)) {
        return projectId;
      }
    }
    return null;
  }

  onTaskDrop(event: CdkDragDrop<Task[]>, todoListId: string): void {
    const tasks = this.getPendingTasks(todoListId);
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    if (previousIndex === currentIndex) {
      return;
    }

    const reorderedTasks = [...tasks];
    moveItemInArray(reorderedTasks, previousIndex, currentIndex);

    const taskIds = reorderedTasks.map(task => task.id);
    
    const projectId = this.findProjectIdByTodoListId(todoListId);
    if (!projectId) {
      console.error('No se encontró projectId para todoListId:', todoListId);
      return;
    }

    this.updateTasksOrderUseCase.execute(projectId, todoListId, taskIds).subscribe({
      next: (updatedTasks) => {
        if (updatedTasks && updatedTasks.length > 0) {
          const allTasks = this.todoListTasks[todoListId] || [];
          const completedTasks = allTasks.filter(task => task.completed);
          this.todoListTasks[todoListId] = [...updatedTasks, ...completedTasks];
        }
      },
      error: (error) => {
        console.error('Error al actualizar el orden de las tareas:', error);
      }
    });
  }

}