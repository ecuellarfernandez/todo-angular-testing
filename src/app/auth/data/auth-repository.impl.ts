import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthRepository} from '../domain/repositories/auth.repository';
import {environment} from '../../../enviroments/enviroment';
import {User} from '../domain/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthRepositoryImpl implements AuthRepository {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(username: string, name: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/register`, { username, name, email, password });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`);
  }
}
