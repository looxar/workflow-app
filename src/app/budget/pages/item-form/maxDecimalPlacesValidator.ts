import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function maxDecimalPlacesValidator(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && !new RegExp(`^\\d+(\\.\\d{1,${max}})?$`).test(value)) {
      return { maxDecimalPlaces: { requiredLength: max, actualLength: value.toString().split('.')[1]?.length || 0 } };
    }
    return null;
  };
}
