import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthRepository} from '../../domain/repositories/auth.repository';
import {AuthRepositoryImpl} from '../../data/auth-repository.impl';
import {LoginUseCase} from '../../domain/usecases/login.usecase';
import {emailValidator, noWhitespaceValidator} from '../../../core/utils/validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'login.component.html',
  providers:[
    AuthRepositoryImpl,
    {
      provide: LoginUseCase,
      useFactory: (repo: AuthRepositoryImpl) => new LoginUseCase(repo),
      deps: [AuthRepositoryImpl]
    }
  ]
})
export class LoginComponent implements OnInit {
  form: any;
  errorMessage: string = '';
  
  constructor(
    private fb: FormBuilder, 
    private loginUseCase: LoginUseCase,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        emailValidator,
        noWhitespaceValidator
      ]],
      password: ['', [
        Validators.required,
        noWhitespaceValidator
      ]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const email = this.form.get('email')?.value!;
      const password = this.form.get('password')?.value!;
      this.loginUseCase.execute(email, password).subscribe({
        next: (user) => {
          console.log('Usuario autenticado:', user);
          localStorage.setItem('jwt', user.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error en la autenticación:', err);
          this.errorMessage = 'Credenciales inválidas. Por favor, inténtelo de nuevo.';
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
  
  navigateToRegister() {
    this.router.navigate(['/register']);
  }

}
