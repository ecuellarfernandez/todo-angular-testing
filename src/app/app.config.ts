import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { AuthRepository } from './auth/domain/repositories/auth.repository';
import { AuthRepositoryImpl } from './auth/data/auth-repository.impl';
import { ProjectRepository } from './projects/domain/repositories/project.repository';
import { ProjectRepositoryImpl } from './projects/data/project-repository.impl';
import { TaskRepository } from './tasks/domain/repositories/task.repository';
import { TaskRepositoryImpl } from './tasks/data/task-repository.impl';
import { TodoListRepository } from './todolists/domain/repositories/todolist.repository';
import { TodoListRepositoryImpl } from './todolists/data/todolist-repository.impl';
import { DialogService } from './core/services/dialog.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    { provide: ProjectRepository, useClass: ProjectRepositoryImpl },
    { provide: TaskRepository, useClass: TaskRepositoryImpl },
    { provide: TodoListRepository, useClass: TodoListRepositoryImpl },
    DialogService
  ]
};
