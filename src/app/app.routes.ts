import { Routes } from '@angular/router';
import { LoginComponent } from './auth/presentation/login/login.component';
import { RegisterComponent } from './auth/presentation/register/register.component';
import { ProjectListComponent } from './projects/presentation/project-list/project-list.component';
import { ProjectFormComponent } from './projects/presentation/project-form/project-form.component';
import { TodoListListComponent } from './todolists/presentation/todolist-list/todolist-list.component';
import { TodoListFormComponent } from './todolists/presentation/todolist-form/todolist-form.component';
import { TaskListComponent } from './tasks/presentation/task-list/task-list.component';
import { TaskFormComponent } from './tasks/presentation/task-form/task-form.component';
import { authGuard } from './core/guards/auth.guard';

import { DashboardComponent } from './core/components/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'projects',
    component: ProjectListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'projects/new',
    component: ProjectFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'projects/:id/edit',
    component: ProjectFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'projects/:id/todolists',
    component: TodoListListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'projects/:projectId/todolists/new',
    component: TodoListFormComponent,
    canActivate: [authGuard]
  },
  {    path: 'projects/:projectId/todolists/:todoListId/edit',
    component: TodoListFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'projects/:projectId/todolists/:todoListId/tasks',
    component: TaskListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'projects/:projectId/todolists/:todoListId/tasks/new',
    component: TaskFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'projects/:projectId/todolists/:todoListId/tasks/:taskId/edit',
    component: TaskFormComponent,
    canActivate: [authGuard]
  }
];
