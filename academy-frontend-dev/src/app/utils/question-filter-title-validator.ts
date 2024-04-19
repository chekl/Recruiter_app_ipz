import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function questionFilterTitleValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value
      .trim()
      .split(/[\s,\t\n]+/)
      .join(' ');

    if (value.length > 0 && value.length < 3) return {titleInvalid: true};

    return null;
  };
}
