import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthRepository} from '../../domain/repositories/auth.repository';
import {AuthRepositoryImpl} from '../../data/auth-repository.impl';
import {LoginUseCase} from '../../domain/usecases/login.usecase';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
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
  constructor(private fb: FormBuilder, private loginUseCase: LoginUseCase) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const email = this.form.get('email')?.value!;
      const password = this.form.get('password')?.value!;
      this.loginUseCase.execute(email, password).subscribe({
        next: (user) => console.log('Usuario autenticado:', user),
        error: (err) => console.error('Error en la autenticación:', err),
      });
    }
  }

}
