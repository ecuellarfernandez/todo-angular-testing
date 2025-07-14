import { of } from 'rxjs';
import { LoginUseCase } from './login.usecase';
import { AuthRepository } from '../repositories/auth.repository';
import { User } from '../models/user.model';

describe('LoginUseCase', () => {
  let usecase: LoginUseCase;
  let authRepositorySpy: jasmine.SpyObj<AuthRepository>;

  beforeEach(() => {
    authRepositorySpy = jasmine.createSpyObj<AuthRepository>('AuthRepository', ['login']);
    usecase = new LoginUseCase(authRepositorySpy);
  });

  it('should call authRepository.login and return the user', (done) => {
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'test@test.com',
      token: 'token123'
    };
    authRepositorySpy.login.and.returnValue(of(mockUser));

    usecase.execute('test@test.com', 'password123').subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(authRepositorySpy.login).toHaveBeenCalledWith('test@test.com', 'password123');
      done();
    });
  });
});
