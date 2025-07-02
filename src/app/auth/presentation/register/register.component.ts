import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRepositoryImpl } from '../../data/auth-repository.impl';
import { RegisterUseCase } from '../../domain/usecases/register.usecase';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: any) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword').setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
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
