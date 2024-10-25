// app.routes.ts
import { Routes } from '@angular/router';
import { loggedInGuard } from './auth/guards/logged-in.guard';
import { CreateComponent } from './user/create/create.component';
import { rolesGuard } from './auth/guards/roles.guard';
import { Role } from './auth/models/logged-in-user';
import { UserListComponent } from './user/user-list/user-list.component';

export const routes: Routes = [
    {
        path: 'budget',
        loadChildren: () => import('./budget/budget.routes'),
        canActivate: [loggedInGuard] // add
      }, 
      { path: 'auth', 
        loadChildren: () => import('./auth/auth.routes') 
      },
      {
        path: 'user/list',
        component: UserListComponent,
        canActivate: [rolesGuard([Role.MANAGER])], // Restrict access to MANAGER role
        title: 'User List'
      },
      {
        path: 'user/create',
        component: CreateComponent,
        canActivate: [rolesGuard([Role.MANAGER])], // Allow only MANAGER role
        title: 'Create User'
      },
];