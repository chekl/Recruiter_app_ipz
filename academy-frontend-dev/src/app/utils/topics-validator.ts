import {AbstractControl, ValidatorFn} from '@angular/forms';

export function maxTopicsValidator(max: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const topics: any[] = control.value;
    if (topics && topics.length > max) {
      return {maxTopics: {max}};
    }
    return null;
  };
}
