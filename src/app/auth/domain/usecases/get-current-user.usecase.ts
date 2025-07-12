import { Injectable } from '@angular/core';
import {AuthRepository} from '../repositories/auth.repository';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class GetCurrentUserUsecase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Observable<User> {
    return this.authRepository.getCurrentUser();
  }
}
