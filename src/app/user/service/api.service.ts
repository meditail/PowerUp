import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExerciseLog, TrainingPlan, User } from '../../interface';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  users: User[] = [];
  trainingPlans: TrainingPlan[] = [];
  exerciseLogs: ExerciseLog[] = [];

  getUsers(): Observable<User[]> {
    if (this.users.length) {
      return of(this.users);
    }

    return this.http
      .get<User[]>(`/api/users`)
      .pipe(tap((users) => (this.users = users)));
  }

  getUserById(userId: string): Observable<User> {
    return this.getUsers().pipe(
      map((users) => {
        const user = users.find((u) => u.id === userId);
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      }),
      catchError(this.handleError)
    );
  }

  updateUser(userId: string, updateUser: User): Observable<User> {
    return this.http.put<User>(`/api/users/${userId}`, updateUser).pipe(
      tap((user) => {
        this.users = this.users.map((u) => (u.id === userId ? user : u));
      }),
      catchError(this.handleError)
    );
  }

  getTrainingPlans(): Observable<TrainingPlan[]> {
    if (this.trainingPlans.length) {
      return of(this.trainingPlans);
    }

    return this.http
      .get<TrainingPlan[]>(`/api/trainingPlans`)
      .pipe(tap((trainingPlans) => (this.trainingPlans = trainingPlans)));
  }

  getTrainingPlanById(planId: string): Observable<TrainingPlan> {
    return this.getTrainingPlans().pipe(
      map((trainingPlans) => {
        const trainingPlan = trainingPlans.find((plan) => plan.id === planId);
        if (!trainingPlan) {
          throw new Error('Training Plan not found');
        }
        return trainingPlan;
      })
    );
  }

  getTrainingPlansByUserId(userId: string): Observable<TrainingPlan[]> {
    return this.getTrainingPlans().pipe(
      map((trainingPlans) => trainingPlans.filter((tp) => tp.userId === userId))
    );
  }

  getExerciseLogs(): Observable<ExerciseLog[]> {
    if (this.exerciseLogs.length) {
      return of(this.exerciseLogs);
    }

    return this.http
      .get<ExerciseLog[]>(`/api/exerciseLogs`)
      .pipe(tap((exerciseLogs) => (this.exerciseLogs = exerciseLogs)));
  }

  getExerciseLogsByUserIdAndExerciseId(
    userId: string,
    exerciseId: string
  ): Observable<ExerciseLog[]> {
    return this.getExerciseLogs().pipe(
      map((exerciseLogs) =>
        exerciseLogs.filter(
          (exerciseLog) =>
            exerciseLog.userId === userId &&
            exerciseLog.exerciseId === exerciseId
        )
      )
    );
  }

  saveExerciseLog(exerciseLog: ExerciseLog): Observable<ExerciseLog> {
    return this.http
      .post<ExerciseLog>(`api/exerciseLogs`, exerciseLog)
      .pipe(
        tap(
          (newExerciseLog) =>
            (this.exerciseLogs = [...this.exerciseLogs, newExerciseLog])
        )
      );
  }

  private handleError(err: HttpErrorResponse) {
    if (err.error instanceof ErrorEvent) {
      console.warn('Client-side error', err.message);
    } else {
      console.warn('Server-side error', err.status);
    }
    return throwError(() => new Error(err.message));
  }
}
