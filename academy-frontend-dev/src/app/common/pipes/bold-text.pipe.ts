import {Pipe, PipeTransform} from '@angular/core';
import {noop} from 'rxjs';

@Pipe({
  name: 'boldText',
  standalone: true
})
export class BoldTextPipe implements PipeTransform {
  transform(value: string): any {
    const regex = /[\*][\w\W]*[\*]/gim;
    return this.replace(value, regex);
  }

  replace(str: string, regex: RegExp) {
    let matched = str.match(regex);
    matched
      ? matched.forEach(foundString => {
          foundString = foundString.substring(1, foundString.length - 1);
          str = str.replace(regex, `<b>${foundString}</b>`);
        })
      : noop;
    return str;
  }
}
