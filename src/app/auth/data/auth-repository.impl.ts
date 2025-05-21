import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthRepository} from '../domain/repositories/auth.repository';
import {environment} from '../../../enviroments/enviroment';
import {User} from '../domain/models/user.model';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password });
  }
}
