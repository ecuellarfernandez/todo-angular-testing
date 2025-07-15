import { LoginUseCase } from './login.usecase';
import { AuthRepository } from '../repositories/auth.repository';
import { of } from 'rxjs';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let authRepositorySpy: jasmine.SpyObj<AuthRepository>;

  beforeEach(() => {
    authRepositorySpy = jasmine.createSpyObj('AuthRepository', ['login']);
    useCase = new LoginUseCase(authRepositorySpy);
  });

  it('debería llamar a authRepository.login con los parámetros correctos', () => {
    const email = 'test@email.com';
    const password = '123456';
    const userMock = { token: 'abc', email } as any;
    authRepositorySpy.login.and.returnValue(of(userMock));

    useCase.execute(email, password).subscribe(user => {
      expect(user).toEqual(userMock);
    });
    expect(authRepositorySpy.login).toHaveBeenCalledWith(email, password);
  });
}); 