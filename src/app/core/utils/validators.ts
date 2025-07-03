import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  if (password !== confirmPassword) {
    form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
};

export const emailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const email = control.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    control.get('email')?.setErrors({ invalidEmail: true });
    return { invalidEmail: true };
  }
  return null;
};
