import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Exercise, ExerciseLog, TrainingPlan } from '../../../interface';
import { NgIf, NgForOf, JsonPipe } from '@angular/common';
import { of, startWith, switchMap } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-workout',
  imports: [FormsModule, NgIf, NgForOf],
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

  getRange(n: number) {
    return Array.from({ length: n });
  }

  private loadExercise() {
    const userId = this.route.snapshot.paramMap.get('userId') ?? '-1';

    this.selectedExercise =
      this.trainingPlan.exercises[this.selectedExerciseIndex];
    this.apiService
      .getExerciseLogsByUserIdAndExerciseId(userId, this.selectedExercise.id)
      .subscribe({
        next: (exerciseLogs) => (this.exerciseLogs = exerciseLogs),
      });
  }

  saveWorkout(form: NgForm) {
    if (form.valid) {
      const userId = this.route.snapshot.paramMap.get('userId')!;

      let setValues = Object.keys(form.form.value)
        .filter((key) => key.startsWith('set') || key.startsWith('reps'))
        .map((key) => form.form.value[key]);

      let weights = Object.keys(form.form.value)
        .filter((key) => key.startsWith('weight'))
        .map((key) => form.form.value[key]);

      let newExerciseLog: ExerciseLog = {
        userId,
        exerciseId: this.selectedExercise.id,
        createdAt: new Date(),
      };

      switch (this.selectedExercise.metric) {
        case 'reps':
          newExerciseLog.reps = setValues;
          break;
        case 'time':
          newExerciseLog.time = setValues;
          break;
        case 'weightedReps':
          newExerciseLog.reps = setValues;
          newExerciseLog.weight = weights;
          break;
      }

      this.apiService.saveExerciseLog(newExerciseLog).subscribe(() => {
        this.selectedExerciseIndex++;
        if (this.selectedExerciseIndex < this.trainingPlan.exercises.length) {
          this.loadExercise();
          form.resetForm();
        } else {
          alert('Workout abgeschlossen');
          this.router.navigate(['dashboard', userId]);
        }
      });
    } else {
      form.form.markAllAsTouched();
    }
  }

  stopWorkoutSession() {
    let stop = confirm('Workout wirklich beenden?');
    if (stop) {
      const userId = this.route.snapshot.paramMap.get('userId')!;
      this.router.navigate(['dashboard', userId]);
    }
  }
}
