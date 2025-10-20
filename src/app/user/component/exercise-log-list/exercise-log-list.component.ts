import { Component, Input } from '@angular/core';
import { Exercise, ExerciseLog } from '../../../interface';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-exercise-log-list',
  imports: [NgForOf, NgIf],
  templateUrl: './exercise-log-list.component.html',
  styleUrl: './exercise-log-list.component.scss',
})
export class ExerciseLogListComponent {
  @Input() exercise!: Exercise;
  @Input() exerciseLogs!: ExerciseLog[];

  cutLogsAt = 5;

  getRange(n: number) {
    return Array.from({ length: n });
  }
}
