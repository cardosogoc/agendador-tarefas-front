import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Tasks } from './pages/tasks/tasks';
import { authGuard } from './guards/auth-guard';
import { UserData } from './pages/user-data/user-data';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'tasks', component: Tasks, canActivate: [authGuard] },
  { path: 'user-data', component: UserData, canActivate: [authGuard] },
];
