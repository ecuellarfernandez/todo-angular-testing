import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(username: string, name: string, email: string, password: string): Observable<User> {
    return this.authRepository.register(username, name, email, password);
  }
}