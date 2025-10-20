import { NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ExerciseLog } from '../../../interface';

@Component({
  selector: 'app-exercise-log-form',
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './exercise-log-form.component.html',
  styleUrl: './exercise-log-form.component.scss',
})
export class ExerciseLogFormComponent {
  @Input() metric!: 'time' | 'reps' | 'weightedReps';
  @Input() sets!: number;

  @Output() createExerciseLog = new EventEmitter<ExerciseLog>();
  @Output() endWorkout = new EventEmitter();

  getRange() {
    console.log(this.sets);

    return Array.from({ length: this.sets });
  }

  handleCreate(form: NgForm) {
    if (form.valid) {
      let newExerciseLog: ExerciseLog = {
        createdAt: new Date(),
        userId: '',
        exerciseId: '',
      };

      let setValues = Object.keys(form.form.value)
        .filter((key) => key.startsWith('set'))
        .map((key) => form.form.value[key]);

      let weights = Object.keys(form.form.value)
        .filter((key) => key.startsWith('weight'))
        .map((key) => form.form.value[key]);

      switch (this.metric) {
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

      this.createExerciseLog.emit(newExerciseLog);

      form.resetForm();
    } else {
      form.form.markAllAsTouched();
    }
  }

  handleStopWorkout() {
    if (confirm('Workout Beenden?')) {
      this.endWorkout.emit();
    }
  }
}
