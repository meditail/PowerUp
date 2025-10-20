export interface User {
  id: string;
  name: string;
  lastPlan: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  metric: 'reps' | 'time' | 'weightedReps';
}

export interface TrainingPlan {
  id: string;
  userId: string;
  name: string;
  exercises: Exercise[];
}

export interface ExerciseLog {
  id?: string;
  userId: string;
  exerciseId: string;
  reps?: number[];
  weight?: number[];
  time?: number[];
  createdAt: Date;
}
