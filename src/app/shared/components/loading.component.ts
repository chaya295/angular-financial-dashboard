import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="loading-wrap">
      <mat-spinner [diameter]="diameter"></mat-spinner>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; gap: 16px; }
    p { color: #666; }
  `],
})
export class LoadingComponent {
  @Input() diameter = 40;
  @Input() message = '';
}
