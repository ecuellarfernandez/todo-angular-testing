import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthRepository } from '../repositories/auth.repository';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(email: string, password: string): Observable<User> {
    return this.authRepository.login(email, password);
  }
}
