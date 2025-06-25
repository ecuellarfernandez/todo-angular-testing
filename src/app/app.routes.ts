import { Routes } from '@angular/router';
import { LoginComponent } from './auth/presentation/login/login.component';
import { RegisterComponent } from './auth/presentation/register/register.component';
import { ProjectListComponent } from './projects/presentation/project-list/project-list.component';
import { ProjectFormComponent } from './projects/presentation/project-form/project-form.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
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
  }
];
