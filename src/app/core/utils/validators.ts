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
  if (!email) return null;
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { invalidEmail: true };
  }
  return null;
};

export const strongPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.value;
  if (!password) return null;
  
  const errors: ValidationErrors = {};
  
  if (password.length < 8) {
    errors['minLength'] = true;
  }
  
  if (!/[a-z]/.test(password)) {
    errors['lowercase'] = true;
  }
  
  if (!/[A-Z]/.test(password)) {
    errors['uppercase'] = true;
  }
  
  if (!/[0-9]/.test(password)) {
    errors['number'] = true;
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors['specialChar'] = true;
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const usernameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const username = control.value;
  if (!username) return null;
  
  const errors: ValidationErrors = {};
  
  if (!/^[a-zA-Z0-9_]{3,}$/.test(username)) {
    errors['invalidUsername'] = true;
  }

  if (/^[0-9]/.test(username)) {
    errors['startsWithNumber'] = true;
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const futureDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const date = control.value;
  if (!date) return null;
  
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return { pastDate: true };
  }
  
  return null;
};

export const noWhitespaceValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;
  
  if (value !== value.trim()) {
    return { whitespace: true };
  }
  
  return null;
};
      
export const minWordsValidator = (minWords: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    const wordCount = value.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
    if (wordCount < minWords) {
      return { minWords: { requiredWords: minWords, actualWords: wordCount } };
    }
    
    return null;
  };
};
