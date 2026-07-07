import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusColor', standalone: true })
export class StatusColorPipe implements PipeTransform {
  transform(status: string): string {
    const map: Record<string, string> = {
      completed: '#2e7d32',
      active: '#2e7d32',
      pending: '#e65100',
      failed: '#c62828',
      inactive: '#c62828',
    };
    return map[status] ?? '#666';
  }
}
