import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {
  transform(minutes: number): string {
    if (isNaN(minutes) || minutes < 0) {
      return 'Invalid time';
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours} h ${remainingMinutes} min`;
  }
}
