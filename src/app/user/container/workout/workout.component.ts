import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Exercise, ExerciseLog, TrainingPlan } from '../../../interface';
import { NgIf } from '@angular/common';
import { Observable, of, switchMap } from 'rxjs';
import { ExerciseLogListComponent } from '../../component/exercise-log-list/exercise-log-list.component';
import { ExerciseLogFormComponent } from '../../component/exercise-log-form/exercise-log-form.component';

@Component({
  selector: 'app-workout',
  imports: [NgIf, ExerciseLogFormComponent, ExerciseLogListComponent],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.scss',
})
export class WorkoutComponent implements OnInit {
  trainingPlan!: TrainingPlan;
  selectedExercise!: Exercise;
  selectedExerciseIndex = 0;
  exerciseLogs: ExerciseLog[] = [];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('userId') ?? '-1';
    const planId = this.route.snapshot.paramMap.get('planId') ?? '-1';

    this.apiService
      .getTrainingPlanById(planId)
      .pipe(
        switchMap((trainingPlan) => {
          this.trainingPlan = trainingPlan;

          if (trainingPlan.exercises.length) {
            this.selectedExercise = trainingPlan.exercises[0];
            const exerciseId = this.selectedExercise.id;
            return this.apiService.getExerciseLogsByUserIdAndExerciseId(
              userId,
              exerciseId
            );
          } else {
            return of([]);
          }
        })
      )
      .subscribe({
        next: (exerciseLogs) => {
          this.exerciseLogs = exerciseLogs;
        },
      });
  }

  nextExercise(): Observable<ExerciseLog[]> {
    const userId = this.route.snapshot.paramMap.get('userId')!;
    this.selectedExerciseIndex++;

    if (this.selectedExerciseIndex < this.trainingPlan.exercises.length) {
      this.selectedExercise =
        this.trainingPlan.exercises[this.selectedExerciseIndex];
      return this.apiService.getExerciseLogsByUserIdAndExerciseId(
        userId,
        this.selectedExercise.id
      );
    } else {
      alert('Workout abgeschlossen');
      this.router.navigate(['dashboard', userId]);
      return of();
    }
  }

  saveWorkout(newExerciseLog: ExerciseLog) {
    const userId = this.route.snapshot.paramMap.get('userId')!;

    newExerciseLog.userId = userId;
    newExerciseLog.exerciseId = this.selectedExercise.id;

    this.apiService
      .saveExerciseLog(newExerciseLog)
      .pipe(switchMap(() => this.nextExercise()))
      .subscribe({
        next: (exerciseLogs) => (this.exerciseLogs = exerciseLogs),
      });
  }

  stopWorkout() {
    const userId = this.route.snapshot.paramMap.get('userId')!;
    this.router.navigate(['dashboard', userId]);
  }

  skipExercise() {
    this.nextExercise().subscribe({
      next: (exerciseLogs) => {
        if (exerciseLogs) this.exerciseLogs = exerciseLogs;
      },
    });
  }
}
