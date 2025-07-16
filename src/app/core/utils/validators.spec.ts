import {
  passwordMatchValidator,
  emailValidator,
  strongPasswordValidator,
  usernameValidator,
  futureDateValidator,
  noWhitespaceValidator,
  minWordsValidator
} from './validators';
import { FormControl, FormGroup } from '@angular/forms';

describe('Validators', () => {
  describe('passwordMatchValidator', () => {
    it('debería retornar null si las contraseñas coinciden', () => {
      const form = new FormGroup({
        password: new FormControl('abc123'),
        confirmPassword: new FormControl('abc123')
      });
      //@ts-ignore
      expect(passwordMatchValidator(form)).toBeNull();
    });
    it('debería retornar error si las contraseñas no coinciden', () => {
      const form = new FormGroup({
        password: new FormControl('abc123'),
        confirmPassword: new FormControl('xyz456')
      });
      //@ts-ignore
      expect(passwordMatchValidator(form)).toEqual({ passwordMismatch: true });
    });
  });

  describe('emailValidator', () => {
    it('debería retornar null para un email válido', () => {
      const control = new FormControl('test@email.com');
      //@ts-ignore
      expect(emailValidator(control)).toBeNull();
    });
    it('debería retornar error para un email inválido', () => {
      const control = new FormControl('no-es-email');
      //@ts-ignore
      expect(emailValidator(control)).toEqual({ invalidEmail: true });
    });
    it('debería retornar null si el valor está vacío', () => {
      const control = new FormControl('');
      //@ts-ignore
      expect(emailValidator(control)).toBeNull();
    });
  });

  describe('strongPasswordValidator', () => {
    it('debería retornar null para una contraseña fuerte', () => {
      const control = new FormControl('Abcdef1!');
      //@ts-ignore
      expect(strongPasswordValidator(control)).toBeNull();
    });
    it('debería retornar errores para una contraseña débil', () => {
      const control = new FormControl('ABC123');
      const result = strongPasswordValidator(control);
      //@ts-ignore
      expect(result).toBeTruthy();
      //@ts-ignore
      expect(result!['minLength']).toBeTrue();
      //@ts-ignore
      expect(result!['lowercase']).toBeTrue();
      //@ts-ignore
      expect(result!['specialChar']).toBeTrue();
    });

    it('debería retornar error de mayúsculas para contraseña sin mayúsculas', () => {
      const control = new FormControl('abc123!');
      const result = strongPasswordValidator(control);
      //@ts-ignore
      expect(result).toBeTruthy();
      //@ts-ignore
      expect(result!['uppercase']).toBeTrue();
    });

    it('debería retornar error de números para contraseña sin números', () => {
      const control = new FormControl('Abcdef!');
      const result = strongPasswordValidator(control);
      //@ts-ignore
      expect(result).toBeTruthy();
      //@ts-ignore
      expect(result!['number']).toBeTrue();
    });
    it('debería retornar null si el valor está vacío', () => {
      const control = new FormControl('');
      //@ts-ignore
      expect(strongPasswordValidator(control)).toBeNull();
    });
  });

  describe('usernameValidator', () => {
    it('debería retornar null para un username válido', () => {
      const control = new FormControl('usuario_123');
      //@ts-ignore
      expect(usernameValidator(control)).toBeNull();
    });
    it('debería retornar error para un username inválido', () => {
      const control = new FormControl('us');
      //@ts-ignore
      expect(usernameValidator(control)).toEqual({ invalidUsername: true });
    });
    it('debería retornar error si empieza con número', () => {
      const control = new FormControl('1usuario');
      //@ts-ignore
        expect(usernameValidator(control)).toEqual({ startsWithNumber: true });
    });
    it('debería retornar null si el valor está vacío', () => {
      const control = new FormControl('');
      //@ts-ignore
      expect(usernameValidator(control)).toBeNull();
    });

  });

  describe('futureDateValidator', () => {
    it('debería retornar null para una fecha futura', () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      const control = new FormControl(future.toISOString().substring(0, 10));
      //@ts-ignore
      expect(futureDateValidator(control)).toBeNull();
    });
    it('debería retornar error para una fecha pasada', () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      const control = new FormControl(past.toISOString().substring(0, 10));
      //@ts-ignore
      expect(futureDateValidator(control)).toEqual({ pastDate: true });
    });
    it('debería retornar null si el valor está vacío', () => {
      const control = new FormControl('');
      //@ts-ignore
      expect(futureDateValidator(control)).toBeNull();
    });
  });

  describe('noWhitespaceValidator', () => {
    it('debería retornar null si no hay espacios al inicio o final', () => {
      const control = new FormControl('texto');
      //@ts-ignore
      expect(noWhitespaceValidator(control)).toBeNull();
    });
    it('debería retornar error si hay espacios al inicio o final', () => {
      const control = new FormControl(' texto ');
      //@ts-ignore
      expect(noWhitespaceValidator(control)).toEqual({ whitespace: true });
    });
    it('debería retornar null si el valor está vacío', () => {
      const control = new FormControl('');
      //@ts-ignore
      expect(noWhitespaceValidator(control)).toBeNull();
    });
  });

  describe('minWordsValidator', () => {
    it('debería retornar null si hay suficientes palabras', () => {
      const control = new FormControl('esto es una prueba');
      //@ts-ignore
      expect(minWordsValidator(3)(control)).toBeNull();
    });
    it('debería retornar error si hay menos palabras de las requeridas', () => {
      const control = new FormControl('solo dos');
      //@ts-ignore
      expect(minWordsValidator(3)(control)).toEqual({ minWords: { requiredWords: 3, actualWords: 2 } });
    });
    it('debería retornar null si el valor está vacío', () => {
      const control = new FormControl('');
      //@ts-ignore
      expect(minWordsValidator(3)(control)).toBeNull();
    });
  });

}); 