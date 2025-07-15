import { RegisterUseCase } from './register.usecase';
import { AuthRepository } from '../repositories/auth.repository';
import { of } from 'rxjs';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let authRepositorySpy: jasmine.SpyObj<AuthRepository>;

  beforeEach(() => {
    authRepositorySpy = jasmine.createSpyObj('AuthRepository', ['register']);
    useCase = new RegisterUseCase(authRepositorySpy);
  });

  it('debería llamar a authRepository.register con los parámetros correctos', () => {
    const username = 'usuario';
    const name = 'Nombre';
    const email = 'test@email.com';
    const password = '123456';
    const userMock = { token: 'abc', email } as any;
    authRepositorySpy.register.and.returnValue(of(userMock));

    useCase.execute(username, name, email, password).subscribe(user => {
      expect(user).toEqual(userMock);
    });
    expect(authRepositorySpy.register).toHaveBeenCalledWith(username, name, email, password);
  });
}); 