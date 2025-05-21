import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export abstract class AuthRepository {
  abstract login(email: string, password: string): Observable<User>;
}
