import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    //@ts-ignore
    expect(component).toBeTruthy();
  });

  it('debería marcar el formulario como inválido si los campos están vacíos', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    //@ts-ignore
    expect(component.form.invalid).toBeTrue();
  });

  it('debería marcar todos los campos como tocados si el formulario es inválido', () => {
    const markAllAsTouchedSpy = spyOn(component.form, 'markAllAsTouched');
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    component.onSubmit();
    //@ts-ignore
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('debería mostrar mensaje de error si login falla', () => {
    const error = 'Credenciales inválidas. Por favor, inténtelo de nuevo.';
    spyOn(component['loginUseCase'], 'execute').and.returnValue({
      subscribe: (handlers: any) => {
        handlers.error('error');
      }
    } as any);
    component.form.controls['email'].setValue('test@email.com');
    component.form.controls['password'].setValue('123456');
    component.onSubmit();
    //@ts-ignore
    expect(component.errorMessage).toBe(error);
  });

  it('debería guardar el token en localStorage y navegar a /dashboard tras login exitoso', () => {
    spyOn(localStorage, 'setItem');
    const userMock = { token: 'abc123', email: 'test@email.com' };
    spyOn(component['loginUseCase'], 'execute').and.returnValue({
      subscribe: (handlers: any) => {
        handlers.next(userMock);
      }
    } as any);
    component.form.controls['email'].setValue('test@email.com');
    component.form.controls['password'].setValue('123456');
    component.onSubmit();
    //@ts-ignore
    expect(localStorage.setItem).toHaveBeenCalledWith('jwt', 'abc123');
    //@ts-ignore
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debería navegar a /register cuando se llama navigateToRegister', () => {
    component.navigateToRegister();
    //@ts-ignore
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/register']);
  });
});

