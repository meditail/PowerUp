import { Routes } from '@angular/router';
import { DashboardComponent } from './container/dashboard/dashboard.component';
import { WorkoutComponent } from './container/workout/workout.component';
import { UserSelectComponent } from './container/user-select/user-select.component';

export const routes: Routes = [
  {
    path: '',
    component: UserSelectComponent,
  },
  {
    path: 'dashboard/:userId',
    component: DashboardComponent,
  },
  {
    path: 'workout/:userId/:planId',
    component: WorkoutComponent,
  },
];
