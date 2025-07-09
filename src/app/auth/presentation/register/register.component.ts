import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRepositoryImpl } from '../../data/auth-repository.impl';
import { RegisterUseCase } from '../../domain/usecases/register.usecase';
import {
  emailValidator, 
  passwordMatchValidator, 
  strongPasswordValidator, 
  usernameValidator, 
  noWhitespaceValidator
} from '../../../core/utils/validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  providers: [
    AuthRepositoryImpl,
    {
      provide: RegisterUseCase,
      useFactory: (repo: AuthRepositoryImpl) => new RegisterUseCase(repo),
      deps: [AuthRepositoryImpl]
    }
  ]
})
export class RegisterComponent implements OnInit {
  form: any;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private registerUseCase: RegisterUseCase,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        usernameValidator,
        noWhitespaceValidator
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
        noWhitespaceValidator
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        emailValidator,
        noWhitespaceValidator
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        strongPasswordValidator,
        noWhitespaceValidator
      ]],
      confirmPassword: ['', [
        Validators.required,
        noWhitespaceValidator
      ]]
    }, {
      validators: passwordMatchValidator
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const username = this.form.get('username')?.value;
      const name = this.form.get('name')?.value;
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;

      this.registerUseCase.execute(username, name, email, password).subscribe({
        next: (user) => {
          console.log('Usuario registrado:', user);
          localStorage.setItem('jwt', user.token);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error en el registro:', err);
          this.errorMessage = 'Error al registrar el usuario. Por favor, inténtelo de nuevo.';
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
