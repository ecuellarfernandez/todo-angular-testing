import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export abstract class AuthRepository {
  abstract login(email: string, password: string): Observable<User>;
  abstract register(username: string, name: string, email: string, password: string): Observable<User>;
  abstract getCurrentUser(): Observable<User>;
}
