import { of } from 'rxjs';
import { GetCurrentUserUsecase } from './get-current-user.usecase';
import { AuthRepository } from '../repositories/auth.repository';
import { User } from '../models/user.model';

describe('GetCurrentUserUsecase', () => {
  let usecase: GetCurrentUserUsecase;
  let authRepositorySpy: jasmine.SpyObj<AuthRepository>;

  beforeEach(() => {
    authRepositorySpy = jasmine.createSpyObj<AuthRepository>('AuthRepository', ['getCurrentUser']);
    usecase = new GetCurrentUserUsecase(authRepositorySpy);
  });

  it('should call authRepository.getCurrentUser and return the user', (done) => {
    const mockUser: User = {
      id: '1',
      username: 'testuser',
      email: 'test@test.com',
      token: 'token123'
    };
    authRepositorySpy.getCurrentUser.and.returnValue(of(mockUser));

    usecase.execute().subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(authRepositorySpy.getCurrentUser).toHaveBeenCalled();
      done();
    });
  });
});
