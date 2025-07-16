import { AuthRepositoryImpl } from './auth-repository.impl';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { User } from '../domain/models/user.model';

describe('AuthRepositoryImpl', () => {
  let repo: AuthRepositoryImpl;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    repo = new AuthRepositoryImpl(httpSpy);
  });

  it('debería hacer POST a /auth/login en login', () => {
    const userMock = { token: 'abc', email: 'test@email.com' } as User;
    httpSpy.post.and.returnValue(of(userMock));
    repo.login('test@email.com', '123456').subscribe(user => {
      //@ts-ignore
      expect(user).toEqual(userMock);
    });
    //@ts-ignore
    expect(httpSpy.post).toHaveBeenCalledWith(
      `${environment.apiUrl}/auth/login`,
      { email: 'test@email.com', password: '123456' }
    );
  });

  it('debería hacer POST a /users/register en register', () => {
    const userMock = { token: 'abc', email: 'test@email.com' } as User;
    httpSpy.post.and.returnValue(of(userMock));
    repo.register('usuario', 'Nombre', 'test@email.com', '123456').subscribe(user => {
      //@ts-ignore
      expect(user).toEqual(userMock);
    });
    //@ts-ignore
    expect(httpSpy.post).toHaveBeenCalledWith(
      `${environment.apiUrl}/users/register`,
      { username: 'usuario', name: 'Nombre', email: 'test@email.com', password: '123456' }
    );
  });

  it('debería hacer GET a /auth/me en getCurrentUser', () => {
    const userMock = { token: 'abc', email: 'test@email.com' } as User;
    httpSpy.get.and.returnValue(of(userMock));
    repo.getCurrentUser().subscribe(user => {
      //@ts-ignore
      expect(user).toEqual(userMock);
    });
    //@ts-ignore
    expect(httpSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/auth/me`);
  });
}); 