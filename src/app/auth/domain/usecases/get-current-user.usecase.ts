import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../repositories/auth.repository';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class GetCurrentUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Observable<User> {
    return this.authRepository.getCurrentUser();
  }
}
