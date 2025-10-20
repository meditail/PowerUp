import { NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TrainingPlan, User } from '../../../interface';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingPlanComponent } from '../../component/training-plan/training-plan.component';

@Component({
  selector: 'app-dashboard',
  imports: [NgIf, TrainingPlanComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  user!: User;

  selectedPlan!: TrainingPlan | null;
  plans: TrainingPlan[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId') ?? '-1';

    this.apiService.getUserById(userId).subscribe({
      next: (user: User) => {
        this.user = user;
      },
      error: () => {
        this.router.navigate(['']);
      },
    });

    this.apiService.getTrainingPlansByUserId(userId).subscribe({
      next: (trainingPlans: TrainingPlan[]) => {
        this.plans = trainingPlans;
        this.selectedPlan = this.plans[0] ?? null;
      },
      error: () => {
        console.log('Error: getTrainingPlans');
      },
    });
  }

  selectOnChange(trainingPlan: TrainingPlan) {
    this.selectedPlan = trainingPlan;
  }

  startWorkout() {
    if (this.user && this.selectedPlan) {
      this.apiService
        .updateUser(this.user.id, {
          ...this.user,
          lastPlan: this.selectedPlan.name,
        })
        .subscribe({
          next: () => {
            this.router.navigate([
              'workout',
              this.user.id,
              this.selectedPlan!.id,
            ]);
          },
        });
    }
  }
}
