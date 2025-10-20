import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TrainingPlan } from '../../../interface';
import { NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-training-plan',
  imports: [FormsModule, NgForOf],
  templateUrl: './training-plan.component.html',
  styleUrl: './training-plan.component.scss',
})
export class TrainingPlanComponent {
  @Input() trainingPlans: TrainingPlan[] = [];
  @Input() selectedPlan: TrainingPlan | null = null;

  @Output() planSelected = new EventEmitter<TrainingPlan>();

  onChange() {
    if (this.selectedPlan) {
      this.planSelected.emit(this.selectedPlan);
    }
  }
}
