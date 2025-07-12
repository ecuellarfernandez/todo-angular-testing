import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { TaskRepository } from '../repositories/task.repository';
import { ProjectRepository } from '../../../projects/domain/repositories/project.repository';
import { TodoListRepository } from '../../../todolists/domain/repositories/todolist.repository';

@Injectable({ providedIn: 'root' })
export class GetRecentTasksUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private projectRepository: ProjectRepository,
    private todoListRepository: TodoListRepository
  ) {}

  execute(): Observable<Task[]> {
    // Primero obtenemos todos los proyectos
    return this.projectRepository.getProjects().pipe(
      switchMap(projects => {
        if (projects.length === 0) {
          return of([]);
        }

        // Para cada proyecto, obtenemos sus listas de tareas
        const todoListObservables = projects.map(project => 
          this.todoListRepository.getTodoLists(project.id).pipe(
            map(todoLists => ({ project, todoLists })),
            catchError(() => of({ project, todoLists: [] }))
          )
        );

        return forkJoin(todoListObservables).pipe(
          switchMap(projectsWithTodoLists => {
            // Para cada lista de tareas, obtenemos sus tareas
            const taskObservables: Observable<Task[]>[] = [];

            projectsWithTodoLists.forEach(({ project, todoLists }) => {
              todoLists.forEach(todoList => {
                taskObservables.push(
                  this.taskRepository.getTasks(project.id, todoList.id).pipe(
                    catchError(() => of([]))
                  )
                );
              });
            });

            if (taskObservables.length === 0) {
              return of([]);
            }

            return forkJoin(taskObservables).pipe(
              map(taskArrays => {
                // Aplanamos el array de arrays de tareas
                const allTasks = taskArrays.reduce((acc, tasks) => acc.concat(tasks), []);
                
                // Ordenamos por fecha de creación (más recientes primero)
                return allTasks.sort((a, b) => {
                  const dateA = new Date(a.createdAt || 0);
                  const dateB = new Date(b.createdAt || 0);
                  return dateB.getTime() - dateA.getTime();
                }).slice(0, 5); // Limitamos a 5 tareas recientes
              })
            );
          })
        );
      }),
      catchError(() => of([]))
    );
  }
}