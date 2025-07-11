import { Routes } from '@angular/router';
import { LoginComponent } from './auth/presentation/login/login.component';
import { RegisterComponent } from './auth/presentation/register/register.component';
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

];
