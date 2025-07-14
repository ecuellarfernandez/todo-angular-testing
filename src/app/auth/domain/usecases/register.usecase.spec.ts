import { of } from 'rxjs';
import { RegisterUseCase } from './register.usecase';
import { AuthRepository } from '../repositories/auth.repository';
import { User } from '../models/user.model';

describe('RegisterUseCase', () => {
  let usecase: RegisterUseCase;
  let authRepositorySpy: jasmine.SpyObj<AuthRepository>;

  beforeEach(() => {
    authRepositorySpy = jasmine.createSpyObj<AuthRepository>('AuthRepository', ['register']);
    usecase = new RegisterUseCase(authRepositorySpy);
  });

  it('should call authRepository.register and return the user', (done) => {
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'test@test.com',
      token: 'token123'
    };
    authRepositorySpy.register.and.returnValue(of(mockUser));

    usecase.execute('testuser', 'Test', 'test@test.com', 'password123').subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(authRepositorySpy.register).toHaveBeenCalledWith('testuser', 'Test', 'test@test.com', 'password123');
      done();
    });
  });
});
